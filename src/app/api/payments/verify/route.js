// Payment Verification Endpoint (for return after payment)
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPaystackPayment } from '@/lib/paystack'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const status = searchParams.get('status')
    
    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference required' },
        { status: 400 }
      )
    }
    
    // Find payment in our database
    const payment = await prisma.payment.findFirst({
      where: { reference },
    })
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }
    
    // If payment is already verified, return current status
    if (payment.status !== 'PENDING') {
      return NextResponse.json({
        success: true,
        status: payment.status,
        message: `Payment is already ${payment.status.toLowerCase()}`,
      })
    }
    
    // For Paystack payments, verify with Paystack
    if (payment.method === 'BANK_TRANSFER' || payment.method === 'MOBILE_MONEY') {
      const verification = await verifyPaystackPayment(reference)
      
      if (verification.status === 'success') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: 'PAID',
            transactionId: verification.id,
          },
        })
        
        return NextResponse.json({
          success: true,
          status: 'PAID',
          message: 'Payment verified successfully',
          data: verification,
        })
      } else {
        return NextResponse.json({
          success: false,
          status: 'FAILED',
          message: 'Payment verification failed',
        })
      }
    }
    
    // For other payment methods, return current status
    return NextResponse.json({
      success: true,
      status: payment.status,
      message: `Payment status: ${payment.status}`,
    })
    
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}