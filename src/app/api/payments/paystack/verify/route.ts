/**
 * app/api/payments/paystack/verify/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: the thank-you page calls this with the Paystack
 * reference from the URL. This forwards to the Church Backend API,
 * which verifies with Paystack, updates the Payment record, and
 * queues a receipt email.
 *
 * The backend has the Paystack SECRET key — the frontend never
 * touches it.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const schema = z.object({
  reference: z.string().min(1, "Reference is required"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { reference } = schema.parse(json);

    console.log(`🔵 Verify proxy: forwarding reference "${reference}" to backend`);

    // Forward to the Church Backend API
    const backendUrl = `${env.BACKEND_API_URL}/api/v1/payments/verify-from-frontend`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Backend verification failed:", data);
      return NextResponse.json(
        {
          ok: false,
          error: data.message || "Verification failed",
        },
        { status: res.status }
      );
    }

    console.log("✅ Verification successful");

    return NextResponse.json({
      ok: true,
      message: data.message || "Payment verified",
      data: data.data,
    });
  } catch (err: any) {
    console.error("[VERIFY_PROXY] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}