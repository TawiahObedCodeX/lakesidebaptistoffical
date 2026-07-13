/**
 * app/api/payments/route.ts
 * ──────────────────────────────────────────────────────────────
 * Admin-only proxy: gets the list of payments from the backend.
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
      reference: string;
      amountMinorUnits: number;
      currency: string;
      purpose: string;
      status: string;
      giverName: string | null;
      giverEmail: string | null;
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
    const purpose = url.searchParams.get("purpose") || "";

    let backendUrl = `${env.BACKEND_API_URL}/api/v1/payments?page=${page}&pageSize=${pageSize}`;
    if (status) backendUrl += `&status=${status}`;
    if (purpose) backendUrl += `&purpose=${purpose}`;

    const res = await fetch(backendUrl, {
      headers: { Authorization: authHeader },
    });

    const data = (await res.json()) as ApiResponse;

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Failed to fetch payments" } as const,
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data.data,
    } as const);
  } catch (err: unknown) {
    console.error("[PAYMENTS_GET] Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error occurred";
    return NextResponse.json(
      { ok: false, error: errorMessage } as const,
      { status: 500 }
    );
  }
}