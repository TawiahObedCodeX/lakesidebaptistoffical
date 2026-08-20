// src/app/api/payments/verify/route.ts
// Updated: Removed non-existent fields from the response

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/paystack'

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()
    
    if (!reference) {
      return NextResponse.json(
        { ok: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }
    
    // Verify the payment with Paystack
    const verification = await verifyPayment(reference)
    
    // Check if Paystack confirms the payment
    if (verification.data.status !== 'success') {
      await prisma.donation.update({
        where: { reference: reference },
        data: { 
          status: 'FAILED',
          metadata: {
            verification_response: JSON.parse(JSON.stringify(verification))
          }
        }
      })
      
      return NextResponse.json({
        ok: false,
        error: 'Payment was not successful'
      })
    }
    
    // Get the donation record
    const donation = await prisma.donation.findUnique({
      where: { reference: reference }
    })
    
    if (!donation) {
      return NextResponse.json(
        { ok: false, error: 'Donation record not found' },
        { status: 404 }
      )
    }
    
    // Update donation status to SUCCESSFUL if not already done
    if (donation.status !== 'SUCCESSFUL') {
      await prisma.donation.update({
        where: { reference: reference },
        data: { 
          status: 'SUCCESSFUL',
          metadata: {
            ...(donation.metadata as object || {}),
            verification_response: JSON.parse(JSON.stringify(verification))
          }
        }
      })
    }
    
    // Return the donation data (only fields that exist in schema)
    return NextResponse.json({
      ok: true,
      message: 'Payment verified successfully',
      data: {
        amount: Number(donation.amount), // Convert Decimal to number
        purpose: donation.purpose,
        reference: donation.reference,
        donorName: donation.giverName,
        donorEmail: donation.giverEmail,
        donorPhone: donation.giverPhone,
        status: donation.status,
        date: donation.updatedAt || donation.createdAt
      }
    })
    
  } catch (error: unknown) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}