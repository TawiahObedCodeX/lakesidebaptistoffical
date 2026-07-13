"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, message }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setError(data?.error || "Failed to send message. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <h4 className="text-2xl font-semibold text-slate-900 mb-3">
          Message Sent!
        </h4>
        <p className="text-slate-600 mb-8">
          Thank you. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-6" noValidate>
      {error && <Alert kind="error">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatField name="firstName" label="First Name" required />
        <FloatField name="lastName" label="Last Name" required />
      </div>

      <FloatField name="email" label="Email Address" type="email" required />
      <FloatField name="phone" label="Phone Number (optional)" type="tel" />

      <FloatArea name="message" label="Your Message" required rows={5} />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black hover:bg-blue-700 disabled:bg-black text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
      >
        {loading ? <>Sending Message...</> : <>Send Message →</>}
      </button>
    </form>
  );
}

/* Reusable Floating Fields */
function FloatField({ name, label, type = "text", required }: any) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-amber-200 outline-none transition"
      />
      <label className="absolute left-5 top-5 text-slate-500 peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amber-600 transition-all pointer-events-none">
        {label}
      </label>
    </div>
  );
}

function FloatArea({ name, label, required, rows = 5 }: any) {
  return (
    <div className="relative">
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder=" "
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-amber-200 outline-none transition resize-none"
      />
      <label className="absolute left-5 top-5 text-slate-500 peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amber-600 transition-all pointer-events-none">
        {label}
      </label>
    </div>
  );
}
