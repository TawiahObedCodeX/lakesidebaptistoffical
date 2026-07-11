/**
 * app/admin/newsletter/page.tsx
 * ──────────────────────────────────────────────────────────────
 * HIDDEN ADMIN PAGE — not linked anywhere on the public website.
 * Only church staff who know this URL can access it.
 *
 * WHERE TO FIND IT AFTER DEPLOY:
 *   https://yourdomain.vercel.app/admin/newsletter
 *
 * DEFAULT LOGIN (change after first login):
 *   Email:    admin@church.org
 *   Password: Admin123!@#
 *
 * HOW IT WORKS:
 *   1. Staff visits /admin/newsletter (no link exists publicly)
 *   2. They log in with backend admin credentials
 *   3. Backend returns a JWT access token
 *   4. Staff composes a newsletter and clicks Send
 *   5. The backend queues emails to ALL active subscribers
 *   6. The worker process sends them one by one
 *
 * END USERS WILL NEVER SEE THIS PAGE because:
 *   - No link exists in the navigation, footer, or any page
 *   - The URL is not guessable (no sitemap entry)
 *   - Requires valid admin credentials from the backend
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";

// ── BACKEND URL ────────────────────────────────────────────
// CHANGE THIS to your deployed backend URL.
// This is hardcoded to avoid build issues with env variables.
// In production, replace with: https://api.yourchurch.org
const BACKEND_URL = "https://lbc-backend-production.up.railway.app";

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
  // Calls the backend directly to verify credentials.
  // On success, stores the JWT access token in memory (state).
  // The token is never saved to disk, localStorage, or cookies.
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      setAccessToken(data.data.accessToken);
    } catch (err: any) {
      setLoginError(err.message || "Invalid email or password");
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Handle newsletter send ───────────────────────────────
  // Sends subject + bodyHtml + accessToken to the backend.
  // The backend queues one email per active subscriber.
  async function handleSendNewsletter(e: React.FormEvent) {
    e.preventDefault();

    if (!accessToken) {
      setSendStatus("error");
      setSendMessage("You must be logged in to send newsletters.");
      return;
    }

    if (!subject.trim() || !bodyHtml.trim()) {
      setSendStatus("error");
      setSendMessage("Please enter both a subject and email body.");
      return;
    }

    setSendStatus("loading");
    setSendMessage("");

    try {
      // Call the backend directly with the admin's access token
      const res = await fetch(`${BACKEND_URL}/api/v1/newsletter/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ subject, bodyHtml }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to send newsletter");
      }

      setSendStatus("success");
      setSendMessage(
        `✅ Newsletter queued! Sending to ${data.data?.totalRecipients || 0} subscribers.`
      );
      // Clear form so admin can compose another
      setSubject("");
      setBodyHtml("");
    } catch (err: any) {
      setSendStatus("error");
      setSendMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  // ── Handle logout ────────────────────────────────────────
  // Simply clears the token from memory. The backend access
  // token expires in 15 minutes anyway.
  function handleLogout() {
    setAccessToken(null);
    setEmail("");
    setPassword("");
    setSendStatus("idle");
    setSendMessage("");
  }

  // ──────────────────────────────────────────────────────────
  // NOT LOGGED IN — show login form
  // ──────────────────────────────────────────────────────────
  if (!accessToken) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">🔐</span>
            <h1 className="text-xl font-bold text-gray-800">
              Church Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to send newsletters to subscribers
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@church.org"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
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
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Footer */}
          <p className="text-[10px] text-gray-400 text-center mt-6">
            Authorized church staff only
          </p>
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────
  // LOGGED IN — show newsletter composer
  // ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📧 Send Newsletter
            </h1>
            <p className="text-sm text-gray-500 mt-1">
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
                htmlFor="subject"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Subject Line
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Weekly Announcements — July 14, 2026"
                required
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                {subject.length}/200 characters
              </p>
            </div>

            {/* Body */}
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Body (HTML)
              </label>
              <textarea
                id="body"
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder="<h2>Hello Church Family!</h2><p>Here are this week's announcements...</p>"
                required
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-mono resize-y transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                You can use HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;
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
              className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendStatus === "loading" ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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