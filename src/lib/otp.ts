// src/lib/otp.ts
// OTP (One-Time Password) Service - Handles secure verification code generation and validation
// This is like a digital lock and key system - only the person with the correct phone receives the code

import crypto from 'crypto';
import { prisma } from './prisma';
import { generateOtp, sendSms } from './sms';

// Configuration for OTP security
const OTP_CONFIG = {
  length: parseInt(process.env.OTP_LENGTH || '6'),    // 6-digit code
  expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10'), // Code expires after 10 minutes
  maxAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS || '3'), // Lock after 3 wrong attempts
};

/**
 * Hash an OTP code for secure storage
 * 
 * Security principle: NEVER store plain-text OTP codes in database
 * If the database is compromised, attackers still can't see the actual codes
 * 
 * We use SHA-256 hashing with a salt (random value) to prevent rainbow table attacks
 * This is the same principle used by banks for PIN storage
 * 
 * @param otp - The plain OTP code to hash
 * @param salt - A random salt value (if not provided, generates one)
 * @returns Object containing the hash and the salt used
 */
function hashOtp(otp: string, salt?: string): { hash: string; salt: string } {
  // Generate a random salt if not provided
  // Salt is like a unique seasoning that makes each hash different
  // Even if two people have the same OTP, their hashes will be different
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  
  // Create the hash using SHA-256 algorithm
  // Combine the salt with the OTP before hashing
  // This prevents attackers from using pre-computed tables of hashes
  const hash = crypto
    .createHmac('sha256', usedSalt)
    .update(otp)
    .digest('hex');
  
  return { hash, salt: usedSalt };
}

/**
 * Verify if a provided OTP matches the stored hash
 * 
 * This function recreates the hash from the provided OTP and compares it
 * to the stored hash. If they match, the OTP is correct.
 * 
 * @param providedOtp - The OTP the user entered
 * @param storedHash - The hash stored in the database
 * @param salt - The salt used when the hash was created
 * @returns Boolean indicating if the OTP is correct
 */
function verifyOtp(providedOtp: string, storedHash: string, salt: string): boolean {
  // Recreate the hash using the same OTP and salt
  const { hash: computedHash } = hashOtp(providedOtp, salt);
  
  // Use timing-safe comparison to prevent timing attacks
  // This ensures the comparison takes the same amount of time regardless of match
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(storedHash)
  );
}

/**
 * Generate and send an OTP to the user's phone
 * 
 * This is the main function for sending verification codes
 * It creates an OTP, stores it securely, and sends it via SMS
 * 
 * @param phoneNumber - The user's phone number to receive the OTP
 * @param donationId - The donation this OTP is associated with
 * @returns Object with success status and any error message
 */
