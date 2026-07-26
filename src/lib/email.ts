// src/lib/email.ts
// This file handles all email sending for the church website
// We use Resend because it's reliable and has a generous free tier (100 emails/day)

import { Resend } from 'resend'

// ALWAYS use environment variables for API keys
// NEVER hardcode API keys in your code - they will be blocked by GitHub
const resend = new Resend(process.env.RESEND_API_KEY || '')

// Interface for contact form email data
interface ContactEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  message: string
  category: string
  referenceId: string
}

// Interface for donation receipt email data
interface DonationReceiptData {
  donorName: string
  donorEmail: string
  amount: number
  currency: string
  purpose: string
  reference: string
  date: Date
}

/**
 * Send contact form message to the church admin
 */
export async function sendContactNotification(data: ContactEmailData) {
  // Check if admin email is configured
  if (!process.env.ADMIN_EMAIL) {
    console.log('ADMIN_EMAIL not configured. Skipping email notification.')
    return
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured. Skipping email notification.')
    return
  }

  try {
    const categoryDisplay = data.category
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())

    await resend.emails.send({
      from: 'Lakeside Baptist Church <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New ${categoryDisplay} Message from ${data.firstName} ${data.lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #1e3a5f; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #1e3a5f; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #1e3a5f; margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; white-space: pre-wrap; margin-top: 5px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
            .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #dbeafe; color: #1e40af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message Received</h1>
              <p style="opacity: 0.9;">Lakeside Baptist Church Contact Form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Category</div>
                <span class="badge">${categoryDisplay}</span>
              </div>
              <div class="field">
                <div class="label">From</div>
                <div class="value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value">${data.email}</div>
              </div>
              ${data.phone ? `<div class="field"><div class="label">Phone</div><div class="value">${data.phone}</div></div>` : ''}
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="field">
                <div class="label">Reference ID</div>
                <div class="value" style="font-family: monospace; font-size: 12px;">${data.referenceId}</div>
              </div>
              <div class="footer">
                <p>This message was sent from the Lakeside Baptist Church website.</p>
                <p>Reply to this email to respond directly to ${data.firstName}.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    console.log(`Email notification sent to admin for message from ${data.firstName} ${data.lastName}`)
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

/**
 * Send donation receipt to the donor
 */
export async function sendDonationReceipt(data: DonationReceiptData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured. Skipping donation receipt.')
    return
  }

  try {
    const currencySymbols: Record<string, string> = {
      GHS: 'GH₵', USD: '$', EUR: '€', GBP: '£'
    }
    const symbol = currencySymbols[data.currency] || data.currency

    const purposeLabels: Record<string, string> = {
      TITHE: 'Tithe', OFFERING: 'Offering', GIVE: 'General Giving', EVENT_TICKET: 'Event / Project'
    }
    const purposeLabel = purposeLabels[data.purpose] || data.purpose

    await resend.emails.send({
      from: 'Lakeside Baptist Church <onboarding@resend.dev>',
      to: data.donorEmail,
      subject: `Donation Receipt - ${symbol}${data.amount} for ${purposeLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .header .amount { font-size: 48px; font-weight: bold; margin: 15px 0; }
            .content { padding: 30px; background: #fff; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            td:first-child { font-weight: bold; color: #1e3a5f; }
            .success-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 20px; border-radius: 25px; font-weight: bold; }
            .bible-verse { background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; font-style: italic; text-align: center; }
            .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #666; padding: 20px; background: #f9fafb; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Generosity!</h1>
              <div class="amount">${symbol}${data.amount.toFixed(2)}</div>
              <p>Your donation has been received.</p>
            </div>
            <div class="content">
              <div style="text-align: center;">
                <span class="success-badge">Payment Successful</span>
              </div>
              <table>
                <tr><td>Donor Name</td><td>${data.donorName}</td></tr>
                <tr><td>Amount</td><td>${symbol}${data.amount.toFixed(2)} ${data.currency}</td></tr>
                <tr><td>Purpose</td><td>${purposeLabel}</td></tr>
                <tr><td>Reference</td><td style="font-family: monospace;">${data.reference}</td></tr>
                <tr><td>Date</td><td>${data.date.toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td></tr>
              </table>
              <div class="bible-verse">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                <br><strong>- 2 Corinthians 9:7</strong>
              </div>
              <div class="footer">
                <p><strong>Lakeside Baptist Church</strong></p>
                <p>Lakeside Estate, Community 6, Tema, Ghana</p>
                <p>+233 24 838 3745 | lakesidebaptistchurch1@gmail.com</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    console.log(`Donation receipt sent to ${data.donorEmail}`)
  } catch (error) {
    console.error('Failed to send donation receipt:', error)
  }
}