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

/**
 * Validation schema — matches what the Church Backend API expects
 * at POST /api/v1/payments/initiate.
 *
 * NOTE: z.record() requires TWO arguments in Zod 3.23+:
 *   z.record(keySchema, valueSchema)
 * We use z.record(z.string(), z.any()) to accept any object with
 * string keys and any values (the metadata field is free-form).
 */
const schema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  purpose: z
    .enum(["TITHE", "OFFERING", "DONATION", "EVENT_TICKET"])
    .default("DONATION"),
  giverName: z.string().trim().min(1, "Name is required").max(120),
  giverEmail: z.string().email("Valid email is required"),
  currency: z.string().length(3).default("GHS"),
  // FIXED: z.record() now takes 2 arguments — key schema and value schema.
  // z.record(z.string(), z.any()) means "an object with string keys and any values".
  // This is the same as the old z.record(z.any()) but matches Zod 3.23+ API.
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.parse(json);

    console.log("🔵 Payment initialize proxy → forwarding to backend", {
      amount: body.amount,
      purpose: body.purpose,
    });

    // Forward the request to the Church Backend API.
    // The backend has the Paystack SECRET key and handles everything.
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

    // Return validation errors as 400 so the frontend can show
    // a helpful message to the user.
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}