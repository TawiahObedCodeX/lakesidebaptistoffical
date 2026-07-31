// src/lib/payment-sms.ts
// Handles sending SMS notifications for successful payments
// Both the sender (donor) and receiver (church) get notified via SMS

import { sendSms, formatGhanaPhone } from './sms';
import { prisma } from './prisma';

// Interface for payment notification data
interface PaymentNotification {
  donationId: string;     // The donation reference
  amount: number;          // Amount paid
  currency: string;        // Currency (GHS)
  purpose: string;         // What the payment was for (tithe, offering, etc.)
  reference: string;       // Payment reference number
  senderPhone: string;     // Phone number of the person who paid
  senderName: string;      // Name of the person who paid
}

/**
 * Send payment confirmation SMS to the SENDER (donor)
 * 
 * This message confirms to the donor that their payment was received
 * It's like a digital receipt sent directly to their phone
 * 
 * Message format:
 * "Dear [Name], your [purpose] payment of GH₵[amount] has been received. 
 *  Ref: [reference]. Thank you for your generosity! - Lakeside Baptist Church"
 */
async function sendSenderConfirmation(data: PaymentNotification): Promise<void> {
  // Purpose labels in human-readable format
  const purposeLabels: Record<string, string> = {
    TITHE: 'Tithe',
    OFFERING: 'Offering',
    GIVE: 'General Giving',
    EVENT_TICKET: 'Event/Project Support'
  };

  const purposeLabel = purposeLabels[data.purpose] || data.purpose;

  // Create the SMS message for the sender
  const message = `Dear ${data.senderName}, your ${purposeLabel} payment of GH₵${data.amount.toFixed(2)} has been received. Ref: ${data.reference}. Thank you for your generosity! - Lakeside Baptist Church`;
  
  try {
    // Format the sender's phone number to international format
    const formattedPhone = formatGhanaPhone(data.senderPhone);
    
    // Send the SMS notification
    const smsResult = await sendSms({
      to: formattedPhone,
      message: message
    });
    
    // Log the SMS notification in the database for audit trail
    // This creates a permanent record of all communications
    await prisma.smsNotification.create({
      data: {
        donationId: data.donationId,
        recipientType: 'SENDER',     // Going to the person who paid
        recipientPhone: formattedPhone,
        messageContent: message,
        messageType: 'PAYMENT_CONFIRMATION',  // Type of notification
        smsStatus: smsResult.success ? 'SENT' : 'FAILED',
        twilioSid: smsResult.messageId || null,
        errorMessage: smsResult.error || null,
      },
    });
    
  } catch (error) {
    console.error('Failed to send sender confirmation SMS:', error);
  }
}

/**
 * Send payment received SMS to the RECEIVER (church admin/mobile money account)
 * 
 * This message alerts the church that a payment has been received
 * It includes all relevant details for reconciliation
 * 
 * Message format:
 * "NEW PAYMENT: GH₵[amount] received from [Name] for [purpose]. 
 *  Ref: [reference]. Check your mobile money account."
 */
async function sendReceiverNotification(data: PaymentNotification): Promise<void> {
  // Get the church's mobile money number from environment variables
  const churchPhone = process.env.CHURCH_MOBILE_MONEY_NUMBER;
  
  // If no church phone configured, skip notification but log warning
  if (!churchPhone) {
    console.warn('Church mobile money number not configured. Skipping receiver notification.');
    return;
  }
  
  // Purpose labels in human-readable format
  const purposeLabels: Record<string, string> = {
    TITHE: 'Tithe',
    OFFERING: 'Offering',
    GIVE: 'General Giving',
    EVENT_TICKET: 'Event/Project Support'
  };

  const purposeLabel = purposeLabels[data.purpose] || data.purpose;
  
  // Create the SMS message for the church/receiver
  const message = `NEW PAYMENT: GH₵${data.amount.toFixed(2)} received from ${data.senderName} for ${purposeLabel}. Ref: ${data.reference}. Check your mobile money account.`;
  
  try {
    // Format the church phone number to international format
    const formattedPhone = formatGhanaPhone(churchPhone);
    
    // Send the SMS notification
    const smsResult = await sendSms({
      to: formattedPhone,
      message: message
    });
    
    // Log the SMS notification in the database for audit trail
    await prisma.smsNotification.create({
      data: {
        donationId: data.donationId,
        recipientType: 'RECEIVER',    // Going to the church/receiver
        recipientPhone: formattedPhone,
        messageContent: message,
        messageType: 'PAYMENT_RECEIVED',  // Type of notification
        smsStatus: smsResult.success ? 'SENT' : 'FAILED',
        twilioSid: smsResult.messageId || null,
        errorMessage: smsResult.error || null,
      },
    });
    
  } catch (error) {
    console.error('Failed to send receiver notification SMS:', error);
  }
}

// Export the functions for use in payment processing
export { sendSenderConfirmation, sendReceiverNotification, type PaymentNotification };