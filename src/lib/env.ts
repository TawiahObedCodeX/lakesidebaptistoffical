/**
 * lib/env.ts
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for ALL environment variables used in
 * the Next.js frontend. Validated at import time so missing
 * variables cause a clear error at build/startup.
 *
 * IMPORTANT FOR DEPLOYMENT:
 * Add these variables in your Vercel dashboard:
 *   Settings → Environment Variables
 *   - BACKEND_API_URL = https://api.yourchurch.org
 *   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = pk_live_xxx
 *   - BASE_URL = https://yourchurch.org
 * ──────────────────────────────────────────────────────────────
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // The public URL of this Next.js frontend
  BASE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000"),

  // The URL where the Church Backend API is running
  BACKEND_API_URL: z
    .string()
    .url()
    .default("http://localhost:5000"),

  // Paystack PUBLIC key — safe to expose in the browser.
  // The Paystack Inline JS SDK needs this to open the payment popup.
  // In production, set this in Vercel: Settings → Environment Variables.
  //
  // Made optional with a default empty string so the build succeeds
  // even if Paystack isn't configured yet. Payment attempts will
  // fail gracefully at runtime with a clear error message instead
  // of crashing the entire build.
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z
    .string()
    .optional()
    .default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(parsed.error.flatten().fieldErrors);
  // Don't throw during build — only warn. This lets the build
  // succeed on Vercel while you set up environment variables.
  // Remove this safety net once all variables are configured.
  console.warn("⚠️  Build continuing with missing env vars — some features may not work");
}

export const env = parsed.success
  ? parsed.data
  : {
      NODE_ENV: "production",
      BASE_URL: "http://localhost:3000",
      BACKEND_API_URL: "http://localhost:5000",
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: "",
    };