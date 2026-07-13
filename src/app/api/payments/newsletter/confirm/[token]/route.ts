/**
 * app/api/newsletter/confirm/[token]/route.ts
 * ──────────────────────────────────────────────────────────────
 * Proxies the confirmation link to the backend.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { env } from "@/lib/env";

interface ApiResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
): Promise<Response> {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Confirmation token is required" } as const,
        { status: 400 }
      );
    }

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/newsletter/confirm/${encodeURIComponent(token)}`;

    const res = await fetch(backendUrl);

    const data = (await res.json()) as ApiResponse;

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Confirmation failed" } as const,
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.message || "Email confirmed successfully!",
    } as const);
  } catch (err: unknown) {
    console.error("[CONFIRM_GET] Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error occurred";
    return NextResponse.json(
      { ok: false, error: errorMessage } as const,
      { status: 500 }
    );
  }
}