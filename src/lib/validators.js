// Input Validation Schemas using Zod
import { z } from 'zod'

/**
 * Newsletter validation schema
 * Used for creating and updating newsletters
 */
export const newsletterSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long')
    .trim()
    .regex(/^[a-zA-Z0-9\s\-',.!?]+$/, 'Title contains invalid characters'),
  
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content is too long')
    .trim(),
  
  excerpt: z.string()
    .max(300, 'Excerpt is too long')
    .optional()
    .nullable(),
  
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
})

/**
 * Contact message validation schema
 * Used for public contact form
 */
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email is too long'),
  
  phone: z.string()
    .regex(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject is too long')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long')
    .trim(),
  
  category: z.enum([
    'PRAYER_REQUEST',
    'FEEDBACK',
    'SUGGESTION',
    'GENERAL',
    'URGENT_MATTER',
    'PASTORAL_CARE',
    'VOLUNTEER'
  ])
})

/**
 * Payment validation schema
 * For creating new payments
 */
export const paymentSchema = z.object({
  amount: z.number()
    .positive('Amount must be greater than 0')
    .min(0.01, 'Minimum amount is 0.01')
    .max(1000000, 'Amount exceeds maximum allowed'),
  
  currency: z.string()
    .length(3, 'Invalid currency code')
    .toUpperCase(),
  
  payerName: z.string()
    .min(2, 'Name is required')
    .max(100, 'Name is too long'),
  
  payerEmail: z.string()
    .email('Invalid email address'),
  
  payerPhone: z.string()
    .regex(/^[0-9+\-\s()]{10,15}$/, 'Invalid phone number')
    .optional()
    .nullable(),
  
  method: z.enum(['CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CASH', 'CHECK', 'OTHER']),
  
  purpose: z.string()
    .max(500, 'Purpose is too long')
    .optional()
    .nullable(),
  
  // For card payments
  cardNumber: z.string()
    .regex(/^[0-9]{15,16}$/, 'Invalid card number')
    .optional(),
  
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)')
    .optional(),
  
  cvv: z.string()
    .regex(/^[0-9]{3,4}$/, 'Invalid CVV')
    .optional(),
  
  // For bank transfers
  bankName: z.string()
    .max(100, 'Bank name is too long')
    .optional(),
  
  accountNumber: z.string()
    .regex(/^[0-9]{10,14}$/, 'Invalid account number')
    .optional(),
})

/**
 * Admin login validation schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .toLowerCase(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
})

/**
 * Rate limiting validation
 */
export const rateLimitSchema = z.object({
  key: z.string()
    .min(1, 'Rate limit key is required')
    .max(255, 'Rate limit key is too long'),
  
  limit: z.number()
    .int()
    .positive()
    .min(1, 'Limit must be at least 1')
    .max(1000, 'Limit exceeds maximum allowed'),
  
  windowMs: z.number()
    .int()
    .positive()
    .min(60000, 'Window must be at least 1 minute')
    .max(86400000, 'Window cannot exceed 24 hours'),
})

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (!input) return ''
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize payment card number (partial)
 * @param {string} cardNumber - Full card number
 * @returns {Object} Validation result and masked number
 */
export function validateCardNumber(cardNumber) {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // Check if it's a valid number
  if (!/^[0-9]{15,16}$/.test(cleaned)) {
    return { valid: false, error: 'Invalid card number format' }
  }
  
  // Luhn algorithm check
  let sum = 0
  let alternate = false
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let n = parseInt(cleaned[i])
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  
  const valid = sum % 10 === 0
  
  // Determine card type
  let cardType = 'Unknown'
  const firstDigit = cleaned[0]
  const firstTwo = cleaned.slice(0, 2)
  const firstFour = cleaned.slice(0, 4)
  
  if (firstDigit === '4') cardType = 'Visa'
  else if (firstTwo >= '51' && firstTwo <= '55') cardType = 'Mastercard'
  else if (firstTwo === '34' || firstTwo === '37') cardType = 'American Express'
  else if (firstFour === '6011' || firstTwo === '65' || (firstTwo >= '64' && firstTwo <= '65')) cardType = 'Discover'
  
  // Mask the card number (show last 4 digits only)
  const masked = `**** **** **** ${cleaned.slice(-4)}`
  const lastFour = cleaned.slice(-4)
  
  return {
    valid,
    cardType,
    masked,
    lastFour,
    error: valid ? null : 'Invalid card number',
  }
}