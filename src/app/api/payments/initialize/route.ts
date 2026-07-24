// src/app/api/payments/initialize/route.ts
// This endpoint starts a new payment transaction with Paystack
// It validates the donor's information before sending to Paystack

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/paystack'
import { paymentSchema } from '@/lib/validation'
import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Get the IP address of the person making the donation
    // This helps with fraud detection and audit trails
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    // Parse and validate the incoming request body
    const body = await request.json()
    
    // Validate input using Zod schema (defined in validation.ts)
    // This prevents malicious data from reaching our database
    const validatedData = paymentSchema.parse(body)
    
    // Generate a unique reference for this transaction
    // Format: CHURCH-TIMESTAMP-RANDOMSTRING
    // This ensures each payment has a unique identifier
    const reference = `CHURCH-${Date.now()}-${uuidv4().slice(0, 8)}`
    
    // Save the donation attempt to database BEFORE calling Paystack
    // This creates an audit trail even if the payment fails
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
          ip_address: ip, // Store IP for security auditing
          source: validatedData.metadata?.source || 'website',
          user_agent: headersList.get('user-agent') || 'unknown'
        },
        status: 'PENDING'
      }
    })
    
    // Initialize payment with Paystack
    // This sends the donor's information to Paystack for processing
    const paystackResponse = await initializePayment({
      email: validatedData.giverEmail,
      amount: validatedData.amount, // Paystack expects amount in GHS (not pesewas for GHS)
      currency: validatedData.currency || 'GHS',
      reference: reference,
      metadata: {
        donation_id: donation.id, // Link Paystack transaction to our database
        donor_name: validatedData.giverName,
        purpose: validatedData.purpose
      }
    })
    
    // Update our record with Paystack's access code
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        accessCode: paystackResponse.data.access_code,
        status: 'PROCESSING'
      }
    })
    
    // Return the authorization URL to the frontend
    // The user will be redirected here to complete payment
    return NextResponse.json({
      ok: true,
      authorization_url: paystackResponse.data.authorization_url,
      reference: reference,
      // The frontend uses this URL to redirect the donor
    })
    
  } catch (error: any) {
    console.error('Payment initialization error:', error)
    
    // Handle validation errors specifically
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }
    
    // Handle general errors
    return NextResponse.json(
      { ok: false, error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    )
  }
}