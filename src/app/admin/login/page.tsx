/**
 * app/admin/login/page.tsx
 * ──────────────────────────────────────────────────────────────
 * Admin login page. This is a separate route that only admins
 * will use. End users won't see this unless they navigate to
 * /admin/login.
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BodyClass } from "@/components/BodyClass";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store access token in memory (or sessionStorage)
      sessionStorage.setItem("adminAccessToken", data.data.accessToken);
      sessionStorage.setItem("adminUser", JSON.stringify(data.data.admin));

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid credentials";
      setError(errorMessage);
      setLoading(false);
    }
  }

  return (
    <>
      <BodyClass className="admin-login-page" />
      <main className="min-h-dvh flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-0 outline-none transition-all"
                placeholder="admin@church.org"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-0 outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>Default admin: admin@church.org / Admin123!</p>
            <p className="mt-1">⚠️ Change this password in production!</p>
          </div>
        </div>
      </main>
    </>
  );
}