// app/(routes)/donation/donation-form.tsx
"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaLock } from "react-icons/fa";

const PRESETS = [50, 70, 100, 200, 500, 1000] as const;

const PURPOSES = [
  { value: "TITHE", label: "Tithe" },
  { value: "OFFERING", label: "Offering" },
  { value: "GIVE", label: "General Giving" },
  { value: "EVENT_TICKET", label: "Event / Project" },
] as const;

export function DonationForm() {
  const [selectedPreset, setSelectedPreset] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState<string>("TITHE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedAmount = useMemo(() => {
    const n = Number(customAmount.trim());
    return Number.isFinite(n) && n > 0 ? n : selectedPreset;
  }, [customAmount, selectedPreset]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
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

    if (resolvedAmount < 10) {
      setError("Minimum amount is GH₵10.");
      setLoading(false);
      return;
    }

    try {
      const giverName = `${firstName} ${lastName}`.trim();

      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: resolvedAmount,
          purpose,
          giverName,
          giverEmail: email,
          giverPhone: phone || null,
          currency: "GHS",
          metadata: { note: note || undefined, source: "donation_page" },
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SELECT PURPOSE */}
      <div>
        <p className="text-lg font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">
          1. Select Purpose
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PURPOSES.map((p) => (
            <motion.button
              key={p.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPurpose(p.value)}
              className={`py-3.5 px-4 rounded-xl text-lg font-medium border transition-all duration-300 ${
                purpose === p.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 2. CHOOSE AMOUNT */}
      <div>
        <p className="text-lg font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">
          2. Choose Amount
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {PRESETS.map((amt) => (
            <motion.button
              key={amt}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedPreset(amt);
                setCustomAmount("");
              }}
              className={`py-3.5 rounded-xl text-lg font-semibold transition-all duration-300 ${
                !customAmount && selectedPreset === amt
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400"
              }`}
            >
              GH₵{amt}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            GH₵
          </span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Custom amount"
            className="w-full border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl pl-14 pr-4 py-3.5 text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* TOTAL GIFT */}
      <div className="bg-slate-50 rounded-2xl py-8 px-6 text-center border border-slate-100">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase mb-2">
          Total Gift
        </p>
        <motion.p
          key={resolvedAmount}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-5xl md:text-6xl font-serif font-medium text-slate-900 tracking-tight"
        >
          GH₵{resolvedAmount.toLocaleString()}
        </motion.p>
      </div>

      {/* 3. DONOR DETAILS */}
      <div>
        <p className="text-lg font-semibold tracking-[0.2em] text-slate-400 uppercase mb-4">
          3. Donor Details
        </p>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              required
              placeholder="First Name"
              className="w-full border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
            />
            <input
              name="lastName"
              type="text"
              required
              placeholder="Last Name"
              className="w-full border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
            />
          </div>
          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number (Optional)"
            className="w-full border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
          />
          <textarea
            name="note"
            rows={3}
            placeholder="Note or prayer request (optional)"
            className="w-full border border-slate-200 focus:border-slate-900 rounded-xl px-4 py-3.5 text-sm outline-none resize-none transition-all"
          />
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-slate-50 rounded-xl px-5 py-4 flex items-center justify-between text-sm border border-slate-100">
        <div>
          <p className="text-lg tracking-widest text-slate-400 uppercase">
            Purpose
          </p>
          <p className="font-medium text-slate-800 mt-0.5 text-lg">
            {PURPOSES.find((p) => p.value === purpose)?.label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg tracking-widest text-slate-400 uppercase flex items-center justify-end gap-1.5">
            <FaLock className="text-[10px]" /> Secure Payment Via
          </p>
          <p className="font-semibold text-slate-900 mt-0.5 tracking-wide text-2xl">
            PAYSTACK
          </p>
        </div>
      </div>

      <p className="text-center text-lg text-slate-400">
        You’ll continue securely to Paystack to complete your payment.
      </p>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm tracking-wide shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 transition-colors duration-300"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            GIVE GH₵{resolvedAmount.toLocaleString()}
            <span className="text-lg">→</span>
          </>
        )}
      </motion.button>
    </form>
  );
}