export async function sendOtpToUser(
  phoneNumber: string,
  donationId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Step 1: Check if there's already a valid, unused OTP for this donation
    // This prevents creating multiple active OTPs for the same transaction
    const existingOtp = await prisma.otpRecord.findFirst({
      where: {
        donationId: donationId,
        isUsed: false,        // OTP hasn't been successfully used yet
        isExpired: false,      // OTP hasn't passed its expiry time
      },
    });

    // If a valid OTP already exists, don't create a new one
    // This prevents OTP flooding (sending too many codes)
    if (existingOtp) {
      return {
        success: false,
        message: 'A verification code has already been sent. Please wait 1 minute before requesting a new one.'
      };
    }

    // Step 2: Generate a new, cryptographically secure OTP
    const otp = generateOtp(OTP_CONFIG.length);
    
    // Step 3: Hash the OTP for secure storage
    // We store the hash, not the actual OTP - this is crucial for security
    const { hash: otpHash, salt } = hashOtp(otp);
    
    // Step 4: Calculate when this OTP expires
    // Adding expiry time prevents OTP from being used indefinitely
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_CONFIG.expiryMinutes);
    
    // Step 5: Store the OTP record in the database
    // We store the hash, not the plain OTP - even if database is hacked, OTPs are safe
    await prisma.otpRecord.create({
      data: {
        donationId: donationId,
        phoneNumber: phoneNumber,
        codeHash: otpHash,        // Store the HASHED version, not the actual OTP
        salt: salt,               // Store the salt used for hashing
        expiresAt: expiresAt,
        maxAttempts: OTP_CONFIG.maxAttempts,
      },
    });
    
    // Step 6: Send the OTP via SMS to the user's phone
    // This is the only time the OTP exists in plain text - during transmission
    const smsResult = await sendSms({
      to: phoneNumber,
      message: `Your Lakeside Baptist Church payment verification code is: ${otp}. This code expires in ${OTP_CONFIG.expiryMinutes} minutes. DO NOT share this code with anyone.`
    });
    
    // Step 7: Log the SMS notification in the database for audit trail
    await prisma.smsNotification.create({
      data: {
        donationId: donationId,
        recipientType: 'SENDER',     // Going to the person making the payment
        recipientPhone: phoneNumber,
        messageContent: 'OTP verification code sent',
        messageType: 'OTP',
        smsStatus: smsResult.success ? 'SENT' : 'FAILED',
        twilioSid: smsResult.messageId || null,
        errorMessage: smsResult.error || null,
      },
    });
    
    // Step 8: Update donation status to show we're waiting for OTP verification
    await prisma.donation.update({
      where: { id: donationId },
      data: { status: 'AWAITING_OTP' },
    });
    
    // Check if SMS was sent successfully
    if (!smsResult.success) {
      throw new Error(smsResult.error || 'Failed to send SMS');
    }
    
    return {
      success: true,
      message: 'Verification code sent to your phone. Please check your messages.'
    };
    
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return {
      success: false,
      message: 'Failed to send verification code. Please try again.'
    };
  }
}

/**
 * Verify the OTP entered by the user
 * 
 * This function checks if the code the user provided matches what we sent
 * It also enforces security measures like attempt limits and expiry
 * 
 * @param phoneNumber - The user's phone number
 * @param providedOtp - The OTP code the user entered
 * @param donationId - The donation being verified
 * @returns Object with verification result
 */
export async function verifyUserOtp(
  phoneNumber: string,
  providedOtp: string,
  donationId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Step 1: Find the OTP record for this donation
    const otpRecord = await prisma.otpRecord.findFirst({
      where: {
        donationId: donationId,
        phoneNumber: phoneNumber,
        isUsed: false,      // OTP hasn't been used yet
        isExpired: false,   // OTP hasn't expired
      },
      orderBy: { createdAt: 'desc' }, // Get the most recent OTP
    });
    
    // Step 2: Check if OTP record exists
    if (!otpRecord) {
      return {
        success: false,
        message: 'No verification code found. Please request a new code.'
      };
    }
    
    // Step 3: Check if OTP has expired
    // Even though we filter for non-expired OTPs, this is a double-check
    if (new Date() > otpRecord.expiresAt) {
      // Mark the OTP as expired in the database
      await prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: { isExpired: true },
      });
      
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      };
    }
    
    // Step 4: Check if maximum attempts reached
    // This prevents brute-force attacks (trying all possible combinations)
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new verification code.'
      };
    }
    
    // Step 5: Verify the provided OTP against the stored hash
    const isValid = verifyOtp(providedOtp, otpRecord.codeHash, otpRecord.salt);
    
    // Step 6: Update the OTP record with the attempt
    if (!isValid) {
      // Increment the attempts counter (failed attempt)
      await prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: {
          attempts: { increment: 1 }, // Track how many wrong attempts
        },
      });
      
      // Calculate remaining attempts
      const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1);
      
      return {
        success: false,
        message: `Invalid verification code. You have ${remainingAttempts} attempt(s) remaining.`
      };
    }
    
    // Step 7: OTP is valid! Mark it as used
    // This prevents the same OTP from being used multiple times
    await prisma.otpRecord.update({
      where: { id: otpRecord.id },
      data: {
        isUsed: true,              // Mark as successfully used
        verifiedAt: new Date(),    // Record when verification happened
        attempts: { increment: 1 }, // Count this successful attempt
      },
    });
    
    return {
      success: true,
      message: 'Verification successful! Your payment is being processed.'
    };
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'Verification failed due to a system error. Please try again.'
    };
  }
}