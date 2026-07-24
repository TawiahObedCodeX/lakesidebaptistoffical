// src/lib/validation.ts
// This file defines validation rules for all inputs
// Using Zod ensures data integrity and prevents injection attacks

import { z } from 'zod'

// Payment validation schema
// This validates all donation form data before processing
export const paymentSchema = z.object({
  // Amount validation
  amount: z.number()
    .min(10, 'Minimum donation is GH₵10')     // Church minimum
    .max(1000000, 'Maximum donation is GH₵1,000,000'), // Security limit
  
  // Currency validation
  currency: z.enum(['GHS', 'USD', 'EUR', 'GBP']).default('GHS'),
  // Only allow specific currencies
  
  // Purpose validation
  purpose: z.enum(['TITHE', 'OFFERING', 'GIVE', 'EVENT_TICKET']),
  // Must match our database enum
  
  // Donor information validation
  giverName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  // Regex prevents special characters that could be used for injection
  
  giverEmail: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .toLowerCase() // Normalize email to lowercase
    .trim(),
  
  giverPhone: z.string()
    .regex(/^\+?[\d\s-()]{10,20}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  // Optional phone with format validation
  
  // Metadata validation
  metadata: z.object({
    note: z.string()
      .max(500, 'Note must be less than 500 characters')
      .optional(),
    source: z.string().optional()
  }).optional()
})

// Contact form validation schema
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
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    // Sanitize HTML to prevent XSS attacks
    .transform(val => sanitizeHtml(val))
})

// Simple HTML sanitizer to prevent XSS attacks
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}