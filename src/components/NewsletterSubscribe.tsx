/**
 * components/NewsletterSubscribe.tsx
 * ──────────────────────────────────────────────────────────────
 * A reusable newsletter subscribe form. Drop this into any page
 * or the footer to let visitors subscribe to church newsletters.
 *
 * HOW IT WORKS:
 *   1. User enters their email
 *   2. Form calls POST /api/newsletter/subscribe (proxy)
 *   3. Proxy forwards to Church Backend API
 *   4. Backend creates subscriber + queues confirmation email
 *   5. User sees a success message telling them to check email
 *
 * The user MUST click the confirmation link in their email before
 * they start receiving newsletters. This prevents spam sign-ups.
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";

type Props = {
  /** Optional className for the outer container */
  className?: string;
  /** Visual variant: "inline" for footer, "card" for a dedicated page */
  variant?: "inline" | "card";
};

export function NewsletterSubscribe({ className = "", variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic client-side validation
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message || "Check your email to confirm your subscription!");
      setEmail(""); // Clear the input on success
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to subscribe. Please try again.");
    }
  }

  // ── Card variant (for a dedicated newsletter page) ──────────
  if (variant === "card") {
    return (
      <div className={`rounded-2xl bg-white p-8 shadow-lg border border-neutral-100 ${className}`}>
        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">📬</span>
          <h3 className="text-2xl font-bold text-brand-primary">Stay Connected</h3>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Subscribe to receive church announcements, event updates, and
            weekly inspiration directly in your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === "loading"}
              className="w-full px-5 py-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-accent outline-none transition-all text-sm disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Newsletter"
            )}
          </button>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              ✅ {message}
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              ❌ {message}
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </form>
      </div>
    );
  }

  // ── Inline variant (for footer) ─────────────────────────────
  return (
    <div className={className}>
      {status === "success" ? (
        <div className="text-sm text-green-400 font-medium">
          ✅ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading"}
            className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/40 text-sm outline-none focus:border-brand-accent transition-colors disabled:opacity-50 flex-1 min-w-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2.5 rounded-lg bg-blue-900 text-white border border-white font-bold text-lg hover:bg-white hover:text-black  transition-all  whitespace-nowrap"
          >
            {status === "loading" ? "Sending..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">{message}</p>
      )}
    </div>
  );
}