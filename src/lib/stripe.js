// Stripe Payment Integration
import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.acacia', // Use latest stable version
  typescript: true,
})

/**
 * Create a Stripe Payment Intent
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in smallest currency unit (e.g., cents for USD)
 * @param {string} paymentData.currency - Currency code (USD, NGN, etc.)
 * @param {string} paymentData.paymentMethod - Payment method type
 * @param {Object} paymentData.metadata - Additional metadata
 * @returns {Promise<Object>} Payment Intent object
 */
export async function createStripePaymentIntent(paymentData) {
  try {
    const { amount, currency, paymentMethod, metadata = {} } = paymentData

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount')
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      payment_method_types: ['card'],
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      receipt_email: metadata.payerEmail,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    }
  } catch (error) {
    console.error('Stripe payment creation error:', error)
    throw new Error(`Payment creation failed: ${error.message}`)
  }
}

/**
 * Verify Stripe webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @param {string} webhookSecret - Webhook secret from environment
 * @returns {Promise<Object>} Verified event object
 */
export async function verifyStripeWebhook(payload, signature, webhookSecret) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )
    return event
  } catch (error) {
    console.error('Webhook verification error:', error)
    throw new Error(`Webhook verification failed: ${error.message}`)
  }
}

export default stripe