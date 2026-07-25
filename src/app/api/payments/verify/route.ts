// src/app/api/payments/verify/route.ts
// This endpoint verifies a payment after the donor returns from Paystack
// It confirms the payment was successful and updates our records

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/paystack'

export async function POST(request: Request) {
  try {
    // Get the reference number from the frontend
    // This reference was created when the payment was initialized
    // It's like a claim ticket - it helps us find the specific transaction
    const { reference } = await request.json()
    
    // Make sure a reference number was provided
    // Without it, we can't find the payment to verify
    if (!reference) {
      return NextResponse.json(
        { ok: false, error: 'Payment reference is required' },
        { status: 400 } // Bad Request
      )
    }
    
    // Ask Paystack to confirm if the payment was successful
    // This is the most important security step - we never trust client-side verification
    // Think of it like a bank confirming a check is valid before accepting it
    const verification = await verifyPayment(reference)
    
    // Check if Paystack says the payment was successful
    // We compare the status to 'success' (not checking if it's NOT success)
    // Fixed: Using !== instead of !verification.data.status === 'success'
    if (verification.data.status !== 'success') {
      // Payment failed or was cancelled
      // Update our database to show this donation didn't go through
      await prisma.donation.update({
        where: { reference: reference },
        data: { 
          status: 'FAILED',
          metadata: {
            verification_response: verification // Store Paystack's response for records
          }
        }
      })
      
      return NextResponse.json({
        ok: false,
        error: 'Payment was not successful'
      })
    }
    
    // Payment is verified and successful!
    // Update our database to mark this donation as completed
    const donation = await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'SUCCESSFUL',        // Payment went through
        isVerified: true,            // We've confirmed it's real
        verifiedAt: new Date(),      // When we verified it
        // Store the complete verification response for future reference
        metadata: {
          verification_response: verification // Paystack's confirmation data
        }
      }
    })
    
    // At this point, you could also:
    // 1. Send an email receipt to the donor (proof of their donation)
    // 2. Update the church's financial records (for accounting)
    // 3. Send a notification to the church admin (someone donated!)
    // 4. Log the transaction for tax purposes (required in many countries)
    
    return NextResponse.json({
      ok: true,
      message: 'Payment verified successfully',
      data: {
        amount: donation.amount,       // How much was donated
        purpose: donation.purpose,     // What the donation was for
        reference: donation.reference  // The tracking number
      }
    })
    
  } catch (error: unknown) {
    // Log the error for developers to debug
    console.error('Payment verification error:', error)
    
    // Return a general error message
    // We don't share specific errors to keep the system secure
    return NextResponse.json(
      { ok: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}