// src/lib/validation.ts
import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.number()
    .min(10, 'Minimum donation is GH₵10')
    .max(1000000, 'Maximum donation is GH₵1,000,000'),
  
  currency: z.enum(['GHS', 'USD', 'EUR', 'GBP']).default('GHS'),
  
  purpose: z.enum(['TITHE', 'OFFERING', 'GIVE', 'EVENT_TICKET']),
  
  giverName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  giverEmail: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .toLowerCase()
    .trim(),
  
  // Phone is now optional since OTP is removed
  giverPhone: z.string()
    .regex(/^(0|\+?233)\d{9}$/, 'Please enter a valid Ghana phone number (e.g., 0241234567)')
    .optional()
    .nullable(),
  
  metadata: z.object({
    note: z.string().max(500, 'Note must be less than 500 characters').optional(),
    source: z.string().optional()
  }).optional()
})

// Updated contact schema with 200-word limit
export const contactSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^\+?[\d\s-()]{10,20}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  
  // Message with 200-word limit
  message: z.string()
    .min(3, 'Message must be at least 3 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).length;
        return wordCount <= 200;
      },
      { message: 'Message must be 200 words or less' }
    )
    .transform(val => sanitizeHtml(val))
})

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}