/**
 * app/api/payments/initialize/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: receives payment details from the donation form,
 * forwards them to the Church Backend API, returns the Paystack
 * authorization URL to the frontend.
 * 
 * FIXED: Proper TypeScript types, no 'any' usage
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// Type definitions
type PaymentPurpose = "TITHE" | "OFFERING" | "DONATION" | "EVENT_TICKET";
type PaymentMetadata = Record<string, unknown>;

interface PaymentRequestBody {
  amount: number;
  purpose: PaymentPurpose;
  giverName: string;
  giverEmail: string;
  currency?: string;
  metadata?: PaymentMetadata;
}

interface ApiResponse {
  ok: boolean;
  authorization_url?: string;
  reference?: string;
  error?: string;
  message?: string;
  data?: {
    authorizationUrl: string;
    reference: string;
  };
}

// Zod schema with proper types
const schema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  purpose: z
    .enum(["TITHE", "OFFERING", "DONATION", "EVENT_TICKET"])
    .default("DONATION"),
  giverName: z.string().trim().min(1, "Name is required").max(120),
  giverEmail: z.string().email("Valid email is required"),
  currency: z.string().length(3).default("GHS"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type SchemaType = z.infer<typeof schema>;

interface ZodError extends Error {
  issues?: Array<{ message: string }>;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const json: unknown = await req.json();
    const body = schema.parse(json) as SchemaType;

    console.log("🔵 Payment initialize proxy → forwarding to backend", {
      amount: body.amount,
      purpose: body.purpose,
    });

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/payments/initiate`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as ApiResponse;

    if (!res.ok) {
      console.error("❌ Backend payment initiation failed:", data);
      return NextResponse.json(
        {
          ok: false,
          error: data.message || "Payment initialization failed",
        } as const,
        { status: res.status }
      );
    }

    console.log("✅ Backend returned authorization URL");

    return NextResponse.json({
      ok: true,
      authorization_url: data.data?.authorizationUrl,
      reference: data.data?.reference,
    } as const);
  } catch (err: unknown) {
    console.error("[PAYMENTS_INITIALIZE] Error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.issues.map((e: { message: string }) => e.message).join(", "),
        } as const,
        { status: 400 }
      );
    }

    const errorMessage = err instanceof Error ? err.message : "Server error occurred";
    return NextResponse.json(
      { ok: false, error: errorMessage } as const,
      { status: 500 }
    );
  }
}