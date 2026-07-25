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
    // This limits each IP address to only 5 messages per hour
    // Think of it like a bouncer at a club - too many visits and you have to wait
    const headersList = await headers() // Must await in Next.js 14+
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    
    const { success } = await rateLimit(ip, 5, 3600) // 5 messages allowed per hour
    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'Too many messages. Please try again later.' },
        { status: 429 } // HTTP 429 means "Too Many Requests"
      )
    }
    
    // Read and understand the message being sent to us
    // This converts the raw data into a format our code can work with
    const body = await request.json()
    
    // Validate the message using our Zod schema
    // This is like a security checkpoint - it makes sure all information is safe and complete
    // If validation fails, it will throw an error that we catch below
    const validatedData = contactSchema.parse(body)
    
    // Automatically figure out what category this message belongs to
    // This helps church staff organize and prioritize messages
    // For example, prayer requests get handled differently than technical questions
    const category = detectCategory(validatedData.message)
    
    // Save the validated message to our database
    // This stores the message permanently so church staff can read and respond to it
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName: validatedData.firstName, // Person's first name
        lastName: validatedData.lastName,   // Person's last name
        email: validatedData.email,         // Email address for replies
        phone: validatedData.phone || null, // Phone number if provided (optional)
        message: validatedData.message,     // The actual message text
        category: category,                 // Automatically detected category
        status: 'UNREAD',                   // Starts as unread, like an unopened letter
        // Store technical information for security and spam detection
        // This helps identify suspicious messages but is only visible to administrators
        metadata: {
          ip_address: ip,                                          // Internet address of sender
          user_agent: headersList.get('user-agent') || 'unknown',  // Browser information
          submitted_from: headersList.get('referer') || 'direct'   // Which page they came from
        }
      }
    })
    
    // Send a notification to the church admin
    // This alerts them that someone has reached out and needs attention
    await notifyAdmin(contactMessage)
    
    // Send back a success response with a reference ID
    // The reference ID helps track the message if there are follow-up questions
    return NextResponse.json({
      ok: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.',
      referenceId: contactMessage.id // Unique ID for tracking this conversation
    })
    
  } catch (error: unknown) {
    // Log the error for debugging - developers can see this in the server logs
    console.error('Contact form error:', error)
    
    // Check if the error happened because of invalid user input
    // This is different from a server error - it means the user needs to fix something
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { ok: false, error: 'Please check your information and try again.' },
        { status: 400 } // HTTP 400 means "Bad Request"
      )
    }
    
    // For any other type of error, send a general error message
    // We don't share specific error details to keep our system secure
    return NextResponse.json(
      { ok: false, error: 'Failed to send message. Please try again later.' },
      { status: 500 } // HTTP 500 means "Internal Server Error"
    )
  }
}

// Helper function to automatically categorize messages
// This reads the message content and determines what it's about
// It's like sorting mail into different folders based on content
function detectCategory(message: string): string {
  // Convert to lowercase so we can match words regardless of capitalization
  // For example, "Prayer", "prayer", and "PRAYER" all match the same way
  const lowerMessage = message.toLowerCase()
  
  // Check for keywords that indicate the message category
  // Each check looks for specific words that suggest what the message is about
  if (lowerMessage.includes('pray') || lowerMessage.includes('prayer')) {
    return 'PRAYER_REQUEST' // Someone needs spiritual support
  }
  if (lowerMessage.includes('member') || lowerMessage.includes('join')) {
    return 'MEMBERSHIP' // Someone wants to become a church member
  }
  if (lowerMessage.includes('counsel') || lowerMessage.includes('help')) {
    return 'COUNSELING' // Someone needs guidance or support
  }
  if (lowerMessage.includes('website') || lowerMessage.includes('tech')) {
    return 'TECHNICAL' // Something is wrong with the website or technology
  }
  if (lowerMessage.includes('suggest') || lowerMessage.includes('feedback')) {
    return 'FEEDBACK' // Someone has ideas or comments about the church
  }
  
  // If no specific category matches, label it as general
  return 'GENERAL' // Catch-all for messages that don't fit other categories
}

// Helper function to notify admin of new messages
// This sends alerts to church staff so they know someone needs attention
// Currently this just logs to the console, but can be upgraded to send emails or messages
async function notifyAdmin(message: {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  message: string
  category: string
  status: string
  metadata: unknown
}) {
  // Check if we have an admin email configured
  // This email address is where notifications should be sent
  if (process.env.ADMIN_EMAIL) {
    // Log notification details for now
    // In production, this could send actual emails using services like:
    // - SendGrid (email delivery service)
    // - Resend (modern email API)
    // - AWS SES (Amazon's email service)
    // - Nodemailer (email sending library)
    
    console.log(`📧 Notification: New message from ${message.firstName} ${message.lastName}`)
    console.log(`   Category: ${message.category}`) // What type of message this is
    console.log(`   Message ID: ${message.id}`)     // Reference number for tracking
    
    // TODO: Implement actual email sending here
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'notifications@yourchurch.com',
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New ${message.category} Message from ${message.firstName}`,
    //   text: `Message from ${message.firstName} ${message.lastName} (${message.email}):\n\n${message.message}`
    // })
  }
  
  // Other notification options you could add:
  // - Slack: Send to a church staff Slack channel
  // - Discord: Post in a church management Discord server
  // - Telegram: Send to a church admin Telegram group
  // - SMS: Send text messages using Twilio or similar service
}