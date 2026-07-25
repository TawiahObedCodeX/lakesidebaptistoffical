// components/contact-form.tsx
"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";

// Define proper types for our component props
// This makes the code more reliable and easier to understand
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
  // State variables to track form status
  // These help us show different UI based on what's happening
  const [loading, setLoading] = useState(false);      // Is the form submitting?
  const [error, setError] = useState<string | null>(null); // Error message to show
  const [success, setSuccess] = useState(false);       // Was the form submitted successfully?

  // This function runs when the form is submitted
  // It collects the form data and sends it to our API
  async function onSubmit(formData: FormData) {
    // Start the submission process
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Get all the form values and clean them up
    // We trim whitespace to remove accidental spaces
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    // Send the message to our backend API
    // This API will validate and store the message
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, message }),
    });

    // Try to parse the response from the server
    const data = await res.json().catch(() => null);
    
    // Check if the submission was successful
    if (!res.ok || !data?.ok) {
      // Show the error message from the server or a default one
      setError(data?.error || "Failed to send message. Please try again.");
      setLoading(false);
      return;
    }

    // Success! Show the success message
    setSuccess(true);
    setLoading(false);
  }

  // If the form was submitted successfully, show a thank you message
  // This gives the user confirmation that their message was received
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

  // The actual contact form
  // This is what users see and interact with
  return (
    <form action={onSubmit} className="space-y-6" noValidate>
      {/* Show error message if something went wrong */}
      {error && <Alert kind="error">{error}</Alert>}

      {/* Name fields - first and last name side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FloatField name="firstName" label="First Name" required />
        <FloatField name="lastName" label="Last Name" required />
      </div>

      {/* Contact information fields */}
      <FloatField name="email" label="Email Address" type="email" required />
      <FloatField name="phone" label="Phone Number (optional)" type="tel" />

      {/* Message text area */}
      <FloatArea name="message" label="Your Message" required rows={5} />

      {/* Submit button */}
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

// Reusable floating label input component
// The label floats up when the user starts typing
// This creates a clean, modern look for the form
function FloatField({ name, label, type = "text", required }: FloatFieldProps) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        required={required}
        placeholder=" " // Empty placeholder is needed for the CSS floating label trick
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-amber-200 outline-none transition"
      />
      <label className="absolute left-5 top-5 text-slate-500 peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amber-600 transition-all pointer-events-none">
        {label}
      </label>
    </div>
  );
}

// Reusable floating label textarea component
// Same floating label concept but for multi-line text input
function FloatArea({ name, label, required, rows = 5 }: FloatAreaProps) {
  return (
    <div className="relative">
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder=" " // Empty placeholder needed for CSS floating label trick
        className="peer w-full px-5 pt-6 pb-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-amber-200 outline-none transition resize-none"
      />
      <label className="absolute left-5 top-5 text-slate-500 peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amber-600 transition-all pointer-events-none">
        {label}
      </label>
    </div>
  );
}