// src/lib/sms.ts
// SMS Service using Twilio - Handles all SMS communications for the church
// UPDATED: Fixed Twilio v6 types, correct phone number from .env

import Twilio from 'twilio';
import crypto from 'crypto';

// Initialize Twilio client with account credentials from .env
const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// The phone number we send messages FROM
// This is your Twilio US number: +18315316810
const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER;

// Interface: Defines the structure for sending an SMS
interface SmsPayload {
  to: string;
  message: string;
}

// Interface: Defines what we get back after attempting to send an SMS
interface SmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a single SMS message using Twilio
 */
async function sendSms({ to, message }: SmsPayload): Promise<SmsResponse> {
  try {
    // Check #1: Do we have a Twilio phone number configured?
    if (!FROM_PHONE) {
      throw new Error('Twilio phone number not configured in environment variables');
    }

    // Check #2: Is the recipient's phone number in valid international format?
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error('Invalid phone number format. Must be international format (e.g., +233XXXXXXXXX)');
    }

    // Check #3: Is the message empty?
    if (!message || message.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    // Build message options
    // Using 'any' type to avoid Twilio v6 TypeScript compatibility issues
    const messageOptions: any = {
      body: message,
      from: FROM_PHONE,
      to: to,
    };

    // ONLY add StatusCallback in production with a real domain
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (appUrl && !appUrl.includes('localhost') && !appUrl.includes('127.0.0.1')) {
      messageOptions.statusCallback = `${appUrl}/api/sms/status-callback`;
    }

    // Send the SMS through Twilio's secure API
    const twilioMessage = await twilioClient.messages.create(messageOptions);

    // Log successful sending
    console.log(`✅ SMS sent successfully`, {
      to: to,
      messageId: twilioMessage.sid,
      status: twilioMessage.status,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      messageId: twilioMessage.sid
    };

  } catch (error) {
    // Log the error details
    console.error('❌ SMS sending failed:', {
      recipient: to,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS notification.'
    };
  }
}

/**
 * Generate a cryptographically secure One-Time Password (OTP)
 */
function generateOtp(length: number = 6): string {
  const otp = Array.from({ length }, () => {
    const randomDigit = crypto.randomInt(0, 10);
    return randomDigit.toString();
  }).join('');

  return otp;
}

/**
 * Format a phone number to Ghana international format
 */
function formatGhanaPhone(phone: string): string {
  // Remove ALL non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Case 1: Local format starting with "0" (e.g., 0241234567)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+233${cleaned.substring(1)}`;
  }
  
  // Case 2: Already has country code "233" but missing the "+" sign
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // Case 3: Already in perfect international format
  if (cleaned.startsWith('+233') && cleaned.length === 13) {
    return cleaned;
  }
  
  // Case 4: Just the local number without leading 0 (9 digits)
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    return `+233${cleaned}`;
  }
  
  throw new Error(
    `Unable to format phone number: "${phone}". ` +
    `Please use a valid Ghana number like 0241234567 or +233241234567.`
  );
}

// Export functions and types
export { sendSms, generateOtp, formatGhanaPhone, type SmsPayload, type SmsResponse };