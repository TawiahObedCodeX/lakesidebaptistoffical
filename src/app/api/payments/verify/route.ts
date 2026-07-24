// src/app/api/payments/verify/route.ts
// This endpoint verifies a payment after the donor returns from Paystack
// It confirms the payment was successful and updates our records

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/paystack'

export async function POST(request: Request) {
  try {
    // Get the reference from the request
    // This reference was given to the frontend when payment was initialized
    const { reference } = await request.json()
    
    if (!reference) {
      return NextResponse.json(
        { ok: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }
    
    // Verify the payment with Paystack
    // This is the most important security step
    // Never trust client-side verification alone
    const verification = await verifyPayment(reference)
    
    // Check if Paystack confirms the payment
    if (!verification.data.status === 'success') {
      // Update our database to reflect the failed payment
      await prisma.donation.update({
        where: { reference: reference },
        data: { 
          status: 'FAILED',
          metadata: {
            verification_response: verification
          }
        }
      })
      
      return NextResponse.json({
        ok: false,
        error: 'Payment was not successful'
      })
    }
    
    // Payment is verified! Update our database
    const donation = await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'SUCCESSFUL',
        isVerified: true,
        verifiedAt: new Date(),
        // Store the complete verification response for record-keeping
        metadata: {
          verification_response: verification
        }
      }
    })
    
    // Here you could:
    // 1. Send email receipt to donor
    // 2. Update church financial records
    // 3. Send notification to admin
    // 4. Log the transaction for accounting
    
    return NextResponse.json({
      ok: true,
      message: 'Payment verified successfully',
      data: {
        amount: donation.amount,
        purpose: donation.purpose,
        reference: donation.reference
      }
    })
    
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}