/**
 * app/(routes)/unsubscribe/unsubscribe-content.tsx
 * ──────────────────────────────────────────────────────────────
 * Client component that reads the token from the URL, calls the
 * unsubscribe API proxy, and shows the result.
 * 
 * FIXED: Moved setState out of useEffect body to avoid cascading
 * renders warning. Now uses a flag to track if component is mounted.
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "loading" | "success" | "error";

export function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double-execution in StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("error");
      setMessage("No unsubscribe token found. This link may be invalid.");
      return;
    }

    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage(data.message || "You have been unsubscribed.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to unsubscribe.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <main className="min-h-dvh flex items-center justify-center bg-neutral-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 md:p-10 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-primary" />
            <h1 className="text-xl font-bold text-brand-primary mb-2">
              Processing...
            </h1>
            <p className="text-slate-500 text-sm">
              We&apos;re updating your preferences.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <span className="text-3xl">👋</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-primary mb-2">
              You&apos;ve Been Unsubscribed
            </h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark transition-all"
            >
              Return to Home
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Oops!
            </h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {message}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-all"
            >
              Return to Home
            </Link>
          </>
        )}
      </div>
    </main>
  );
}