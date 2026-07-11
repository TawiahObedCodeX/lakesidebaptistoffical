/**
 * app/(routes)/admin/newsletter/page.tsx
 * ──────────────────────────────────────────────────────────────
 * HIDDEN ADMIN PAGE — not linked from the public website.
 * Church staff navigate directly to /admin/newsletter to send
 * newsletters. They must log in with their admin credentials
 * (the same ones seeded in the backend).
 *
 * ACCESS:
 *   https://yourchurch.org/admin/newsletter
 *
 * SECURITY:
 *   - No link exists on the public site to this page
 *   - Requires valid admin credentials from the backend
 *   - JWT token stored only in React state (memory), not
 *     localStorage or cookies — cleared on logout or page close
 *   - Login calls the backend directly; the backend verifies
 *     credentials and returns a short-lived access token
 *
 * DEFAULT CREDENTIALS (CHANGE AFTER FIRST LOGIN):
 *   Email:    admin@church.org
 *   Password: Admin123!@#
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { env } from "@/lib/env";

export default function AdminNewsletterPage() {
  // ── Login state ──────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Newsletter compose state ─────────────────────────────
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [sendStatus, setSendStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [sendMessage, setSendMessage] = useState("");

  // ── Handle admin login ───────────────────────────────────
  // Calls POST /api/v1/auth/login on the Church Backend API
  // directly. The backend verifies email + password (using
  // Argon2id hash comparison) and returns a short-lived JWT
  // access token. The token is stored ONLY in React state
  // (memory) — never persisted to disk, never in cookies.
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      // Call the backend directly — no proxy needed because
      // this is a client-side call and the backend allows CORS
      // from the frontend's origin.
      const res = await fetch(
        `${env.BACKEND_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Store the access token in state only. When the user
      // navigates away or closes the tab, the token is gone
      // and they must log in again.
      setAccessToken(data.data.accessToken);
      setLoginError("");
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Handle newsletter send ───────────────────────────────
  // Sends the subject + bodyHtml + accessToken to the proxy
  // endpoint /api/newsletter/send, which forwards everything
  // to the Church Backend API with the Authorization header.
  async function handleSendNewsletter(e: React.FormEvent) {
    e.preventDefault();

    if (!accessToken) {
      setSendStatus("error");
      setSendMessage("You must be logged in to send newsletters.");
      return;
    }

    if (!subject.trim() || !bodyHtml.trim()) {
      setSendStatus("error");
      setSendMessage("Subject and body are required.");
      return;
    }

    setSendStatus("loading");
    setSendMessage("");

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, bodyHtml, accessToken }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }

      setSendStatus("success");
      setSendMessage(
        `✅ ${data.message || "Newsletter queued!"} (${
          data.data?.totalRecipients || 0
        } recipients)`
      );
      // Clear the form on success so the admin can write another
      setSubject("");
      setBodyHtml("");
    } catch (err: any) {
      setSendStatus("error");
      setSendMessage(err.message || "Something went wrong.");
    }
  }

  // ── Handle logout ────────────────────────────────────────
  // Simply clears the token from state. No server call needed
  // because the access token is short-lived (15 minutes) and
  // will expire on its own. Clearing state just means the admin
  // sees the login form immediately instead of waiting for
  // the token to expire and getting an error.
  function handleLogout() {
    setAccessToken(null);
    setEmail("");
    setPassword("");
  }

  // ── NOT LOGGED IN: show login form ───────────────────────
  if (!accessToken) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-neutral-100 p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">🔐</span>
            <h1 className="text-xl font-bold text-brand-primary">
              Church Admin
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to send newsletters to subscribers
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@church.org"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-accent outline-none text-sm transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-accent outline-none text-sm transition-colors"
              />
            </div>

            {/* Error message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[10px] text-slate-400 text-center mt-6">
            Authorized church staff only • Credentials managed by the backend
          </p>
        </div>
      </main>
    );
  }

  // ── LOGGED IN: show newsletter composer ──────────────────
  return (
    <main className="min-h-dvh bg-neutral-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with logout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">
              📧 Send Newsletter
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Compose your message and send it to all active subscribers
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Composer card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSendNewsletter} className="space-y-6">
            {/* Subject */}
            <div>
              <label
                htmlFor="newsletter-subject"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Subject Line
              </label>
              <input
                id="newsletter-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Weekly Announcements — July 14, 2026"
                required
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-accent outline-none text-sm transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">
                {subject.length}/200 characters
              </p>
            </div>

            {/* Body */}
            <div>
              <label
                htmlFor="newsletter-body"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Body (HTML)
              </label>
              <textarea
                id="newsletter-body"
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder="<h2>Hello Church Family!</h2><p>Here are this week's announcements...</p>"
                required
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-accent outline-none text-sm font-mono resize-y transition-colors"
              />
              <p className="text-xs text-slate-400 mt-1">
                You can use HTML tags for formatting (e.g.,{" "}
                <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>,{" "}
                <code>&lt;strong&gt;</code>)
              </p>
            </div>

            {/* Status messages */}
            {sendStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                {sendMessage}
              </div>
            )}
            {sendStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {sendMessage}
              </div>
            )}

            {/* Send button */}
            <button
              type="submit"
              disabled={sendStatus === "loading"}
              className="w-full py-4 rounded-xl bg-brand-accent text-brand-primary font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendStatus === "loading" ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary/30 border-t-brand-primary" />
                  Queuing emails...
                </>
              ) : (
                "📨 Send to All Subscribers"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}