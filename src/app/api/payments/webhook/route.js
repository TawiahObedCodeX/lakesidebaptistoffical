// Payment Webhook Handler (Stripe & Paystack)
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyStripeWebhook } from '@/lib/stripe'
import { verifyPaystackPayment } from '@/lib/paystack'

/**
 * POST - Handle webhook notifications from payment providers
 * This is the most secure way to handle payment confirmations
 * because it's called directly by Stripe/Paystack servers
 */
export async function POST(request) {
  try {
    // Get the raw request body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    const paystackSignature = request.headers.get('x-paystack-signature')
    
    let event = null
    
    // Determine which webhook to process
    if (signature) {
      // Stripe webhook
      try {
        event = await verifyStripeWebhook(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        )
      } catch (error) {
        console.error('Stripe webhook verification failed:', error)
        return NextResponse.json(
          { error: 'Webhook verification failed' },
          { status: 400 }
        )
      }
      
      // Handle Stripe event
      await handleStripeWebhook(event)
      
    } else if (paystackSignature) {
      // Paystack webhook
      // Verify Paystack webhook signature
      // Note: Paystack signature verification is different
      // You should validate the signature using Paystack's method
      
      // Parse the webhook data
      const webhookData = JSON.parse(body)
      const { data, event: webhookEvent } = webhookData
      
      if (webhookEvent === 'charge.success') {
        await handlePaystackWebhook(webhookData)
      }
      
    } else {
      return NextResponse.json(
        { error: 'Unrecognized webhook source' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle Stripe webhook events
 */
async function handleStripeWebhook(event) {
  const { type, data } = event
  
  if (type === 'payment_intent.succeeded') {
    const paymentIntent = data.object
    
    // Find the payment in our database
    const payment = await prisma.payment.findFirst({
      where: { 
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    })
    
    if (payment) {
      // Update payment status to PAID
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          webhookData: event,
        },
      })
      
      // Send confirmation email (implement later)
      // await sendPaymentConfirmation(payment)
    }
  }
  
  if (type === 'payment_intent.payment_failed') {
    const paymentIntent = data.object
    
    // Update payment status to FAILED
    await prisma.payment.updateMany({
      where: { 
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'FAILED',
        webhookData: event,
      },
    })
  }
}

/**
 * Handle Paystack webhook events
 */
async function handlePaystackWebhook(webhookData) {
  const { data } = webhookData
  const { reference, status } = data
  
  // Find the payment by reference
  const payment = await prisma.payment.findFirst({
    where: { 
      reference,
      status: 'PENDING',
    },
  })
  
  if (payment) {
    // Verify payment with Paystack
    const verification = await verifyPaystackPayment(reference)
    
    if (verification.status === 'success') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          webhookData: webhookData,
          transactionId: verification.id,
        },
      })
      
      // Send confirmation email
      // await sendPaymentConfirmation(payment)
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          webhookData: webhookData,
        },
      })
    }
  }
}