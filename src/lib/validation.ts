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
  
  giverPhone: z.string()
    .regex(/^\+?[\d\s-()]{10,20}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  
  metadata: z.object({
    note: z.string().max(500, 'Note must be less than 500 characters').optional(),
    source: z.string().optional()
  }).optional()
})

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
  
  // CHANGED: Minimum message length from 10 to 3 characters
  message: z.string()
    .min(3, 'Message must be at least 3 characters')
    .max(5000, 'Message must be less than 5000 characters')
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