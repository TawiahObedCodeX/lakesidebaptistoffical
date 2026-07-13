/**
 * app/admin/dashboard/page.tsx
 * ──────────────────────────────────────────────────────────────
 * Admin dashboard. Protected route - only accessible after login.
 * ──────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BodyClass } from "@/components/BodyClass";

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface Subscriber {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

interface Payment {
  id: string;
  reference: string;
  amountMinorUnits: number;
  currency: string;
  purpose: string;
  status: string;
  giverName: string | null;
  giverEmail: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"subscribers" | "payments" | "newsletter">("subscribers");

  const accessToken = typeof window !== "undefined" ? sessionStorage.getItem("adminAccessToken") : null;

  useEffect(() => {
    if (!accessToken) {
      router.push("/admin/login");
      return;
    }

    const userJson = sessionStorage.getItem("adminUser");
    if (userJson) {
      setAdmin(JSON.parse(userJson));
    }

    fetchData();
  }, [accessToken, router]);

  async function fetchData() {
    setLoading(true);
    try {
      await Promise.all([fetchSubscribers(), fetchPayments()]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSubscribers() {
    const res = await fetch("/api/newsletter/subscribers", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (data.ok) {
      setSubscribers(data.data?.items || []);
    }
  }

  async function fetchPayments() {
    const res = await fetch("/api/payments", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (data.ok) {
      setPayments(data.data?.items || []);
    }
  }

  async function sendNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newsletterSubject || !newsletterBody) return;

    setSending(true);
    setSendMessage(null);

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: newsletterSubject,
          bodyHtml: newsletterBody,
          accessToken,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }

      setSendMessage(`✅ Newsletter sent to ${data.data?.totalRecipients || 0} subscribers!`);
      setNewsletterSubject("");
      setNewsletterBody("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send newsletter";
      setSendMessage(`❌ ${errorMessage}`);
    } finally {
      setSending(false);
    }
  }

  function formatAmount(amountMinorUnits: number, currency: string): string {
    return `${currency} ${(amountMinorUnits / 100).toFixed(2)}`;
  }

  function getStatusBadge(status: string): string {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SUCCESS: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      ABANDONED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getPurposeBadge(purpose: string): string {
    const colors: Record<string, string> = {
      TITHE: "bg-purple-100 text-purple-800",
      OFFERING: "bg-blue-100 text-blue-800",
      DONATION: "bg-emerald-100 text-emerald-800",
      EVENT_TICKET: "bg-orange-100 text-orange-800",
    };
    return colors[purpose] || "bg-gray-100 text-gray-800";
  }

  async function handleLogout() {
    sessionStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("adminUser");
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-primary" />
      </main>
    );
  }

  return (
    <>
      <BodyClass className="admin-dashboard" />
      <main className="min-h-dvh bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              {admin && (
                <p className="text-sm text-slate-500">
                  Welcome, {admin.name} ({admin.email})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-2 border-b border-slate-200 mb-6">
            {[
              { key: "subscribers", label: "Subscribers" },
              { key: "payments", label: "Payments" },
              { key: "newsletter", label: "Send Newsletter" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subscribers Tab */}
          {activeTab === "subscribers" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                          No subscribers yet
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3">{sub.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sub.status)}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Purpose</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          No payments yet
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 font-mono text-xs">{payment.reference}</td>
                          <td className="px-4 py-3 font-medium">
                            {formatAmount(payment.amountMinorUnits, payment.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPurposeBadge(payment.purpose)}`}>
                              {payment.purpose}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === "newsletter" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {sendMessage && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${
                  sendMessage.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {sendMessage}
                </div>
              )}

              <form onSubmit={sendNewsletter} className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    maxLength={200}
                    value={newsletterSubject}
                    onChange={(e) => setNewsletterSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-0 outline-none transition-all"
                    placeholder="Weekly Announcements"
                  />
                  <p className="text-xs text-slate-400 mt-1">{newsletterSubject.length}/200</p>
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Body (HTML)
                  </label>
                  <textarea
                    id="body"
                    required
                    rows={8}
                    value={newsletterBody}
                    onChange={(e) => setNewsletterBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-accent focus:ring-0 outline-none transition-all font-mono text-sm"
                    placeholder="<p>Dear congregation...</p>"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Use HTML for formatting. Example: <code className="bg-slate-100 px-1 rounded">&lt;p&gt;Hello&lt;/p&gt;</code>
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={sending || !newsletterSubject || !newsletterBody}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark transition-all disabled:opacity-50 flex items-center gap-3"
                  >
                    {sending ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      `Send to ${subscribers.filter(s => s.status === "ACTIVE").length} Subscribers`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewsletterSubject("");
                      setNewsletterBody("");
                      setSendMessage(null);
                    }}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}