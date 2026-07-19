// src/app/api/payments/create-payment/route.js - FIXED

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { paymentSchema } from '@/lib/validators'
import { createStripePaymentIntent } from '@/lib/stripe'
import { initializePaystackPayment } from '@/lib/paystack'
import { encryptData, generateSecureToken } from '@/lib/encryption'
import { rateLimiter } from '@/lib/rate-limit'

export async function POST(request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimiter(ip, 'payment_create', 10, 3600000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    const validation = paymentSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const paymentData = validation.data
    const { 
      amount, 
      currency, 
      payerName, 
      payerEmail, 
      payerPhone,  // ✅ ADDED
      method,
      purpose,     // ✅ ADDED
      cardNumber,
      expiryDate,
      cvv,
      bankName,
      accountNumber,
    } = paymentData

    const reference = `PAY-${Date.now()}-${generateSecureToken(8)}`

    let providerResponse = null
    let provider = ''

    if (method === 'CREDIT_CARD') {
      provider = 'STRIPE'
      providerResponse = await createStripePaymentIntent({
        amount,
        currency: currency || 'USD',
        paymentMethod: 'card',
        metadata: {
          payerName,
          payerEmail,
          payerPhone,
          purpose,
          reference,
        },
      })
    } else if (method === 'BANK_TRANSFER' || method === 'MOBILE_MONEY') {
      provider = 'PAYSTACK'
      providerResponse = await initializePaystackPayment({
        amount,
        currency: currency || 'NGN',
        email: payerEmail,
        reference,
        metadata: {
          payerName,
          payerPhone,
          purpose,
          bankName,
          method,
        },
      })
    } else {
      provider = 'MANUAL'
    }

    // Encrypt sensitive data
    const encryptedData = {
      cardNumber: cardNumber ? encryptData(cardNumber) : null,
      expiryDate: expiryDate ? encryptData(expiryDate) : null,
      cvv: cvv ? encryptData(cvv) : null,
      accountNumber: accountNumber ? encryptData(accountNumber) : null,
    }

    // ✅ FIXED: Save payment with all fields
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        status: 'PENDING',
        payerName,
        payerEmail,
        payerPhone,      // ✅ ADDED
        method,
        purpose,         // ✅ ADDED
        reference,
        cardType: method === 'CREDIT_CARD' ? 'Card' : null,
        lastFour: method === 'CREDIT_CARD' && cardNumber ? cardNumber.slice(-4) : null,
        bankName: method === 'BANK_TRANSFER' ? bankName : null,
        accountNumber: method === 'BANK_TRANSFER' ? encryptedData.accountNumber : null,
        transactionId: providerResponse?.paymentIntentId || providerResponse?.reference,
        paymentIntentId: providerResponse?.paymentIntentId,
        webhookData: providerResponse,
        createdBy: 'anonymous',
      },
    })

    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { createdBy: session.user.id },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        reference: payment.reference,
        status: payment.status,
        provider,
        ...(provider === 'STRIPE' && { clientSecret: providerResponse.clientSecret }),
        ...(provider === 'PAYSTACK' && { 
          authorizationUrl: providerResponse.authorizationUrl,
          accessCode: providerResponse.accessCode,
        }),
        ...(provider === 'MANUAL' && { 
          message: 'Payment recorded. Please complete payment manually.',
        }),
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment: ' + error.message },
      { status: 500 }
    )
  }
}