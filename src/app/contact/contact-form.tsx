// components/contact-form.tsx
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

  // This function runs when the form is submitted
  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Get all the form values and clean them up
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    // ===== CLIENT-SIDE VALIDATION =====
    // This validates the form BEFORE sending to the server
    // It gives users immediate feedback without waiting for server response
    
    // Validate first name
    if (!firstName || firstName.length < 2) {
      setError("First name is required and must be at least 2 characters.");
      setLoading(false);
      return;
    }
    
    // Validate last name
    if (!lastName || lastName.length < 2) {
      setError("Last name is required and must be at least 2 characters.");
      setLoading(false);
      return;
    }
    
    // Validate email format
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    // Validate message length (minimum 10 characters)
    // This matches the server validation requirement
    if (!message || message.length < 10) {
      setError("Your message must be at least 10 characters long. Please provide more details so we can assist you better.");
      setLoading(false);
      return;
    }

    // Send the message to our backend API
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          phone: phone || null, // Send null instead of empty string
          message 
        }),
      });

      const data = await res.json().catch(() => null);
      
      // Check if the submission was successful
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Failed to send message. Please try again.");
        setLoading(false);
        return;
      }

      // Success! Show the success message
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Unable to connect to the server. Please check your internet connection and try again.");
      setLoading(false);
    }
  }

  // If the form was submitted successfully, show a thank you message
  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <h4 className="text-2xl font-semibold text-slate-900 mb-3">
          Message Sent Successfully!
        </h4>
        <p className="text-slate-600 mb-8">
          Thank you for reaching out. Our team will respond to your message within 24 hours.
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

  // The actual contact form
  return (
    <form action={onSubmit} className="space-y-6" noValidate>
      {/* Show error message if validation fails */}
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

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatField name="firstName" label="First Name *" required />
        <FloatField name="lastName" label="Last Name *" required />
      </div>

      {/* Contact fields */}
      <FloatField name="email" label="Email Address *" type="email" required />
      <FloatField name="phone" label="Phone Number (optional)" type="tel" />

      {/* Message field */}
      <FloatArea name="message" label="Your Message (min. 10 characters) *" required rows={5} />

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            {/* Loading spinner */}
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
function FloatField({ name, label, type = "text", required }: FloatFieldProps) {
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

// Reusable floating label textarea component
function FloatArea({ name, label, required, rows = 5 }: FloatAreaProps) {
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