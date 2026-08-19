// src/app/api/payments/initialize/route.ts
// REMOVED: OTP verification flow

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/paystack'
import { paymentSchema } from '@/lib/validation'
import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    const body = await request.json()
    const validatedData = paymentSchema.parse(body)
    
    const reference = `CHURCH-${Date.now()}-${uuidv4().slice(0, 8)}`
    
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,
        currency: validatedData.currency || 'GHS',
        purpose: validatedData.purpose,
        giverName: validatedData.giverName,
        giverEmail: validatedData.giverEmail,
        giverPhone: validatedData.giverPhone || null,
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
    
    // Initialize Paystack payment directly (no OTP step)
    const paystackResponse = await initializePayment({
      email: validatedData.giverEmail,
      amount: validatedData.amount,
      currency: validatedData.currency || 'GHS',
      reference: reference,
      metadata: {
        donation_id: donation.id,
        donor_name: validatedData.giverName,
        purpose: validatedData.purpose,
        giver_phone: validatedData.giverPhone || null
      }
    })
    
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        accessCode: paystackResponse.data.access_code,
      }
    })
    
    // Return response with direct payment URL
    return NextResponse.json({
      ok: true,
      message: 'Payment initialized successfully',
      authorization_url: paystackResponse.data.authorization_url,
      reference: reference,
      donationId: donation.id,
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