/**
 * app/api/payments/initialize/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: receives payment details from the donation form,
 * forwards them to the Church Backend API, returns the Paystack
 * authorization URL to the frontend.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const schema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  purpose: z
    .enum(["TITHE", "OFFERING", "DONATION", "EVENT_TICKET"])
    .default("DONATION"),
  giverName: z.string().trim().min(1, "Name is required").max(120),
  giverEmail: z.string().email("Valid email is required"),
  currency: z.string().length(3).default("GHS"),
  // z.record(keySchema, valueSchema) — required in Zod 3.23+
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

    // FIXED: Zod 3.23+ uses `err.issues` not `err.errors`
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.issues.map((e) => e.message).join(", "),
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