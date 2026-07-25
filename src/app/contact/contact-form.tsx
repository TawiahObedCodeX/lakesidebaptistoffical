// components/contact-form.tsx (Alternative version with state-based floating labels)
"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";

// Define proper types for our component props
interface FloatFieldProps {
  name: string
  label: string
  type?: string
  required?: boolean
}

interface FloatAreaProps {
  name: string
  label: string
  required?: boolean
  rows?: number
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ===== SAME onSubmit FUNCTION AS ABOVE =====
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
      setError("First name is required and must be at least 2 characters.");
      setLoading(false);
      return;
    }
    
    if (!lastName || lastName.length < 2) {
      setError("Last name is required and must be at least 2 characters.");
      setLoading(false);
      return;
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    if (!message || message.length < 10) {
      setError("Your message must be at least 10 characters long. Please provide more details so we can assist you better.");
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
      setError("Unable to connect to the server. Please check your internet connection and try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
        <h4 className="text-2xl font-semibold text-slate-900 mb-3">Message Sent Successfully!</h4>
        <p className="text-slate-600 mb-8">Thank you for reaching out. Our team will respond to your message within 24 hours.</p>
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
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Please check the following:</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatField name="firstName" label="First Name *" required />
        <FloatField name="lastName" label="Last Name *" required />
      </div>

      <FloatField name="email" label="Email Address *" type="email" required />
      <FloatField name="phone" label="Phone Number (optional)" type="tel" />
      <FloatArea name="message" label="Your Message (min. 10 characters) *" required rows={5} />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Message...
          </>
        ) : (
          <>Send Message →</>
        )}
      </button>
    </form>
  );
}

// Reusable floating label input component
// Uses JavaScript state to track if input has value
function FloatField({ name, label, type = "text", required }: FloatFieldProps) {
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        id={name}
        type={type}
        required={required}
        placeholder=" "
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all duration-200"
      />
      <label 
        htmlFor={name}
        className={`absolute left-5 transition-all duration-200 pointer-events-none
          ${hasValue 
            ? 'top-1.5 text-xs text-amber-600 font-medium' 
            : 'top-5 text-base text-slate-500'
          }
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:font-medium
        `}
      >
        {label}
      </label>
    </div>
  );
}

// Reusable floating label textarea component
// Uses JavaScript state to track if textarea has value
function FloatArea({ name, label, required, rows = 5 }: FloatAreaProps) {
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <textarea
        name={name}
        id={name}
        required={required}
        rows={rows}
        placeholder=" "
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all duration-200 resize-none"
      />
      <label 
        htmlFor={name}
        className={`absolute left-5 transition-all duration-200 pointer-events-none
          ${hasValue 
            ? 'top-1.5 text-xs text-amber-600 font-medium' 
            : 'top-5 text-base text-slate-500'
          }
          peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:font-medium
        `}
      >
        {label}
      </label>
    </div>
  );
}