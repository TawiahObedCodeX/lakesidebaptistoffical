// src/app/api/payments/webhook/route.ts
// This endpoint receives automatic notifications from Paystack
// It's called by Paystack's servers, not by the donor's browser
// This is the most reliable way to confirm payments
// UPDATED: Now triggers OTP flow after successful payment

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendOtpToUser } from '@/lib/otp'

// Define types for Paystack webhook data
interface PaystackWebhookData {
  reference: string
  channel?: string
  gateway_response?: string
  authorization?: {
    card_type?: string
    bank?: string
  }
  metadata?: {
    donation_id?: string
    giver_phone?: string
  }
}

interface PaystackWebhookEvent {
  event: string
  data: PaystackWebhookData
}

export async function POST(request: Request) {
  try {
    // Get the raw request body as text for signature verification
    // We need the raw text to verify the signature is authentic
    const body = await request.text()
    
    // Get the signature from the request headers
    // Paystack adds a special signature to prove the webhook is really from them
    const signature = request.headers.get('x-paystack-signature')
    
    // If there's no signature, this might be a fake request - reject it
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Paystack signature' },
        { status: 401 }
      )
    }
    
    // Create our own signature using our secret key
    // This is like a secret handshake - only Paystack and we know the secret
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')
    
    // Compare our signature with Paystack's signature
    // If they don't match, someone might be trying to trick us
    if (hash !== signature) {
      console.error('Invalid webhook signature - possible attack detected')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Now we know it's really from Paystack, so we can trust the data
    const event: PaystackWebhookEvent = JSON.parse(body)
    
    // Handle different types of events Paystack might send us
    switch (event.event) {
      case 'charge.success':
        // A payment was completed successfully
        await handleSuccessfulPayment(event.data)
        break
        
      case 'charge.failed':
        // A payment attempt failed
        await handleFailedPayment(event.data)
        break
        
      case 'refund.processed':
        // A refund was issued back to the donor
        await handleRefund(event.data)
        break
        
      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }
    
    // Always return 200 OK to Paystack to prevent retries
    return NextResponse.json({ received: true })
    
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ received: true, error: errorMessage })
  }
}

// Handle successful payments from webhook
async function handleSuccessfulPayment(data: PaystackWebhookData) {
  const { reference, metadata } = data
  
  // Get the donation ID from the metadata we sent to Paystack
  const donationId = metadata?.donation_id
  
  if (!donationId) {
    console.error('No donation ID in webhook metadata for reference:', reference)
    return
  }
  
  // Update the donation record to show payment was successful
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'SUCCESSFUL',
      isVerified: false, // Still needs OTP verification
      verifiedAt: new Date(),
      metadata: {
        payment_method: data.channel,
        card_type: data.authorization?.card_type,
        bank: data.authorization?.bank,
        webhook_data: JSON.parse(JSON.stringify(data))
      }
    }
  })
  
  // NEW: Send OTP to the donor's phone for verification
  // Only send if we have the phone number in metadata
  const donorPhone = metadata?.giver_phone
  if (donorPhone && donationId) {
    console.log(`Sending OTP to donor phone: ${donorPhone} for donation: ${donationId}`)
    await sendOtpToUser(donorPhone, donationId)
  } else {
    console.warn('No phone number in webhook metadata. OTP not sent.')
  }
}

// Handle failed payments from webhook
async function handleFailedPayment(data: PaystackWebhookData) {
  const { reference } = data
  
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'FAILED',
      metadata: {
        failure_reason: data.gateway_response,
        webhook_data: JSON.parse(JSON.stringify(data))
      }
    }
  })
}

// Handle refunds from webhook
async function handleRefund(data: PaystackWebhookData) {
  const { reference } = data
  
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'REFUNDED',
      metadata: {
        refund_data: JSON.parse(JSON.stringify(data))
      }
    }
  })
}