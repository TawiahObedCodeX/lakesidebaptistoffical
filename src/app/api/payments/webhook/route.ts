// src/app/api/payments/webhook/route.ts
// Updated: Fixed Prisma client reference and added proper error handling

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

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
    phone?: string
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
  
  if (!reference) {
    console.error('No reference in webhook data')
    return
  }
  
  try {
    // Get existing donation to preserve metadata
    const existingDonation = await prisma.donation.findUnique({
      where: { reference: reference }
    })
    
    if (!existingDonation) {
      console.error('Donation not found for reference:', reference)
      return
    }
    
    // Prepare metadata - merge existing with new data
    const existingMetadata = (existingDonation.metadata as Record<string, unknown>) || {}
    const newMetadata = {
      ...existingMetadata,
      payment_method: data.channel,
      card_type: data.authorization?.card_type,
      bank: data.authorization?.bank,
      webhook_data: JSON.parse(JSON.stringify(data)),
      sms_sent: true // Paystack automatically sends SMS receipt
    }
    
    // Update donation record
    await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'SUCCESSFUL',
        metadata: newMetadata
      }
    })
    
    // Track SMS notification if phone number exists
    const phoneNumber = metadata?.giver_phone || data.customer?.phone || existingDonation.giverPhone
    
    if (phoneNumber) {
      // Check if SMS notification already exists to avoid duplicates
      const existingSms = await prisma.smsNotification.findFirst({
        where: {
          donationId: existingDonation.id,
          smsProviderId: reference
        }
      })
      
      if (!existingSms) {
        await prisma.smsNotification.create({
          data: {
            donationId: existingDonation.id,
            recipientPhone: phoneNumber,
            message: `Payment of GHS ${(data.amount || 0) / 100} received. Thank you for your donation!`,
            smsProvider: 'PAYSTACK',
            smsProviderId: reference,
            smsStatus: 'SENT',
            sentAt: new Date()
          }
        })
        
        console.log(`📱 SMS notification tracked for ${phoneNumber} - Reference: ${reference}`)
      }
    }
    
    console.log(`✅ Payment successful for reference: ${reference} - SMS sent by Paystack`)
    
  } catch (error: unknown) {
    console.error('Error handling successful payment:', error)
  }
}

async function handleFailedPayment(data: PaystackWebhookData) {
  const { reference } = data
  
  if (!reference) {
    console.error('No reference in webhook data')
    return
  }
  
  try {
    // Get existing donation to preserve metadata
    const existingDonation = await prisma.donation.findUnique({
      where: { reference: reference }
    })
    
    if (!existingDonation) {
      console.error('Donation not found for reference:', reference)
      return
    }
    
    const existingMetadata = (existingDonation.metadata as Record<string, unknown>) || {}
    
    await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'FAILED',
        metadata: {
          ...existingMetadata,
          failure_reason: data.gateway_response,
          webhook_data: JSON.parse(JSON.stringify(data))
        }
      }
    })
    
    console.log(`❌ Payment failed for reference: ${reference}`)
    
  } catch (error: unknown) {
    console.error('Error handling failed payment:', error)
  }
}

async function handleRefund(data: PaystackWebhookData) {
  const { reference } = data
  
  if (!reference) {
    console.error('No reference in webhook data')
    return
  }
  
  try {
    const existingDonation = await prisma.donation.findUnique({
      where: { reference: reference }
    })
    
    if (!existingDonation) {
      console.error('Donation not found for reference:', reference)
      return
    }
    
    const existingMetadata = (existingDonation.metadata as Record<string, unknown>) || {}
    
    await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'REFUNDED',
        metadata: {
          ...existingMetadata,
          refund_data: JSON.parse(JSON.stringify(data))
        }
      }
    })
    
    console.log(`💸 Payment refunded for reference: ${reference}`)
    
  } catch (error: unknown) {
    console.error('Error handling refund:', error)
  }
}