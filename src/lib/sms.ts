// src/lib/sms.ts
// SMS Service using Twilio - Handles all SMS communications for the church
// UPDATED: Added trial mode support with verification instructions

import Twilio from 'twilio';
import crypto from 'crypto';

// Initialize Twilio client with account credentials from .env
const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// The phone number we send messages FROM
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
  isTrialError?: boolean;
  verificationUrl?: string;
}

/**
 * Check if Twilio account is in trial mode
 * Trial accounts can only send to verified numbers
 */
async function checkTwilioAccountStatus(): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      return false;
    }
    
    // Make a simple API call to check account status
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.type === 'Trial';
    }
    
    return false;
  } catch {
    return false;
  }
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

    // Check if we're in trial mode
    const isTrial = await checkTwilioAccountStatus();
    
    // Build message options
    const messageOptions: any = {
      body: message,
      from: FROM_PHONE,
      to: to,
    };

    // Add status callback URL for delivery tracking
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
      isTrialAccount: isTrial,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      messageId: twilioMessage.sid,
      isTrialError: false
    };

  } catch (error: any) {
    // Check if this is a trial account restriction error
    const isTrialError = error?.code === 21608 || // 'From' number not verified
                        error?.code === 21606 || // 'To' number not verified  
                        error?.code === 21211 || // Invalid phone number
                        error?.message?.includes('Trial');
    
    // Generate verification URL for trial accounts
    let verificationUrl = '';
    if (isTrialError && to.startsWith('+233')) {
      verificationUrl = `https://console.twilio.com/us1/develop/phone-numbers/manage/verified?phoneNumber=${encodeURIComponent(to)}`;
    }

    // Log the error details
    console.error('❌ SMS sending failed:', {
      recipient: to,
      errorCode: error?.code || 'Unknown',
      errorMessage: error?.message || 'Unknown error occurred',
      isTrialError: isTrialError,
      timestamp: new Date().toISOString()
    });

    // Provide helpful error message for trial accounts
    let errorMessage = error?.message || 'Failed to send SMS notification.';
    
    if (isTrialError) {
      errorMessage = `Trial account restriction: You need to verify this phone number (${to}) in your Twilio console. ` +
                    `Visit: ${verificationUrl}`;
    }

    return {
      success: false,
      error: errorMessage,
      isTrialError: isTrialError,
      verificationUrl: verificationUrl
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

/**
 * Verify a phone number in Twilio trial account
 * This helps users set up their trial account
 */
function getTwilioVerificationInstructions(phoneNumber: string): string {
  const verificationUrl = `https://console.twilio.com/us1/develop/phone-numbers/manage/verified?phoneNumber=${encodeURIComponent(phoneNumber)}`;
  
  return `
========================================
📱 TWILIO TRIAL ACCOUNT SETUP
========================================
To send SMS to ${phoneNumber}, you need to verify this number in your Twilio account:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "Add a new Caller ID"
3. Enter: ${phoneNumber}
4. Click "Verify"
5. Check your phone for the verification code
6. Enter the code on the Twilio website

Or use this direct link:
${verificationUrl}

After verification, you can send SMS to this number.
========================================
`;
}

// Export functions and types
export { 
  sendSms, 
  generateOtp, 
  formatGhanaPhone, 
  getTwilioVerificationInstructions,
  type SmsPayload, 
  type SmsResponse 
};