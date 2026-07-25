// src/app/api/contact/route.ts
// This endpoint processes messages from the contact form
// It validates the input, saves to database, and notifies admins via email

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validation'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { sendContactNotification } from '@/lib/email' // Import our email function

export async function POST(request: Request) {
  try {
    // Apply rate limiting to prevent spam
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    const { success } = await rateLimit(ip, 5, 3600)
    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'Too many messages. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate the incoming message
    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    // Determine the category based on message content
    const category = detectCategory(validatedData.message)
    
    // Save the message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
        category: category,
        status: 'UNREAD',
        metadata: {
          ip_address: ip,
          user_agent: headersList.get('user-agent') || 'unknown',
          submitted_from: headersList.get('referer') || 'direct'
        }
      }
    })
    
    // Send email notification to the church admin
    // This is where the admin receives the contact form message in their email
    await sendContactNotification({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone || null,
      message: validatedData.message,
      category: category,
      referenceId: contactMessage.id
    })
    
    return NextResponse.json({
      ok: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.',
      referenceId: contactMessage.id
    })
    
  } catch (error: unknown) {
    console.error('Contact form error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Please check your information and try again.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { ok: false, error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Helper function to automatically categorize messages
function detectCategory(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('pray') || lowerMessage.includes('prayer')) {
    return 'PRAYER_REQUEST'
  }
  if (lowerMessage.includes('member') || lowerMessage.includes('join')) {
    return 'MEMBERSHIP'
  }
  if (lowerMessage.includes('counsel') || lowerMessage.includes('help')) {
    return 'COUNSELING'
  }
  if (lowerMessage.includes('website') || lowerMessage.includes('tech')) {
    return 'TECHNICAL'
  }
  if (lowerMessage.includes('suggest') || lowerMessage.includes('feedback')) {
    return 'FEEDBACK'
  }
  
  return 'GENERAL'
}