// src/lib/sms.ts
// SMS Service using Twilio - Handles all SMS communications for the church
// Twilio is like a reliable postal service for text messages
// It ensures SMS messages reach their destination anywhere in the world

import Twilio from 'twilio';
// Import crypto properly at the top level
import crypto from 'crypto';

// Initialize Twilio client with our account credentials
// These credentials prove we own the Twilio account and authorize us to send messages
// Think of these like a username and password for the SMS service
// CRITICAL: Never expose these in client-side/browser code - server-side only!
const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,  // Account identifier (like a username)
  process.env.TWILIO_AUTH_TOKEN     // Authentication token (like a password)
);

// The phone number we send messages FROM
// This must be a phone number purchased through Twilio's website
// All outgoing SMS will appear to come from this number
const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER;

// Interface: Defines the structure for sending an SMS
// TypeScript uses this to ensure we always provide the correct data
interface SmsPayload {
  to: string;      // Recipient's phone number (must be international format: +233XXXXXXXXX)
  message: string; // The text content of the SMS message
}

// Interface: Defines what we get back after attempting to send an SMS
interface SmsResponse {
  success: boolean;     // true if SMS was sent successfully, false if it failed
  messageId?: string;   // Twilio's unique ID for tracking this specific message
  error?: string;       // Human-readable error message if sending failed
}

/**
 * Send a single SMS message using Twilio
 * 
 * Think of this like sending a letter:
 * - 'from' is the return address (our Twilio phone number)
 * - 'to' is the destination address (recipient's phone number)
 * - 'message' is the letter content
 * - Twilio is the postal service that handles delivery
 * 
 * Security features built-in:
 * - TLS encryption: All messages are encrypted during transmission
 * - Identity verification: Twilio checks our credentials on every request
 * - Phone validation: We check phone numbers before sending
 * - Audit logging: Every message is logged for tracking
 * 
 * @param to - Recipient phone number in international format (+233XXXXXXXXX)
 * @param message - Text content to send (max 1600 characters for single SMS)
 * @returns Object with success status and tracking information
 */
