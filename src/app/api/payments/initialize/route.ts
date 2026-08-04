// src/app/api/payments/initialize/route.ts
// UPDATED: Sends OTP before Paystack redirect - user verifies phone first, then pays

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/paystack'
import { paymentSchema } from '@/lib/validation'
import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'
import { formatGhanaPhone } from '@/lib/sms'
import { sendOtpToUser } from '@/lib/otp' // NEW: Import OTP function

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    const body = await request.json()
    const validatedData = paymentSchema.parse(body)
    
    if (!validatedData.giverPhone) {
      return NextResponse.json(
        { ok: false, error: 'Phone number is required for payment verification. Please provide your mobile money number.' },
        { status: 400 }
      )
    }
    
    let formattedPhone: string;
    try {
      formattedPhone = formatGhanaPhone(validatedData.giverPhone);
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: 'Invalid phone number format. Please use a valid Ghana phone number (e.g., 0241234567).' },
        { status: 400 }
      )
    }
    
    const reference = `CHURCH-${Date.now()}-${uuidv4().slice(0, 8)}`
    
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,
        currency: validatedData.currency || 'GHS',
        purpose: validatedData.purpose,
        giverName: validatedData.giverName,
        giverEmail: validatedData.giverEmail,
        giverPhone: formattedPhone,
        reference: reference,
        note: validatedData.metadata?.note || null,
        metadata: {
          ip_address: ip,
          source: validatedData.metadata?.source || 'website',
          user_agent: headersList.get('user-agent') || 'unknown'
        },
        status: 'PENDING'
      }
    })
    
    // NEW: Send OTP BEFORE Paystack initialization
    // User must verify their phone before we take them to payment
    const otpResult = await sendOtpToUser(formattedPhone, donation.id);
    
    if (!otpResult.success) {
      return NextResponse.json(
        { ok: false, error: otpResult.message },
        { status: 400 }
      )
    }
    
    // Initialize Paystack payment but DON'T redirect yet
    const paystackResponse = await initializePayment({
      email: validatedData.giverEmail,
      amount: validatedData.amount,
      currency: validatedData.currency || 'GHS',
      reference: reference,
      metadata: {
        donation_id: donation.id,
        donor_name: validatedData.giverName,
        purpose: validatedData.purpose,
        giver_phone: formattedPhone
      }
    })
    
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        accessCode: paystackResponse.data.access_code,
        // Status stays AWAITING_OTP (set by sendOtpToUser)
      }
    })
    
    // Return: Don't redirect yet! Return OTP confirmation and payment URL for later
    return NextResponse.json({
      ok: true,
      message: 'Verification code sent to your phone. Please enter it to continue.',
      authorization_url: paystackResponse.data.authorization_url,
      reference: reference,
      donationId: donation.id,
      requiresOtp: true, // NEW: Tells frontend to show OTP screen
    })
    
  } catch (error: unknown) {
    console.error('Payment initialization error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Invalid data provided. Please check your information.', details: error.message },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, error: error.message || 'Failed to initialize payment' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { ok: false, error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    )
  }
}