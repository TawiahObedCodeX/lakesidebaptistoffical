// Paystack Payment Integration (African Banks & Cards)
import Paystack from 'paystack-api'

// Initialize Paystack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '')

/**
 * Initialize Paystack Payment
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in kobo (for NGN) or smallest unit
 * @param {string} paymentData.currency - Currency code (NGN, USD, etc.)
 * @param {string} paymentData.email - Payer email
 * @param {string} paymentData.reference - Unique reference
 * @param {Object} paymentData.metadata - Additional metadata
 * @returns {Promise<Object>} Payment initialization response
 */
export async function initializePaystackPayment(paymentData) {
  try {
    const { amount, currency, email, reference, metadata = {} } = paymentData

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount')
    }

    // Initialize payment
    const response = await paystack.transaction.initialize({
      amount: Math.round(amount * 100), // Convert to kobo (for NGN)
      currency: currency || 'NGN',
      email,
      reference: reference || `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
    })

    return {
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
      accessCode: response.data.access_code,
    }
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw new Error(`Payment initialization failed: ${error.message}`)
  }
}

/**
 * Verify Paystack Payment
 * @param {string} reference - Payment reference from callback
 * @returns {Promise<Object>} Payment verification response
 */
export async function verifyPaystackPayment(reference) {
  try {
    const response = await paystack.transaction.verify({ reference })
    return response.data
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw new Error(`Payment verification failed: ${error.message}`)
  }
}

export default paystack