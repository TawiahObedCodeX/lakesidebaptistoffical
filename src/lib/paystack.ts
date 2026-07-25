// src/lib/paystack.ts
// This file handles all communication with Paystack's API
// Centralizing Paystack logic makes it easier to maintain and test

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

// Define types for better TypeScript support
// These types describe what data Paystack expects and returns
interface InitializePaymentParams {
  email: string
  amount: number
  currency?: string
  reference: string
  metadata?: Record<string, unknown> // Object with unknown structure
}

interface PaystackResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
    [key: string]: unknown // Allow additional properties from Paystack
  }
}

// Initialize a new payment transaction
// This creates a payment link that the donor will use to pay
// Think of it like creating a checkout page for the donor
export async function initializePayment(data: InitializePaymentParams) {
  try {
    // Send a request to Paystack to create a new payment
    // This tells Paystack: "Someone wants to make a donation"
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Our secret key for authentication
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // Don't cache payment requests for security
      },
      body: JSON.stringify({
        email: data.email,                    // Who is making the payment
        amount: data.amount * 100,            // Convert to pesewas (Paystack uses the smallest currency unit)
        currency: data.currency || 'GHS',     // Ghana Cedis by default
        reference: data.reference,            // Our unique tracking number
        metadata: data.metadata,              // Extra information about the payment
        // Payment methods we accept
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        // Where to send the donor after payment
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/verify`
      })
    })
    
    // Check if Paystack accepted our request
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initialize payment')
    }
    
    // Return Paystack's response with the payment page URL
    return await response.json() as PaystackResponse
    
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Paystack initialization error:', error)
    
    // Throw a user-friendly error message
    // We don't share technical details that could be a security risk
    throw new Error('Payment service temporarily unavailable. Please try again.')
  }
}

// Verify a payment transaction
// This checks with Paystack if a payment was actually completed
// ALWAYS verify on your server - never trust client-side verification alone
export async function verifyPayment(reference: string) {
  try {
    // Ask Paystack: "Did this payment really happen?"
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Our secret key
        'Cache-Control': 'no-cache' // Don't cache verification results
      }
    })
    
    // Check if Paystack responded successfully
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify payment')
    }
    
    // Return Paystack's verification response
    return await response.json()
    
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Paystack verification error:', error)
    
    // Throw a user-friendly error
    throw new Error('Unable to verify payment at this time.')
  }
}

// Get list of banks for bank transfer payments
// This fetches all supported banks in Ghana from Paystack
export async function getBanks() {
  try {
    // Ask Paystack for the list of banks they support
    const response = await fetch(`${PAYSTACK_BASE_URL}/bank`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}` // Our secret key
      }
    })
    
    // Return the list of banks
    return await response.json()
    
  } catch (error: unknown) {
    // Log the error
    console.error('Failed to fetch banks:', error)
    
    // Throw an error if we can't get the bank list
    throw new Error('Unable to fetch bank list')
  }
}