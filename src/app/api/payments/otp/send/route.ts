// src/app/api/payments/otp/send/route.ts
// API endpoint to send OTP to user's phone
// This is called when a user clicks "Send Verification Code"

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpToUser } from '@/lib/otp';
import { formatGhanaPhone } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    // Get the request data
    const body = await request.json();
    const { donationId, phoneNumber } = body;
    
    // Validate required fields
    if (!donationId || !phoneNumber) {
      return NextResponse.json(
        { ok: false, error: 'Donation ID and phone number are required.' },
        { status: 400 }
      );
    }
    
    // Format the phone number to international format
    let formattedPhone: string;
    try {
      formattedPhone = formatGhanaPhone(phoneNumber);
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: 'Invalid phone number format.' },
        { status: 400 }
      );
    }
    
    // Check if the donation exists and belongs to this user
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });
    
    if (!donation) {
      return NextResponse.json(
        { ok: false, error: 'Donation not found.' },
        { status: 404 }
      );
    }
    
    // Verify that the phone number matches the one on the donation
    if (donation.giverPhone !== formattedPhone) {
      return NextResponse.json(
        { ok: false, error: 'Phone number does not match donation record.' },
        { status: 403 }
      );
    }
    
    // Send the OTP to the user's phone
    const result = await sendOtpToUser(formattedPhone, donationId);
    
    // Return the result
    if (result.success) {
      return NextResponse.json({
        ok: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { ok: false, error: result.message },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to send verification code.' },
      { status: 500 }
    );
  }
}