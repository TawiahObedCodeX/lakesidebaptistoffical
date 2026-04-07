import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BASE_URL: z.string().url().optional().default("http://localhost:3000"),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default(""),
  PAYSTACK_SECRET_KEY: z.string().min(10, "Paystack secret key is required"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Please check your .env.local file.");
}

export const env = parsed.data;