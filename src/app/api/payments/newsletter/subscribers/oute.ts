/**
 * app/api/newsletter/subscribers/route.ts
 * ──────────────────────────────────────────────────────────────
 * Admin-only proxy: gets the list of subscribers from the backend.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { env } from "@/lib/env";

interface ApiResponse {
  ok: boolean;
  error?: string;
  data?: {
    items: Array<{
      id: string;
      email: string;
      status: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export async function GET(req: Request): Promise<Response> {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { ok: false, error: "Authorization header required" } as const,
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "20";
    const status = url.searchParams.get("status") || "";

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/newsletter/subscribers?page=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ""}`;

    const res = await fetch(backendUrl, {
      headers: { Authorization: authHeader },
    });

    const data = (await res.json()) as ApiResponse;

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Failed to fetch subscribers" } as const,
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data.data,
    } as const);
  } catch (err: unknown) {
    console.error("[SUBSCRIBERS_GET] Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error occurred";
    return NextResponse.json(
      { ok: false, error: errorMessage } as const,
      { status: 500 }
    );
  }
}