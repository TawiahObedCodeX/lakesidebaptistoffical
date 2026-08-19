// src/app/contact/contact-form.tsx
"use client";

import { useState } from "react";

function Alert({ children, kind = "error" }: { children: React.ReactNode; kind?: "error" | "success" | "info" }) {
  const colors = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-amber-50 border-amber-200 text-amber-800",
  };
  return (
    <div className={`${colors[kind]} rounded-2xl border px-5 py-4 text-sm`}>
      {children}
    </div>
  );
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!firstName || firstName.length < 2) {
      setError("Please enter your first name (at least 2 characters).");
      setLoading(false);
      return;
    }

    if (!lastName || lastName.length < 2) {
      setError("Please enter your last name (at least 2 characters).");
      setLoading(false);
      return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!message || message.length < 3) {
      setError("Please enter a message with at least 3 characters.");
      setLoading(false);
      return;
    }

    // Check word count (200 words max)
    const words = message.split(/\s+/).length;
    if (words > 200) {
      setError(`Your message is ${words} words. Please reduce it to 200 words or less.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone: phone || null, message }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Failed to send message. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Unable to connect to the server. Please check your internet connection.");
      setLoading(false);
    }
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setMessageLength(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
        <h4 className="text-2xl font-semibold text-slate-900 mb-3">Message Sent Successfully!</h4>
        <p className="text-slate-600 mb-8">Thank you for reaching out. We will respond within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-6" noValidate>
      {error && (
        <Alert kind="error">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-sm">{error}</p>
          </div>
        </Alert>
      )}

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
        <input id="firstName" name="firstName" type="text" required placeholder="Enter your first name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition" />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
        <input id="lastName" name="lastName" type="text" required placeholder="Enter your last name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
        <input id="email" name="email" type="email" required placeholder="your@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-slate-400">(optional)</span></label>
        <input id="phone" name="phone" type="tel" placeholder="+233 24 123 4567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="message" 
          name="message" 
          required 
          rows={5} 
          placeholder="Tell us how we can help you... (max 200 words)"
          onChange={handleMessageChange}
          maxLength={2000}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none" 
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs ${wordCount > 200 ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
            {wordCount}/200 words
          </span>
          {wordCount > 200 && (
            <span className="text-xs text-red-600 font-semibold">
              Please reduce to 200 words or less
            </span>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || wordCount > 200} 
        className="w-full py-4 bg-black hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
      >
        {loading ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}