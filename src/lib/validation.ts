// src/lib/validation.ts
// Input validation schemas using Zod
// Think of these as security guards at the entrance of a building
// They check every piece of data before it enters our system
// This prevents bad or malicious data from causing problems

import { z } from 'zod'

// Validation schema for donation/payment data
// Every field has specific rules to ensure data integrity and security
export const paymentSchema = z.object({
  // Amount validation
  // Minimum: GH₵10 (prevents tiny test transactions)
  // Maximum: GH₵1,000,000 (prevents system overload)
  amount: z.number()
    .min(10, 'Minimum donation is GH₵10')
    .max(1000000, 'Maximum donation is GH₵1,000,000'),
  
  // Currency must be one of our supported currencies
  currency: z.enum(['GHS', 'USD', 'EUR', 'GBP']).default('GHS'),
  
  // Purpose must match our predefined categories
  purpose: z.enum(['TITHE', 'OFFERING', 'GIVE', 'EVENT_TICKET']),
  
  // Donor name validation
  // Only allows letters, spaces, apostrophes, and hyphens
  // This prevents script injection and special characters in names
  giverName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  // Email validation with automatic formatting
  giverEmail: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .toLowerCase()  // Always store emails in lowercase for consistency
    .trim(),        // Remove leading/trailing spaces
  
  // CHANGED: Phone number is now REQUIRED (not optional)
  // This is needed for OTP (One-Time Password) verification via SMS
  // Accepts Ghana phone formats: 0241234567, +233241234567, 233241234567
  giverPhone: z.string()
    .min(1, 'Phone number is required for payment verification')
    .regex(
      /^(0|\+?233)\d{9}$/, 
      'Please enter a valid Ghana phone number (e.g., 0241234567)'
    ),
  
  // Additional metadata (optional)
  metadata: z.object({
    note: z.string().max(500, 'Note must be less than 500 characters').optional(),
    source: z.string().optional()
  }).optional()
})

// Validation schema for contact form messages
// Ensures all contact form submissions are valid and safe
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
  
  // Message length: minimum 3 characters, maximum 5000 characters
  message: z.string()
    .min(3, 'Message must be at least 3 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .transform(val => sanitizeHtml(val))  // Clean HTML to prevent XSS attacks
})

// Security function: Removes potentially dangerous HTML characters
// This prevents Cross-Site Scripting (XSS) attacks
// XSS attacks try to inject malicious scripts through form inputs
// Example of what it blocks: <script>alert('hacked')</script>
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')     // Replace & with &amp;
    .replace(/</g, '&lt;')       // Replace < with &lt; (prevents HTML tags)
    .replace(/>/g, '&gt;')       // Replace > with &gt; (prevents HTML tags)
    .replace(/"/g, '&quot;')     // Replace " with &quot; (prevents attribute injection)
    .replace(/'/g, '&#x27;')     // Replace ' with &#x27; (prevents attribute injection)
    .replace(/\//g, '&#x2F;')    // Replace / with &#x2F; (prevents path manipulation)
}