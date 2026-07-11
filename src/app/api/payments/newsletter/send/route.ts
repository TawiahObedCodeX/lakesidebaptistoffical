/**
 * app/api/newsletter/send/route.ts
 * ──────────────────────────────────────────────────────────────
 * Admin-only proxy: forwards newsletter send requests to the
 * Church Backend API. The backend requires a valid JWT access
 * token, which this proxy passes through.
 *
 * The admin login token is obtained from POST /api/v1/auth/login
 * on the backend and stored in the browser's localStorage or
 * sessionStorage by the admin dashboard page.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const schema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  bodyHtml: z.string().min(1, "Email body is required"),
  accessToken: z.string().min(1, "Admin access token is required"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { subject, bodyHtml, accessToken } = schema.parse(json);

    console.log(`🔵 Newsletter send proxy: forwarding to backend`);

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/newsletter/send`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass the admin's access token to the backend so it can
        // verify they're authorized to send newsletters
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ subject, bodyHtml }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.message || "Failed to send newsletter" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.message || "Newsletter queued for sending",
      data: data.data,
    });
  } catch (err: any) {
    console.error("[NEWSLETTER_SEND] Error:", err);

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