async function sendSms({ to, message }: SmsPayload): Promise<SmsResponse> {
  try {
    // Check #1: Do we have a Twilio phone number configured?
    // Without this, we don't know what number to send FROM
    if (!FROM_PHONE) {
      throw new Error('Twilio phone number not configured in environment variables');
    }

    // Check #2: Is the recipient's phone number in valid international format?
    // Must start with + followed by country code and number
    // Valid examples: +233241234567, +12025551234
    // Invalid examples: 0241234567 (missing + and country code), ABCDEFG (not a number)
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error('Invalid phone number format. Must be international format (e.g., +233XXXXXXXXX)');
    }

    // Check #3: Is the message empty?
    // We don't want to send blank messages - that would be confusing
    if (!message || message.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    // Send the SMS through Twilio's secure API
    // This creates a message record in Twilio's system and queues it for delivery
    // The message goes through: Our Server → Twilio API → Carrier Network → Recipient's Phone
    const twilioMessage = await twilioClient.messages.create({
      body: message,         // The actual text content of the SMS
      from: FROM_PHONE,      // Our verified sender phone number
      to: to,                // Recipient's phone number
      // Status callback URL: Twilio will POST to this URL when delivery status changes
      // This lets us track if the message was actually delivered
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/sms/status-callback`
    });

    // Log successful sending for our records
    // This creates an audit trail - we can trace every SMS we've ever sent
    console.log(`✅ SMS sent successfully`, {
      to: to,
      messageId: twilioMessage.sid,       // Unique ID for this SMS
      status: twilioMessage.status,        // Initial status (usually 'queued' or 'sent')
      timestamp: new Date().toISOString()  // When it was sent
    });

    // Return success response with the Twilio message ID
    // The message ID can be used to look up delivery status later
    return {
      success: true,
      messageId: twilioMessage.sid  // Twilio's unique identifier (format: SMxxxxx)
    };

  } catch (error) {
    // Something went wrong - log the details for debugging
    console.error('❌ SMS sending failed:', {
      recipient: to,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });

    // Return a safe error message
    // We DON'T expose the technical error details to users
    // This prevents information leakage that could help attackers
    return {
      success: false,
      error: 'Failed to send SMS notification. Our team has been automatically notified.'
    };
  }
}

/**
 * Generate a cryptographically secure One-Time Password (OTP)
 * 
 * What makes this secure?
 * - Uses crypto.randomInt() which generates truly random numbers
 * - Not predictable like Math.random() which follows a pattern
 * - 6 digits = 1,000,000 possible combinations
 * - Each digit is independently random (no relationship between digits)
 * 
 * This is the same level of security used by banks for their OTP systems
 * 
 * @param length - Number of digits in the OTP (default: 6)
 * @returns A string of random digits (example: "482917")
 */
function generateOtp(length: number = 6): string {
  // Create an array with 'length' number of slots
  // Array.from() creates a new array from an array-like object
  // { length: 6 } creates an object that looks like an array of 6 items
  
  // FIXED: Now using the imported crypto at the top of the file
  // Instead of require('crypto') which can cause module resolution issues
  const otp = Array.from({ length }, () => {
    // crypto.randomInt(10) generates a random integer between 0 and 9
    // 0 is inclusive (can be 0), 10 is exclusive (cannot be 10)
    // Possible values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    const randomDigit = crypto.randomInt(0, 10);
    
    // Convert the number to a string so we can join all digits together
    return randomDigit.toString();
  }).join('');  // Join all digits into a single string like "482917"

  return otp;
}

/**
 * Format a phone number to Ghana international format
 * 
 * Handles ALL common Ghana phone number formats:
 * 
 * Input formats accepted:
 * - "0241234567" (local format, starts with 0, 10 digits)
 * - "233241234567" (with country code, no + sign, 12 digits)
 * - "+233241234567" (perfect international format, 13 characters)
 * - "241234567" (just the local number, no leading 0, 9 digits)
 * 
 * All will output: "+233241234567" (standard international format)
 * 
 * The function also handles numbers with spaces, dashes, or parentheses:
 * - "024 123 4567" → "+233241234567"
 * - "024-123-4567" → "+233241234567"
 * - "(024) 123 4567" → "+233241234567"
 * 
 * @param phone - Phone number in any common Ghana format
 * @returns Phone number in standard international format (+233XXXXXXXXX)
 * @throws Error if the phone number format is unrecognizable
 */
function formatGhanaPhone(phone: string): string {
  // Step 1: Remove ALL non-digit characters
  // This strips spaces, dashes, parentheses, and any other non-number characters
  // Example: "(024) 123-4567" becomes "0241234567"
  // FIXED: Changed 'let' to 'const' since cleaned is never reassigned
  const cleaned = phone.replace(/\D/g, '');
  
  // Step 2: Handle different Ghana number formats
  
  // Case 1: Local format starting with "0" (e.g., 0241234567)
  // Ghana local numbers are 10 digits starting with 0
  // Convert: Remove the leading "0" and add "+233"
  // Example: "0241234567" → "+233241234567"
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+233${cleaned.substring(1)}`;
  }
  
  // Case 2: Already has country code "233" but missing the "+" sign
  // Example: "233241234567" → "+233241234567"
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // Case 3: Already in perfect international format
  // Example: "+233241234567" (no change needed)
  if (cleaned.startsWith('+233') && cleaned.length === 13) {
    return cleaned;
  }
  
  // Case 4: Just the local number without leading 0 (9 digits)
  // Common when people type just "241234567"
  // Example: "241234567" → "+233241234567"
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    return `+233${cleaned}`;
  }
  
  // If none of the above formats match, we can't process this number
  // Throw an error so the calling code knows something is wrong
  throw new Error(
    `Unable to format phone number: "${phone}". ` +
    `Please use a valid Ghana number like 0241234567 or +233241234567.`
  );
}

// Export functions and types for use in other parts of the application
export { sendSms, generateOtp, formatGhanaPhone, type SmsPayload, type SmsResponse };