/**
 * app/api/newsletter/subscribe/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: the subscribe form on the website calls this,
 * which forwards to POST /api/v1/newsletter/subscribe on the
 * Church Backend API.
 *
 * The backend creates the subscriber record and queues a
 * confirmation email. The frontend never touches the database.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email } = schema.parse(json);

    console.log(`🔵 Newsletter subscribe proxy: forwarding ${email} to backend`);

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/newsletter/subscribe`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Backend subscription failed:", data);
      return NextResponse.json(
        {
          ok: false,
          error: data.message || "Subscription failed",
        },
        { status: res.status }
      );
    }

    console.log("✅ Subscription successful");

    return NextResponse.json({
      ok: true,
      message: data.message || "Please check your email to confirm your subscription",
      data: data.data,
    });
  } catch (err: any) {
    console.error("[NEWSLETTER_SUBSCRIBE] Error:", err);

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