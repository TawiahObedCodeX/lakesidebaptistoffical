// src/app/api/payments/verify/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayment } from '@/lib/paystack'
import { sendDonationReceipt } from '@/lib/email' // Import email function

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
    
    // Payment is verified! Update our database
    const donation = await prisma.donation.update({
      where: { reference: reference },
      data: {
        status: 'SUCCESSFUL',
        isVerified: true,
        verifiedAt: new Date(),
        metadata: {
          verification_response: JSON.parse(JSON.stringify(verification))
        }
      }
    })
    
    // Send donation receipt email to the donor
    // This gives them a record of their generous gift
    await sendDonationReceipt({
      donorName: donation.giverName,
      donorEmail: donation.giverEmail,
      amount: Number(donation.amount),
      currency: donation.currency,
      purpose: donation.purpose,
      reference: donation.reference,
      date: new Date()
    })
    
    return NextResponse.json({
      ok: true,
      message: 'Payment verified successfully',
      data: {
        amount: donation.amount,
        purpose: donation.purpose,
        reference: donation.reference,
        donorName: donation.giverName,
        donorEmail: donation.giverEmail,
        date: donation.verifiedAt
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