// src/app/api/payments/webhook/route.ts
// REMOVED: SMS notifications, now uses email receipts only

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendDonationReceipt } from '@/lib/email'

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
    giver_name?: string
    giver_email?: string
    purpose?: string
  }
  amount?: number
  customer?: {
    email?: string
    first_name?: string
    last_name?: string
  }
}

interface PaystackWebhookEvent {
  event: string
  data: PaystackWebhookData
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Paystack signature' },
        { status: 401 }
      )
    }
    
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')
    
    if (hash !== signature) {
      console.error('Invalid webhook signature - possible attack detected')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    const event: PaystackWebhookEvent = JSON.parse(body)
    
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data)
        break
        
      case 'charge.failed':
        await handleFailedPayment(event.data)
        break
        
      case 'refund.processed':
        await handleRefund(event.data)
        break
        
      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ received: true, error: errorMessage })
  }
}

async function handleSuccessfulPayment(data: PaystackWebhookData) {
  const { reference, metadata } = data
  
  const donationId = metadata?.donation_id
  
  if (!donationId) {
    console.error('No donation ID in webhook metadata for reference:', reference)
    return
  }
  
  // Update donation record
  await prisma.donation.update({
    where: { reference: reference },
    data: {
      status: 'SUCCESSFUL',
      metadata: {
        payment_method: data.channel,
        card_type: data.authorization?.card_type,
        bank: data.authorization?.bank,
        webhook_data: JSON.parse(JSON.stringify(data))
      }
    }
  })
  
  // Send email receipt to donor
  const donation = await prisma.donation.findUnique({
    where: { reference: reference }
  })
  
  if (donation) {
    await sendDonationReceipt({
      donorName: donation.giverName,
      donorEmail: donation.giverEmail,
      amount: Number(data.amount) / 100, // Convert from pesewas to cedis
      currency: donation.currency,
      purpose: donation.purpose,
      reference: reference,
      date: new Date()
    })
  }
  
  console.log(`✅ Payment successful and email receipt sent for reference: ${reference}`)
}

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