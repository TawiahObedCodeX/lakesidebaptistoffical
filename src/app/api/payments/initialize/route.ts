// src/app/api/payments/initialize/route.ts
// This endpoint starts a new payment transaction with Paystack
// It validates the donor's information before sending to Paystack
// UPDATED: Now requires phone number for OTP verification

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePayment } from '@/lib/paystack'
import { paymentSchema } from '@/lib/validation'
import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'
import { formatGhanaPhone } from '@/lib/sms'

export async function POST(request: Request) {
  try {
    // Get the IP address of the person making the donation
    // This helps with security by creating a digital fingerprint of the donor
    // Think of it like a security camera recording who entered the building
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    // Read and parse the donation information from the request
    // This converts raw JSON into structured data we can work with
    const body = await request.json()
    
    // Validate the donation data using our Zod schema
    // This is like a security checkpoint - it makes sure everything is safe and correct
    // It checks: is the amount valid? is the email format correct? is the name valid?
    const validatedData = paymentSchema.parse(body)
    
    // NEW: Phone number is now REQUIRED for OTP verification
    // Without a phone number, we cannot send the verification code
    if (!validatedData.giverPhone) {
      return NextResponse.json(
        { ok: false, error: 'Phone number is required for payment verification. Please provide your mobile money number.' },
        { status: 400 }
      )
    }
    
    // NEW: Format the phone number to international format for Twilio SMS
    // This ensures all phone numbers follow the +233XXXXXXXXX format
    let formattedPhone: string;
    try {
      formattedPhone = formatGhanaPhone(validatedData.giverPhone);
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: 'Invalid phone number format. Please use a valid Ghana phone number (e.g., 0241234567).' },
        { status: 400 }
      )
    }
    
    // Generate a unique reference number for this transaction
    // Format: CHURCH-TIMESTAMP-RANDOMSTRING
    // This reference works like a receipt number - it's unique and helps track the payment
    // Example: CHURCH-1620000000-a1b2c3d4
    const reference = `CHURCH-${Date.now()}-${uuidv4().slice(0, 8)}`
    
    // Save the donation record to our database BEFORE sending to Paystack
    // This creates a paper trail - we record every donation attempt, even if it fails
    // This is important for auditing and tracking purposes
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,         // How much they want to donate
        currency: validatedData.currency || 'GHS', // Currency (Ghana Cedis default)
        purpose: validatedData.purpose,       // What the donation is for (tithe, offering, etc.)
        giverName: validatedData.giverName,   // The donor's full name
        giverEmail: validatedData.giverEmail, // Donor's email for receipt
        giverPhone: formattedPhone,           // NEW: Store formatted phone number
        reference: reference,                 // Our unique tracking number
        note: validatedData.metadata?.note || null, // Personal note from donor
        metadata: {
          ip_address: ip,                                          // Donor's IP address (security)
          source: validatedData.metadata?.source || 'website',     // Where they donated from
          user_agent: headersList.get('user-agent') || 'unknown'   // Their browser info
        },
        status: 'PENDING' // Transaction starts as pending - waiting for Paystack processing
      }
    })
    
    // Send the payment request to Paystack for processing
    // Paystack handles the actual money transfer securely
    // Think of Paystack as the cashier that handles the money part
    const paystackResponse = await initializePayment({
      email: validatedData.giverEmail,       // Where to send payment receipt
      amount: validatedData.amount,          // Amount to charge
      currency: validatedData.currency || 'GHS', // Currency for payment
      reference: reference,                  // Our unique tracking number
      metadata: {
        donation_id: donation.id,            // Link Paystack transaction to our database record
        donor_name: validatedData.giverName, // Name for Paystack's records
        purpose: validatedData.purpose,       // Purpose for Paystack's records
        giver_phone: formattedPhone          // NEW: Include phone in metadata for webhook
      }
    })
    
    // Update our database record with information from Paystack
    // Paystack gives us an access code needed to track this payment
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        accessCode: paystackResponse.data.access_code, // Paystack's access code
        status: 'PROCESSING' // Payment is now being processed by Paystack
      }
    })
    
    // Return the payment page URL to the frontend
    // The donor will be redirected to Paystack's secure payment page
    // This is where they'll enter their card or mobile money details
    return NextResponse.json({
      ok: true,
      authorization_url: paystackResponse.data.authorization_url, // Paystack's payment page
      reference: reference, // Our reference number for tracking
      donationId: donation.id, // NEW: Return donation ID for OTP verification step
    })
    
  } catch (error: unknown) {
    // Log the error details for debugging
    console.error('Payment initialization error:', error)
    
    // Check if the error is because of invalid user input
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Invalid data provided. Please check your information.', details: error.message },
        { status: 400 }
      )
    }
    
    // Handle Paystack-specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, error: error.message || 'Failed to initialize payment' },
        { status: 500 }
      )
    }
    
    // For any other unexpected errors
    return NextResponse.json(
      { ok: false, error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    )
  }
}