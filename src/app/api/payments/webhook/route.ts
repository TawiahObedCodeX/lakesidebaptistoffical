// src/app/api/payments/webhook/route.ts
// This endpoint receives automatic notifications from Paystack
// It's called by Paystack's servers, not by the donor's browser
// This is the most reliable way to confirm payments

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    // Get the raw request body for signature verification
    const body = await request.text()
    
    // Verify that this webhook really came from Paystack
    // This prevents fake payment confirmations
    const signature = request.headers.get('x-paystack-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Paystack signature' },
        { status: 401 }
      )
    }
    
    // Compute expected signature using our secret key
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')
    
    // Compare signatures to verify authenticity
    if (hash !== signature) {
      console.error('Invalid webhook signature - possible attack detected')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Parse the verified webhook data
    const event = JSON.parse(body)
    
    // Handle different event types from Paystack
    switch (event.event) {
      case 'charge.success':
        // Payment was successful
        await handleSuccessfulPayment(event.data)
        break
        
      case 'charge.failed':
        // Payment failed
        await handleFailedPayment(event.data)
        break
        
      case 'refund.processed':
        // Refund was processed
        await handleRefund(event.data)
        break
        
      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }
    
    // Always return 200 to Paystack
    // If we return an error, Paystack will keep retrying
    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('Webhook error:', error)
    // Still return 200 to prevent Paystack from retrying indefinitely
    return NextResponse.json({ received: true, error: error.message })
  }
}

// Helper function to handle successful payments
async function handleSuccessfulPayment(data: any) {
  const { reference, metadata } = data
  
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'SUCCESSFUL',
      isVerified: true,
      verifiedAt: new Date(),
      metadata: {
        payment_method: data.channel, // card, bank, etc.
        card_type: data.authorization?.card_type,
        bank: data.authorization?.bank,
        webhook_data: data
      }
    }
  })
  
  // TODO: Send receipt email to donor
  // TODO: Notify church admin of new donation
  // TODO: Update church financial records
}

// Helper function to handle failed payments
async function handleFailedPayment(data: any) {
  const { reference } = data
  
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'FAILED',
      metadata: {
        failure_reason: data.gateway_response,
        webhook_data: data
      }
    }
  })
}

// Helper function to handle refunds
async function handleRefund(data: any) {
  const { transaction_reference } = data
  
  await prisma.donation.update({
    where: { reference: transaction_reference },
    data: {
      status: 'REFUNDED',
      metadata: {
        refund_data: data
      }
    }
  })
}