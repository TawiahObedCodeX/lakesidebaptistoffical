// app/(routes)/donation/donation-form.tsx
// UPDATED: Now includes phone number requirement and OTP verification step
"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaPhone, FaLock } from "react-icons/fa";

// Predefined donation amounts in Ghana Cedis
// These are common donation amounts that people can quickly select
const PRESETS = [100, 200, 300, 500, 1000, 2000] as const;

// Available donation purposes
// Different categories for different types of giving
const PURPOSES = [
  { value: "TITHE", label: "Tithe" },           // 10% of income
  { value: "OFFERING", label: "Offering" },      // General offering
  { value: "GIVE", label: "General Giving" },    // Any general donation
  { value: "EVENT_TICKET", label: "Event / Project" }, // For specific events
] as const;

export function DonationForm() {
  // State for the donation form
  const [selectedPreset, setSelectedPreset] = useState<number>(PRESETS[3]); // Default: 500 GHS
  const [customAmount, setCustomAmount] = useState(""); // Custom amount input
  const [purpose, setPurpose] = useState<string>("GIVE"); // Default purpose
  const [loading, setLoading] = useState(false); // Is payment being processed?
  const [error, setError] = useState<string | null>(null); // Error messages
  
  // NEW: OTP verification states
  const [step, setStep] = useState<'details' | 'payment' | 'otp'>('details'); // Current step in flow
  const [donationId, setDonationId] = useState<string>(''); // Donation ID from backend
  const [phoneNumber, setPhoneNumber] = useState(''); // User's phone number
  const [otpCode, setOtpCode] = useState(''); // OTP code entered by user
  const [otpSent, setOtpSent] = useState(false); // Whether OTP has been sent
  const [otpCountdown, setOtpCountdown] = useState(0); // Countdown for OTP resend
  const [paymentReference, setPaymentReference] = useState(''); // Payment reference from Paystack

  // Calculate the actual donation amount
  // If user typed a custom amount, use that; otherwise use the selected preset
  const resolvedAmount = useMemo(() => {
    const n = Number(customAmount.trim());
    return Number.isFinite(n) && n > 0 ? n : selectedPreset;
  }, [customAmount, selectedPreset]);

  // Handle initial form submission (details + payment)
  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Get donor information from the form
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    // Validate required fields
    if (!firstName || !lastName || !email) {
      setError("Please provide your full name and email.");
      setLoading(false);
      return;
    }
    
    // NEW: Validate phone number is provided
    if (!phone) {
      setError("Phone number is required for payment verification.");
      setLoading(false);
      return;
    }
    
    // NEW: Validate Ghana phone number format
    if (!phone.match(/^(0|\+?233)\d{9}$/)) {
      setError("Please enter a valid Ghana phone number (e.g., 0241234567 or +233241234567).");
      setLoading(false);
      return;
    }
    
    // Validate minimum donation amount
    if (resolvedAmount < 10) {
      setError("Minimum amount is GH₵10.");
      setLoading(false);
      return;
    }

    try {
      // Combine first and last name
      const giverName = `${firstName} ${lastName}`.trim();
      
      // Save phone number for later use
      setPhoneNumber(phone);
      
      // Send donation request to our backend
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: resolvedAmount,
          purpose,
          giverName,
          giverEmail: email,
          giverPhone: phone, // NEW: Send phone number
          currency: "GHS",
          metadata: { note: note || undefined, source: "donation_page" },
        }),
      });

      // Parse the response from our server
      const data = await res.json();
      
      // Check if payment initialization was successful
      if (!data.ok || !data.authorization_url) {
        throw new Error(data.error || "Payment failed");
      }

      // Store the payment reference for later
      setPaymentReference(data.reference);
      
      // Redirect to Paystack's secure payment page
      // This is where the donor enters their card or mobile money details
      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      // Handle errors during payment initialization
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // NEW: Handle sending OTP to user's phone
  async function handleSendOtp() {
    setLoading(true);
    setError(null);
    
    try {
      // Call the API to send OTP
      const res = await fetch('/api/payments/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: donationId,
          phoneNumber: phoneNumber,
        }),
      });
      
      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      // Mark OTP as sent and start countdown
      setOtpSent(true);
      setOtpCountdown(60); // 60 second countdown before resend
      
      // Start countdown timer
      const timer = setInterval(() => {
        setOtpCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // NEW: Handle OTP verification
  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    
    // Validate OTP format
    if (!otpCode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit verification code.');
      setLoading(false);
      return;
    }
    
    try {
      // Call the API to verify OTP
      const res = await fetch('/api/payments/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: donationId,
          phoneNumber: phoneNumber,
          otpCode: otpCode,
        }),
      });
      
      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      // Payment verified successfully!
      // Redirect to the success/verification page
      window.location.href = `/donation/verify?reference=${paymentReference}`;
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed.';
      setError(errorMessage);
      setOtpCode(''); // Clear OTP input on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-12">
      {/* Error message display */}
      {error && (
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      {/* Purpose Selection */}
      {/* Choose what the donation is for */}
      <div>
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-6">
          Purpose
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {PURPOSES.map((p) => (
            <motion.button
              key={p.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPurpose(p.value)}
              className={`py-6 rounded-2xl font-medium border transition-all ${
                purpose === p.value 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "border-slate-200 hover:bg-black"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Amount Selection */}
      {/* Choose how much to donate */}
      <div>
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-6">
          Amount (GH₵)
        </h3>
        <div className="flex justify-between items-end mb-8">
          <span className="text-7xl font-light tracking-tighter text-slate-900">
            {resolvedAmount}
          </span>
        </div>

        {/* Quick preset amounts */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {PRESETS.map((amt) => (
            <motion.button
              key={amt}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { 
                setSelectedPreset(amt); 
                setCustomAmount(""); // Clear custom amount when selecting preset
              }}
              className={`py-7 rounded-2xl font-semibold transition-all ${
                !customAmount && selectedPreset === amt 
                  ? "bg-blue-600 text-white" 
                  : "border border-slate-200 hover:border-blue-300"
              }`}
            >
              {amt}
            </motion.button>
          ))}
        </div>

        {/* Custom amount input */}
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Custom amount"
          className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-8 py-7 text-2xl outline-none"
        />
      </div>

      {/* Donor Information */}
      {/* Collect the donor's contact details */}
      <div className="space-y-6">
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500">
          Your Information
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <input 
            name="firstName" 
            type="text" 
            required 
            placeholder="First Name" 
            className="border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" 
          />
          <input 
            name="lastName" 
            type="text" 
            required 
            placeholder="Last Name" 
            className="border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" 
          />
        </div>
        <input 
          name="email" 
          type="email" 
          required 
          placeholder="Email Address" 
          className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" 
        />
        {/* NEW: Phone number field (REQUIRED for OTP verification) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <FaPhone className="text-slate-400" />
          </div>
          <input 
            name="phone" 
            type="tel" 
            required 
            placeholder="Phone Number (e.g., 0241234567) - Required for verification" 
            className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl pl-14 pr-6 py-5 outline-none" 
          />
        </div>
        <textarea 
          name="note" 
          rows={3} 
          placeholder="Note or prayer request (optional)" 
          className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none resize-y" 
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        className="w-full py-8 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-semibold text-2xl shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
      >
        {loading ? "Processing..." : `Donate GH₵${resolvedAmount} Now`}
        {!loading && <FaCheckCircle />}
      </motion.button>
    </form>
  );
}