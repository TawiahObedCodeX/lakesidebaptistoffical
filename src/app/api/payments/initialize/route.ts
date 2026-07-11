/**
 * app/api/payments/initialize/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: receives payment details from the donation form,
 * forwards them to the Church Backend API, returns the Paystack
 * authorization URL to the frontend.
 *
 * This file is a Next.js API route (runs on the server), so it
 * CAN safely communicate with the backend. The backend handles
 * all Paystack communication and database operations.
 *
 * FLOW:
 *   1. Donation form collects: amount, purpose, name, email
 *   2. Form POSTs to /api/payments/initialize (this file)
 *   3. This file forwards to POST {BACKEND_URL}/api/v1/payments/initiate
 *   4. Backend creates Payment record + calls Paystack
 *   5. Backend returns { authorizationUrl, reference }
 *   6. Frontend redirects user to authorizationUrl
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// Validation schema — the same shape the backend expects
const schema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  purpose: z
    .enum(["TITHE", "OFFERING", "DONATION", "EVENT_TICKET"])
    .default("DONATION"),
  giverName: z.string().trim().min(1, "Name is required").max(120),
  giverEmail: z.string().email("Valid email is required"),
  currency: z.string().length(3).default("GHS"),
  metadata: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.parse(json);

    console.log("🔵 Payment initialize proxy → forwarding to backend", {
      amount: body.amount,
      purpose: body.purpose,
    });

    // Forward the request to the Church Backend API
    // The backend has the Paystack SECRET key and handles everything
    const backendUrl = `${env.BACKEND_API_URL}/api/v1/payments/initiate`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Backend payment initiation failed:", data);
      return NextResponse.json(
        {
          ok: false,
          error: data.message || "Payment initialization failed",
        },
        { status: res.status }
      );
    }

    console.log("✅ Backend returned authorization URL");

    return NextResponse.json({
      ok: true,
      authorization_url: data.data.authorizationUrl,
      reference: data.data.reference,
    });
  } catch (err: any) {
    console.error("[PAYMENTS_INITIALIZE] Error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: err.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}