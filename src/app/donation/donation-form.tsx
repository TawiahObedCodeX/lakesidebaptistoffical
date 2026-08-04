// app/(routes)/donation/donation-form.tsx
// UPDATED: Shows OTP verification screen BEFORE Paystack redirect
"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaPhone, FaLock, FaSpinner } from "react-icons/fa";

const PRESETS = [100, 200, 300, 500, 1000, 2000] as const;

const PURPOSES = [
  { value: "TITHE", label: "Tithe" },
  { value: "OFFERING", label: "Offering" },
  { value: "GIVE", label: "General Giving" },
  { value: "EVENT_TICKET", label: "Event / Project" },
] as const;

export function DonationForm() {
  // Form states
  const [selectedPreset, setSelectedPreset] = useState<number>(PRESETS[3]);
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState<string>("GIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // OTP verification states
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [donationId, setDonationId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState(''); // Store Paystack URL for later redirect
  const [paymentReference, setPaymentReference] = useState('');

  const resolvedAmount = useMemo(() => {
    const n = Number(customAmount.trim());
    return Number.isFinite(n) && n > 0 ? n : selectedPreset;
  }, [customAmount, selectedPreset]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Handle initial form submission (Step 1: Collect details, send OTP)
  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!firstName || !lastName || !email) {
      setError("Please provide your full name and email.");
      setLoading(false);
      return;
    }
    
    if (!phone) {
      setError("Phone number is required for payment verification.");
      setLoading(false);
      return;
    }
    
    if (!phone.match(/^(0|\+?233)\d{9}$/)) {
      setError("Please enter a valid Ghana phone number (e.g., 0241234567 or +233241234567).");
      setLoading(false);
      return;
    }
    
    if (resolvedAmount < 10) {
      setError("Minimum amount is GH₵10.");
      setLoading(false);
      return;
    }

    try {
      const giverName = `${firstName} ${lastName}`.trim();
      setPhoneNumber(phone);
      
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: resolvedAmount,
          purpose,
          giverName,
          giverEmail: email,
          giverPhone: phone,
          currency: "GHS",
          metadata: { note: note || undefined, source: "donation_page" },
        }),
      });

      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Store payment info for later (after OTP verification)
      setDonationId(data.donationId);
      setPaymentUrl(data.authorization_url);
      setPaymentReference(data.reference);
      setOtpSent(true);
      setOtpCountdown(60);
      
      // Switch to OTP screen (DON'T redirect to Paystack yet!)
      setStep('otp');
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP resend
  async function handleResendOtp() {
    setLoading(true);
    setError(null);
    
    try {
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
        throw new Error(data.error || 'Failed to resend verification code');
      }
      
      setOtpCountdown(60);
      setOtpCode('');
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification code.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP verification (Step 2: Verify code, then redirect to Paystack)
  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    
    if (!otpCode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit verification code.');
      setLoading(false);
      return;
    }
    
    try {
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
      
      // OTP verified! Now redirect to Paystack for payment
      window.location.href = paymentUrl;
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed.';
      setError(errorMessage);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  }

  // ───────────────────── OTP VERIFICATION SCREEN ─────────────────────
  if (step === 'otp') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Verify Your Phone Number
          </h3>
          <p className="text-slate-600 text-sm">
            We sent a 6-digit verification code to <strong>{phoneNumber}</strong>.
            Enter it below to continue with your payment.
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full border-2 border-slate-200 focus:border-blue-500 rounded-xl px-5 py-4 text-2xl text-center tracking-[0.5em] font-mono outline-none transition"
            autoFocus
          />
        </div>

        {/* Verify Button */}
        <motion.button
          type="button"
          onClick={handleVerifyOtp}
          disabled={loading || otpCode.length !== 6}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Continue to Payment'
          )}
        </motion.button>

        {/* Resend OTP */}
        <div className="text-center">
          {otpCountdown > 0 ? (
            <p className="text-slate-500 text-sm">
              Resend code in <span className="font-semibold text-slate-700">{otpCountdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              Resend verification code
            </button>
          )}
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => setStep('form')}
          className="w-full py-3 text-slate-600 hover:text-slate-800 text-sm font-medium"
        >
          ← Back to donation form
        </button>

        {/* Payment summary */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Payment Summary</p>
          <p className="text-lg font-bold text-slate-900">GH₵{resolvedAmount}</p>
          <p className="text-sm text-slate-600">
            {PURPOSES.find(p => p.value === purpose)?.label || purpose}
          </p>
        </div>
      </div>
    );
  }

  // ───────────────────── DONATION FORM SCREEN ─────────────────────
  return (
    <form action={onSubmit} className="space-y-12">
      {/* Error message display */}
      {error && (
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      {/* Purpose Selection */}
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
                  : "border-slate-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Amount Selection */}
      <div>
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-6">
          Amount (GH₵)
        </h3>
        <div className="flex justify-between items-end mb-8">
          <span className="text-7xl font-light tracking-tighter text-slate-900">
            {resolvedAmount}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {PRESETS.map((amt) => (
            <motion.button
              key={amt}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { 
                setSelectedPreset(amt); 
                setCustomAmount(""); 
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

        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Custom amount"
          className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-8 py-7 text-2xl outline-none"
        />
      </div>

      {/* Donor Information */}
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
        className="w-full py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-semibold text-2xl shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Sending Verification Code...
          </>
        ) : (
          <>
            Donate GH₵{resolvedAmount}
            <FaCheckCircle />
          </>
        )}
      </motion.button>
    </form>
  );
}