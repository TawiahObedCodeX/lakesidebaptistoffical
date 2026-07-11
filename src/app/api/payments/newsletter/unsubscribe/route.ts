/**
 * app/api/newsletter/unsubscribe/route.ts
 * ──────────────────────────────────────────────────────────────
 * Thin proxy: the unsubscribe page calls this with the token
 * from the email link, which forwards to the Church Backend API.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const schema = z.object({
  token: z.string().min(1, "Unsubscribe token is required"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { token } = schema.parse(json);

    console.log(`🔵 Unsubscribe proxy: forwarding token to backend`);

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/newsletter/unsubscribe`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.message || "Unsubscribe failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.message || "You have been unsubscribed successfully",
    });
  } catch (err: any) {
    console.error("[NEWSLETTER_UNSUBSCRIBE] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}