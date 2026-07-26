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
    // This helps with security - it creates a digital fingerprint of the donor
    // Think of it like a security camera recording who entered the building
    const headersList = await headers() // Must await in Next.js 14+
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    // Read and parse the donation information from the request
    // This converts the raw data into structured information we can work with
    const body = await request.json()
    
    // Validate the donation data using our Zod schema
    // This is like a security checkpoint at the airport - it makes sure everything is safe and correct
    // It checks things like: is the amount valid? is the email format correct?
    const validatedData = paymentSchema.parse(body)
    
    // Generate a unique reference number for this transaction
    // Format: CHURCH-TIMESTAMP-RANDOMSTRING
    // This reference works like a receipt number - it's unique and helps track the payment
    // Example: CHURCH-1620000000-a1b2c3d4
   const reference = `LBC-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`
    
    // Save the donation record to our database BEFORE sending to Paystack
    // This creates a paper trail - we record every donation attempt, even if it fails
    // This is important for auditing and tracking purposes
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,         // How much they want to donate
        currency: validatedData.currency || 'GHS', // Currency type (Ghana Cedis default)
        purpose: validatedData.purpose,       // What the donation is for (tithe, offering, etc.)
        giverName: validatedData.giverName,   // The donor's full name
        giverEmail: validatedData.giverEmail, // Donor's email for receipt
        giverPhone: validatedData.giverPhone || null, // Phone number (optional)
        reference: reference,                 // Our unique tracking number
        note: validatedData.metadata?.note || null, // Personal note from donor
        metadata: {
          ip_address: ip,                                          // Donor's internet address (security)
          source: validatedData.metadata?.source || 'website',     // Where they donated from
          user_agent: headersList.get('user-agent') || 'unknown'   // Their browser info
        },
        status: 'PENDING' // Transaction starts as pending - waiting for payment
      }
    })
    
    // Send the payment request to Paystack for processing
    // Paystack will handle the actual money transfer securely
    // Think of Paystack as the cashier that handles the money part
    const paystackResponse = await initializePayment({
      email: validatedData.giverEmail,       // Where to send payment receipt
      amount: validatedData.amount,          // Amount to charge (already in correct currency)
      currency: validatedData.currency || 'GHS', // Currency for payment
      reference: reference,                  // Our unique tracking number
      metadata: {
        donation_id: donation.id,            // Link Paystack transaction to our database record
        donor_name: validatedData.giverName, // Name for Paystack's records
        purpose: validatedData.purpose       // Purpose for Paystack's records
      }
    })
    
    // Update our database record with information from Paystack
    // Paystack gives us an access code that we need to track this payment
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        accessCode: paystackResponse.data.access_code, // Paystack's code for this transaction
        status: 'PROCESSING' // Payment is now being processed by Paystack
      }
    })
    
    // Return the payment page URL to the frontend
    // The donor will be redirected to Paystack's secure payment page
    // This is where they'll enter their card or mobile money details
    return NextResponse.json({
      ok: true,
      authorization_url: paystackResponse.data.authorization_url, // Paystack's payment page URL
      reference: reference, // Our reference number for tracking
    })
    
  } catch (error: unknown) {
    // Log the error details for debugging
    // Developers can see this in the server logs to fix issues
    console.error('Payment initialization error:', error)
    
    // Check if the error is because of invalid user input
    // This means the donor provided information in the wrong format
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Invalid data provided', details: error.message },
        { status: 400 } // Bad Request - user needs to fix their input
      )
    }
    
    // Handle Paystack-specific errors
    // These happen when Paystack's service has issues
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, error: error.message || 'Failed to initialize payment' },
        { status: 500 } // Server error
      )
    }
    
    // For any other unexpected errors, send a general error message
    // We keep it vague for security reasons
    return NextResponse.json(
      { ok: false, error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    )
  }
}