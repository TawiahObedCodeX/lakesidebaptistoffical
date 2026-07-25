// src/app/api/payments/webhook/route.ts
// This endpoint receives automatic notifications from Paystack
// It's called by Paystack's servers, not by the donor's browser
// This is the most reliable way to confirm payments

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Define types for Paystack webhook data
// This helps TypeScript understand the structure of Paystack's data
interface PaystackWebhookData {
  reference: string
  channel?: string
  gateway_response?: string
  authorization?: {
    card_type?: string
    bank?: string
  }
  metadata?: Record<string, unknown>
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
    
    // If there's no signature, this might be a fake request
    // We reject it to prevent fraud
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Paystack signature' },
        { status: 401 } // Unauthorized
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
    // Each event type means something different happened with a payment
    switch (event.event) {
      case 'charge.success':
        // A payment was completed successfully
        await handleSuccessfulPayment(event.data)
        break
        
      case 'charge.failed':
        // A payment attempt failed (insufficient funds, wrong card, etc.)
        await handleFailedPayment(event.data)
        break
        
      case 'refund.processed':
        // A refund was issued back to the donor
        await handleRefund(event.data)
        break
        
      default:
        // For any other event types we don't handle
        console.log(`Unhandled webhook event: ${event.event}`)
    }
    
    // Always return 200 OK to Paystack
    // If we return an error, Paystack will keep trying to send the webhook
    // This could cause duplicate processing
    return NextResponse.json({ received: true })
    
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Webhook error:', error)
    
    // Even if there's an error, return 200 to prevent Paystack from retrying
    // We log the error so we can fix it later
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ received: true, error: errorMessage })
  }
}

// Helper function to handle successful payments from webhook
// This is called when Paystack tells us a payment was successful
async function handleSuccessfulPayment(data: PaystackWebhookData) {
  const { reference } = data
  
  // Update the donation record to show it was successful
  // We use JSON.parse(JSON.stringify()) to convert the typed object to a plain JSON object
  // This is necessary because Prisma's Json field requires plain objects without TypeScript interfaces
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'SUCCESSFUL',  // Payment completed
      isVerified: true,      // We've confirmed it's real
      verifiedAt: new Date(), // When it was verified
      metadata: {
        payment_method: data.channel,              // How they paid (card, bank, etc.)
        card_type: data.authorization?.card_type,  // Type of card used
        bank: data.authorization?.bank,            // Bank name if bank transfer
        webhook_data: JSON.parse(JSON.stringify(data)) // Convert to plain JSON object for Prisma
      }
    }
  })
  
  // TODO: Send receipt email to donor
  // TODO: Notify church admin of new donation
  // TODO: Update church financial records for accounting
}

// Helper function to handle failed payments from webhook
// This is called when Paystack tells us a payment attempt failed
async function handleFailedPayment(data: PaystackWebhookData) {
  const { reference } = data
  
  // Update the donation record to show it failed
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'FAILED', // Payment didn't go through
      metadata: {
        failure_reason: data.gateway_response, // Why it failed (from Paystack)
        webhook_data: JSON.parse(JSON.stringify(data)) // Convert to plain JSON for Prisma
      }
    }
  })
}

// Helper function to handle refunds from webhook
// This is called when a refund is processed
async function handleRefund(data: PaystackWebhookData) {
  const { reference } = data
  
  // Update the donation record to show it was refunded
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'REFUNDED', // Money was returned to donor
      metadata: {
        refund_data: JSON.parse(JSON.stringify(data)) // Convert to plain JSON for Prisma
      }
    }
  })
}