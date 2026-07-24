// src/app/api/contact/route.ts
// This endpoint processes messages from the contact form
// It validates the input, saves to database, and notifies admins

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validation'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Apply rate limiting to prevent spam
    // Limits each IP to 5 messages per hour
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    const { success } = await rateLimit(ip, 5, 3600) // 5 per hour
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
    // This helps admins prioritize messages
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
        // Store IP and user agent for spam detection
        // This data is only visible to admins
        metadata: {
          ip_address: ip,
          user_agent: headersList.get('user-agent') || 'unknown',
          submitted_from: headersList.get('referer') || 'direct'
        }
      }
    })
    
    // Send notification to admin (implementation depends on your setup)
    // Options: email, Slack, Discord, Telegram, SMS, etc.
    await notifyAdmin(contactMessage)
    
    return NextResponse.json({
      ok: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.',
      referenceId: contactMessage.id // For tracking purposes
    })
    
  } catch (error: any) {
    console.error('Contact form error:', error)
    
    // Handle validation errors
    if (error.name === 'ZodError') {
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

// Helper function to notify admin of new messages
// You can customize this based on your needs
async function notifyAdmin(message: any) {
  // Example: Send email notification
  // This is a placeholder - implement based on your email service
  
  if (process.env.ADMIN_EMAIL) {
    // You could use services like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Nodemailer with SMTP
    
    console.log(`📧 Notification: New message from ${message.firstName} ${message.lastName}`)
    console.log(`   Category: ${message.category}`)
    console.log(`   Message ID: ${message.id}`)
  }
  
  // You could also send to:
  // - Slack channel
  // - Discord webhook
  // - Telegram bot
  // - SMS via Twilio
}