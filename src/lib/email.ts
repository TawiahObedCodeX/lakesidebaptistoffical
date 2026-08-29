// src/lib/email.ts
// This file handles all email sending for the church website
// We use Resend because it's reliable and has a generous free tier (100 emails/day)

import { Resend } from 'resend'

// ALWAYS use environment variables for API keys
// NEVER hardcode API keys in your code - they will be blocked by GitHub
//
// IMPORTANT: We do NOT create the Resend client at the top level anymore.
// Creating `new Resend(...)` at import time causes Next.js's build step
// ("Collecting page data") to run it immediately, and if RESEND_API_KEY
// isn't available at that moment, Resend throws and crashes the build.
// Instead, we create the client lazily, only when we're about to send.
let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

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
    const client = getResendClient()
    if (!client) {
      console.log('Resend client unavailable. Skipping email notification.')
      return
    }

    const categoryDisplay = data.category
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())

    await client.emails.send({
      from: 'Lakeside Baptist Church <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New ${categoryDisplay} Message from ${data.firstName} ${data.lastName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Message - Lakeside Baptist Church</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: #1e3a5f; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    New ${categoryDisplay} message from ${data.firstName} ${data.lastName} — Lakeside Baptist Church
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        
        <!-- Main container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.75); font-weight: 500;">
                Lakeside Baptist Church
              </p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                New Message Received
              </h1>
            </td>
          </tr>

          <!-- Category badge -->
          <tr>
            <td style="padding: 28px 40px 0; text-align: center;">
              <span style="display: inline-block; background-color: #e8f0fe; color: #1e3a5f; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px;">
                ${categoryDisplay}
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 28px 40px 32px;" class="mobile-padding">
              
              <!-- From -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">From</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px;">
                    <span style="font-size: 16px; font-weight: 500; color: #111827;">${data.firstName} ${data.lastName}</span>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">Email</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px;">
                    <a href="mailto:${data.email}" style="font-size: 15px; color: #1e3a5f; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
              </table>

              ${data.phone ? `
              <!-- Phone -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">Phone</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px;">
                    <a href="tel:${data.phone}" style="font-size: 15px; color: #1e3a5f; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Message -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">Message</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-left: 4px solid #1e3a5f; border-radius: 6px; padding: 16px;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${data.message.replace(/\n/g, '<br>')}</p>
                  </td>
                </tr>
              </table>

              <!-- Reference ID -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">Reference ID</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                    <span style="font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 13px; color: #4b5563;">${data.referenceId}</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #e5e7eb;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                This message was sent from the Lakeside Baptist Church website.
              </p>
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Reply to this email to respond directly to ${data.firstName}.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom branding -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 24px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Lakeside Estate, Community 6, Tema, Ghana
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
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
    const client = getResendClient()
    if (!client) {
      console.log('Resend client unavailable. Skipping donation receipt.')
      return
    }

    const currencySymbols: Record<string, string> = {
      GHS: 'GH₵', USD: '$', EUR: '€', GBP: '£'
    }
    const symbol = currencySymbols[data.currency] || data.currency

    const purposeLabels: Record<string, string> = {
      TITHE: 'Tithe', OFFERING: 'Offering', GIVE: 'General Giving', EVENT_TICKET: 'Event / Project'
    }
    const purposeLabel = purposeLabels[data.purpose] || data.purpose

    await client.emails.send({
      from: 'Lakeside Baptist Church <onboarding@resend.dev>',
      to: data.donorEmail,
      subject: `Donation Receipt - ${symbol}${data.amount} for ${purposeLabel}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Donation Receipt - Lakeside Baptist Church</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: #1e3a5f; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .amount-text { font-size: 36px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Thank you for your generous gift of ${symbol}${data.amount.toFixed(2)} — Lakeside Baptist Church
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        
        <!-- Main container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 40px 40px 36px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.75); font-weight: 500;">
                Lakeside Baptist Church
              </p>
              <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                Thank You for Your Generosity
              </h1>
              <p class="amount-text" style="margin: 0; font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.1;">
                ${symbol}${data.amount.toFixed(2)}
              </p>
              <p style="margin: 12px 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">
                Your donation has been received
              </p>
            </td>
          </tr>

          <!-- Success badge -->
          <tr>
            <td style="padding: 28px 40px 0; text-align: center;">
              <span style="display: inline-block; background-color: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 8px 18px; border-radius: 20px;">
                Payment Successful
              </span>
            </td>
          </tr>

          <!-- Details table -->
          <tr>
            <td style="padding: 28px 40px 8px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                
                <tr>
                  <td style="padding: 14px 20px; background-color: #f8fafc; border-bottom: 1px solid #e5e7eb; width: 40%;">
                    <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;">Donor</span>
                  </td>
                  <td style="padding: 14px 20px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 15px; color: #111827; font-weight: 500;">${data.donorName}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; background-color: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;">Amount</span>
                  </td>
                  <td style="padding: 14px 20px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 15px; color: #111827; font-weight: 500;">${symbol}${data.amount.toFixed(2)} ${data.currency}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; background-color: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;">Purpose</span>
                  </td>
                  <td style="padding: 14px 20px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 15px; color: #111827; font-weight: 500;">${purposeLabel}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; background-color: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;">Reference</span>
                  </td>
                  <td style="padding: 14px 20px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 13px; color: #4b5563;">${data.reference}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; background-color: #f8fafc;">
                    <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;">Date</span>
                  </td>
                  <td style="padding: 14px 20px; background-color: #ffffff;">
                    <span style="font-size: 15px; color: #111827;">${data.date.toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Bible verse -->
          <tr>
            <td style="padding: 24px 40px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px 24px; text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.6; color: #713f12; font-style: italic;">
                      "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                    </p>
                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #a16207;">
                      — 2 Corinthians 9:7
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #e5e7eb;"></div>
            </td>
          </tr>

          <!-- Church contact footer -->
          <tr>
            <td style="padding: 28px 40px 32px; text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #1e3a5f;">
                Lakeside Baptist Church
              </p>
              <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Lakeside Estate, Community 6, Tema, Ghana
              </p>
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                +233 24 838 3745 &nbsp;·&nbsp; lakesidebaptistchurch1@gmail.com
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom note -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 24px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                This is an official receipt for your records. Please keep it for your personal reference.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    console.log(`Donation receipt sent to ${data.donorEmail}`)
  } catch (error) {
    console.error('Failed to send donation receipt:', error)
  }
}