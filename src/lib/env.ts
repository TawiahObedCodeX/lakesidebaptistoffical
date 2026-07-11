/**
 * lib/env.ts
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for ALL environment variables used in
 * the Next.js frontend. Validated at import time so missing
 * variables cause a clear error at build/startup, not a confusing
 * runtime crash buried in a page component.
 *
 * WHAT LIVES HERE VS THE BACKEND:
 *   FRONTEND (.env.local)   → BACKEND (.env)
 *   ─────────────────────────────────────────
 *   Public Paystack key     → Secret Paystack key
 *   Backend API URL         → Database URL, Redis URL
 *   Admin access key        → JWT secrets, SMTP credentials
 *
 * The frontend NEVER stores secrets. Every sensitive operation
 * (payment processing, email sending, database writes) goes
 * through the Church Backend API.
 * ──────────────────────────────────────────────────────────────
 */

import { z } from "zod";

const envSchema = z.object({
  // ── Environment ────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // ── URLs ────────────────────────────────────────────────────
  // The public URL of this Next.js frontend (used for callback URLs,
  // unsubscribe links in emails, etc.)
  BASE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000"),

  // The URL where the Church Backend API is running. Every API
  // proxy route forwards requests here. In production this would
  // be https://api.yourchurch.org.
  BACKEND_API_URL: z
    .string()
    .url()
    .default("http://localhost:5000"),

  // ── Paystack ────────────────────────────────────────────────
  // ONLY the PUBLIC key lives here — it's safe to expose in the
  // browser because the Paystack Inline JS SDK needs it to open
  // the payment popup. The SECRET key lives ONLY in the backend's
  // .env file and is never seen by the frontend.
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z
    .string()
    .min(1, "Paystack public key is required — set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.local"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error(
    "Invalid environment variables. Please check your .env.local file."
  );
}

export const env = parsed.data;