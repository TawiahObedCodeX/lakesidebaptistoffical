// src/app/api/payments/webhook/route.ts
// UPDATED: Now triggers SMS notifications after successful payment and OTP verification

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendSenderConfirmation, sendReceiverNotification } from '@/lib/payment-sms'

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
    giver_name?: string
    purpose?: string
  }
  amount?: number
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
      verifiedAt: new Date(),
      metadata: {
        payment_method: data.channel,
        card_type: data.authorization?.card_type,
        bank: data.authorization?.bank,
        webhook_data: JSON.parse(JSON.stringify(data))
      }
    }
  })
  
  // Send SMS notifications to both sender and receiver
  const donation = await prisma.donation.findUnique({
    where: { reference: reference }
  })
  
  if (donation && donation.giverPhone) {
    // Send confirmation to donor (sender)
    await sendSenderConfirmation({
      donationId: donation.id,
      amount: Number(data.amount) / 100, // Convert from pesewas to cedis
      currency: donation.currency,
      purpose: metadata?.purpose || 'GIVE',
      reference: reference,
      senderPhone: donation.giverPhone,
      senderName: metadata?.giver_name || donation.giverName
    })
    
    // Send notification to church (receiver)
    await sendReceiverNotification({
      donationId: donation.id,
      amount: Number(data.amount) / 100,
      currency: donation.currency,
      purpose: metadata?.purpose || 'GIVE',
      reference: reference,
      senderPhone: donation.giverPhone,
      senderName: metadata?.giver_name || donation.giverName
    })
  }
  
  console.log(`✅ Payment successful and notifications sent for reference: ${reference}`)
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