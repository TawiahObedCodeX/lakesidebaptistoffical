/**
 * app/api/auth/login/route.ts
 * ──────────────────────────────────────────────────────────────
 * Admin login proxy. Forwards credentials to the Church Backend
 * API and returns the access token + sets the refresh cookie.
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  ok: boolean;
  error?: string;
  data?: {
    accessToken: string;
    admin: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const schema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

type SchemaType = z.infer<typeof schema>;

export async function POST(req: Request): Promise<Response> {
  try {
    const json: unknown = await req.json();
    const { email, password } = schema.parse(json) as SchemaType;

    console.log("🔵 Admin login proxy: forwarding to backend");

    const backendUrl = `${env.BACKEND_API_URL}/api/v1/auth/login`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as LoginResponse;

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Login failed" } as const,
        { status: res.status }
      );
    }

    // Extract the refresh token from the Set-Cookie header
    const setCookie = res.headers.get("set-cookie");
    const refreshTokenMatch = setCookie?.match(/refreshToken=([^;]+)/);

    return NextResponse.json({
      ok: true,
      message: "Login successful",
      data: {
        accessToken: data.data?.accessToken,
        admin: data.data?.admin,
        refreshToken: refreshTokenMatch?.[1] || null,
      },
    } as const);
  } catch (err: unknown) {
    console.error("[ADMIN_LOGIN] Error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.issues.map((e: { message: string }) => e.message).join(", "),
        } as const,
        { status: 400 }
      );
    }

    const errorMessage = err instanceof Error ? err.message : "Server error occurred";
    return NextResponse.json(
      { ok: false, error: errorMessage } as const,
      { status: 500 }
    );
  }
}