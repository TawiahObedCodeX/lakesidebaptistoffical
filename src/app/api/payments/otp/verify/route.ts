// src/app/api/payments/otp/verify/route.ts
// UPDATED: Only verifies OTP - payment verification and SMS moved to webhook

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyUserOtp } from '@/lib/otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donationId, phoneNumber, otpCode } = body;
    
    if (!donationId || !phoneNumber || !otpCode) {
      return NextResponse.json(
        { ok: false, error: 'Donation ID, phone number, and OTP code are required.' },
        { status: 400 }
      );
    }
    
    if (!otpCode.match(/^\d{6}$/)) {
      return NextResponse.json(
        { ok: false, error: 'Verification code must be 6 digits.' },
        { status: 400 }
      );
    }
    
    // Verify the OTP
    const verificationResult = await verifyUserOtp(phoneNumber, otpCode, donationId);
    
    if (!verificationResult.success) {
      return NextResponse.json(
        { ok: false, error: verificationResult.message },
        { status: 400 }
      );
    }
    
    // OTP is valid! Update donation status to indicate OTP verified
    // Payment will be completed on Paystack and confirmed via webhook
    await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'OTP_VERIFIED', // New status: OTP done, waiting for payment
        isVerified: true,
        verifiedAt: new Date(),
      }
    });
    
    return NextResponse.json({
      ok: true,
      message: 'Phone verified successfully! Redirecting to payment...',
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { ok: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}