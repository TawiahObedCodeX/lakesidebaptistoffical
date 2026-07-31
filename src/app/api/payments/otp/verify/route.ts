// src/app/api/payments/otp/verify/route.ts
// API endpoint to verify the OTP entered by the user
// This is called when the user submits their verification code

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserOtp } from '@/lib/otp';
import { sendSenderConfirmation, sendReceiverNotification } from '@/lib/payment-sms';
import { sendDonationReceipt } from '@/lib/email';
import { verifyPayment } from '@/lib/paystack';

export async function POST(request: Request) {
  try {
    // Get the request data
    const body = await request.json();
    const { donationId, phoneNumber, otpCode } = body;
    
    // Validate required fields
    if (!donationId || !phoneNumber || !otpCode) {
      return NextResponse.json(
        { ok: false, error: 'Donation ID, phone number, and OTP code are required.' },
        { status: 400 }
      );
    }
    
    // Validate OTP format (6 digits)
    if (!otpCode.match(/^\d{6}$/)) {
      return NextResponse.json(
        { ok: false, error: 'Verification code must be 6 digits.' },
        { status: 400 }
      );
    }
    
    // Verify the OTP
    const verificationResult = await verifyUserOtp(phoneNumber, otpCode, donationId);
    
    // If OTP verification failed, return error
    if (!verificationResult.success) {
      return NextResponse.json(
        { ok: false, error: verificationResult.message },
        { status: 400 }
      );
    }
    
    // OTP is valid! Now verify the actual payment with Paystack
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });
    
    if (!donation) {
      return NextResponse.json(
        { ok: false, error: 'Donation not found.' },
        { status: 404 }
      );
    }
    
    // Verify payment with Paystack to ensure it was successful
    const verification = await verifyPayment(donation.reference);
    
    // Check if Paystack confirms the payment
    if (verification.data.status !== 'success') {
      await prisma.donation.update({
        where: { id: donationId },
        data: { 
          status: 'FAILED',
          metadata: {
            ...donation.metadata as object,
            verification_response: verification
          }
        }
      });
      
      return NextResponse.json({
        ok: false,
        error: 'Payment was not successful. Please try again.'
      });
    }
    
    // Payment is verified! Update our database
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'SUCCESSFUL',
        isVerified: true,
        verifiedAt: new Date(),
      }
    });
    
    // Send SMS notification to the SENDER (person who donated)
    // This confirms their payment was received
    if (donation.giverPhone) {
      await sendSenderConfirmation({
        donationId: donation.id,
        amount: Number(donation.amount),
        currency: donation.currency,
        purpose: donation.purpose,
        reference: donation.reference,
        senderPhone: donation.giverPhone,
        senderName: donation.giverName,
      });
      
      // Send SMS notification to the RECEIVER (church mobile money account)
      // This alerts the church that a payment was received
      await sendReceiverNotification({
        donationId: donation.id,
        amount: Number(donation.amount),
        currency: donation.currency,
        purpose: donation.purpose,
        reference: donation.reference,
        senderPhone: donation.giverPhone,
        senderName: donation.giverName,
      });
    }
    
    // Also send email receipt as backup (keeps existing functionality)
    await sendDonationReceipt({
      donorName: donation.giverName,
      donorEmail: donation.giverEmail,
      amount: Number(donation.amount),
      currency: donation.currency,
      purpose: donation.purpose,
      reference: donation.reference,
      date: new Date()
    });
    
    return NextResponse.json({
      ok: true,
      message: 'Payment verified successfully! Check your phone for confirmation.',
      data: {
        amount: updatedDonation.amount,
        purpose: updatedDonation.purpose,
        reference: updatedDonation.reference,
        donorName: updatedDonation.giverName,
        donorEmail: updatedDonation.giverEmail,
        date: updatedDonation.verifiedAt
      }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { ok: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}