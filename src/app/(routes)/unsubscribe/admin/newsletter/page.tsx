/**
 * app/admin/newsletter/page.tsx
 * ──────────────────────────────────────────────────────────────
 * HIDDEN ADMIN PAGE — accessible only to church staff who know
 * the URL. No link exists on the public website.
 *
 * ACCESS:
 *   https://yourchurch.org/admin/newsletter
 *
 * CREDENTIALS (change after first login):
 *   Email:    admin@church.org
 *   Password: Admin123!@#
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { env } from "@/lib/env";

export default function AdminNewsletterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [sendMessage, setSendMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${env.BACKEND_API_URL}/api/v1/auth/login`, {
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
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSendNewsletter(e: React.FormEvent) {
    e.preventDefault();

    if (!accessToken) {
      setSendStatus("error");
      setSendMessage("You must be logged in.");
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
      setSendMessage(`✅ ${data.message || "Newsletter queued!"} (${data.data?.totalRecipients || 0} recipients)`);
      setSubject("");
      setBodyHtml("");
    } catch (err: any) {
      setSendStatus("error");
      setSendMessage(err.message || "Something went wrong.");
    }
  }

  function handleLogout() {
    setAccessToken(null);
    setEmail("");
    setPassword("");
  }

  if (!accessToken) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-4xl block mb-3">🔐</span>
            <h1 className="text-xl font-bold text-gray-800">Church Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to send newsletters</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@church.org"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none text-sm"
            />

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📧 Send Newsletter</h1>
            <p className="text-sm text-gray-500 mt-1">Compose and send to all active subscribers</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSendNewsletter} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Weekly Announcements"
                required
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Body (HTML)</label>
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder="<h2>Hello Church Family!</h2><p>Announcements...</p>"
                required
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-mono resize-y"
              />
            </div>

            {sendStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">{sendMessage}</div>
            )}
            {sendStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{sendMessage}</div>
            )}

            <button
              type="submit"
              disabled={sendStatus === "loading"}
              className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {sendStatus === "loading" ? "Queuing..." : "📨 Send to All Subscribers"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}