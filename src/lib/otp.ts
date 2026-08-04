// src/lib/otp.ts
// OTP Service - Generates and verifies one-time passwords
// UPDATED: Throws errors on SMS failure (for production use after verifying Twilio number)

import crypto from 'crypto';
import { prisma } from './prisma';
import { generateOtp, sendSms } from './sms';

const OTP_CONFIG = {
  length: parseInt(process.env.OTP_LENGTH || '6'),
  expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10'),
  maxAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS || '3'),
};

function hashOtp(otp: string, salt?: string): { hash: string; salt: string } {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', usedSalt)
    .update(otp)
    .digest('hex');
  return { hash, salt: usedSalt };
}

function verifyOtp(providedOtp: string, storedHash: string, salt: string): boolean {
  const { hash: computedHash } = hashOtp(providedOtp, salt);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(storedHash)
  );
}

export async function sendOtpToUser(
  phoneNumber: string,
  donationId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check for existing valid OTP
    const existingOtp = await prisma.otpRecord.findFirst({
      where: {
        donationId: donationId,
        isUsed: false,
        isExpired: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Allow resend if OTP was created more than 1 minute ago
    if (existingOtp) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (existingOtp.createdAt > oneMinuteAgo) {
        return {
          success: false,
          message: 'A verification code was recently sent. Please wait 1 minute before requesting a new one.'
        };
      }
      // Expire the old OTP
      await prisma.otpRecord.update({
        where: { id: existingOtp.id },
        data: { isExpired: true },
      });
    }

    // Generate the OTP
    const otp = generateOtp(OTP_CONFIG.length);
    const { hash: otpHash, salt } = hashOtp(otp);
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_CONFIG.expiryMinutes);
    
    // Save OTP record to database
    await prisma.otpRecord.create({
      data: {
        donationId: donationId,
        phoneNumber: phoneNumber,
        codeHash: otpHash,
        salt: salt,
        expiresAt: expiresAt,
        maxAttempts: OTP_CONFIG.maxAttempts,
      },
    });

    // Send SMS via Twilio
    const smsResult = await sendSms({
      to: phoneNumber,
      message: `Your Lakeside Baptist Church payment verification code is: ${otp}. This code expires in ${OTP_CONFIG.expiryMinutes} minutes. DO NOT share this code with anyone.`
    });

    // Log the SMS notification in database
    await prisma.smsNotification.create({
      data: {
        donationId: donationId,
        recipientType: 'SENDER',
        recipientPhone: phoneNumber,
        messageContent: smsResult.success ? 'OTP verification code sent' : 'OTP sending failed',
        messageType: 'OTP',
        smsStatus: smsResult.success ? 'SENT' : 'FAILED',
        twilioSid: smsResult.messageId || null,
        errorMessage: smsResult.error || null,
      },
    });

    // Update donation status
    await prisma.donation.update({
      where: { id: donationId },
      data: { status: 'AWAITING_OTP' },
    });

    // If SMS failed, throw error
    if (!smsResult.success) {
      throw new Error(smsResult.error || 'Failed to send SMS. Please ensure your phone number is correct.');
    }

    return {
      success: true,
      message: 'Verification code sent to your phone. Please check your messages.'
    };
    
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send verification code. Please try again.'
    };
  }
}

export async function verifyUserOtp(
  phoneNumber: string,
  providedOtp: string,
  donationId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const otpRecord = await prisma.otpRecord.findFirst({
      where: {
        donationId: donationId,
        phoneNumber: phoneNumber,
        isUsed: false,
        isExpired: false,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!otpRecord) {
      return {
        success: false,
        message: 'No verification code found. Please request a new code.'
      };
    }
    
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: { isExpired: true },
      });
      
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      };
    }
    
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new verification code.'
      };
    }
    
    const isValid = verifyOtp(providedOtp, otpRecord.codeHash, otpRecord.salt);
    
    if (!isValid) {
      await prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: {
          attempts: { increment: 1 },
        },
      });
      
      const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1);
      
      return {
        success: false,
        message: `Invalid verification code. You have ${remainingAttempts} attempt(s) remaining.`
      };
    }
    
    await prisma.otpRecord.update({
      where: { id: otpRecord.id },
      data: {
        isUsed: true,
        verifiedAt: new Date(),
        attempts: { increment: 1 },
      },
    });
    
    return {
      success: true,
      message: 'Verification successful! You will now be redirected to complete your payment.'
    };
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'Verification failed due to a system error. Please try again.'
    };
  }
}