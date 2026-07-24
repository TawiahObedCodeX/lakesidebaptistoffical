// src/lib/paystack.ts
// This file handles all communication with Paystack's API
// Centralizing Paystack logic makes it easier to maintain and test

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

// Initialize a new payment transaction
// This creates a payment link that the donor will use
export async function initializePayment(data: {
  email: string
  amount: number
  currency?: string
  reference: string
  metadata?: any
}) {
  try {
    // Make request to Paystack's initialize endpoint
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // Prevent caching of payment requests
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Convert to pesewas (Paystack uses pesewas for GHS)
        currency: data.currency || 'GHS',
        reference: data.reference,
        metadata: data.metadata,
        // Channels to accept
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        // Callback URL (where donor returns after payment)
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/verify`
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initialize payment')
    }
    
    return await response.json()
    
  } catch (error: any) {
    console.error('Paystack initialization error:', error)
    throw new Error('Payment service temporarily unavailable. Please try again.')
  }
}

// Verify a payment transaction
// Always verify on your server, never trust client-side alone
export async function verifyPayment(reference: string) {
  try {
    // Make request to Paystack's verify endpoint
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Cache-Control': 'no-cache'
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify payment')
    }
    
    return await response.json()
    
  } catch (error: any) {
    console.error('Paystack verification error:', error)
    throw new Error('Unable to verify payment at this time.')
  }
}

// Get list of banks for bank transfer payments
export async function getBanks() {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/bank`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })
    
    return await response.json()
    
  } catch (error: any) {
    console.error('Failed to fetch banks:', error)
    throw new Error('Unable to fetch bank list')
  }
}