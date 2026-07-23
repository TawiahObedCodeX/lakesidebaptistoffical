// app/(routes)/donation/donation-form.tsx
"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const PRESETS = [100, 200, 300, 500, 1000, 2000] as const;
const PURPOSES = [
  { value: "TITHE", label: "Tithe" },
  { value: "OFFERING", label: "Offering" },
  { value: "GIVE", label: "General Giving" },
  { value: "EVENT_TICKET", label: "Event / Project" },
] as const;

export function DonationForm() {
  const [selectedPreset, setSelectedPreset] = useState<number>(PRESETS[3]);
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState<string>("GIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedAmount = useMemo(() => {
    const n = Number(customAmount.trim());
    return Number.isFinite(n) && n > 0 ? n : selectedPreset;
  }, [customAmount, selectedPreset]);

  async function onSubmit(formData: FormData) {
    // ... (same logic as before)
    setLoading(true);
    setError(null);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
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
          currency: "GHS",
          metadata: { note: note || undefined, source: "donation_page" },
        }),
      });

      const data = await res.json();
      if (!data.ok || !data.authorization_url) throw new Error(data.error || "Payment failed");

      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-12">
      {error && <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100">{error}</div>}

      {/* Purpose */}
      <div>
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-6">Purpose</h3>
        <div className="grid grid-cols-2 gap-4">
          {PURPOSES.map((p) => (
            <motion.button
              key={p.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPurpose(p.value)}
              className={`py-6 rounded-2xl font-medium border transition-all ${
                purpose === p.value ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Amount & Donor Info - same structure as before but cleaner */}
      <div>
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500 mb-6">Amount (GH₵)</h3>
        <div className="flex justify-between items-end mb-8">
          <span className="text-7xl font-light tracking-tighter text-slate-900">{resolvedAmount}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {PRESETS.map((amt) => (
            <motion.button
              key={amt}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelectedPreset(amt); setCustomAmount(""); }}
              className={`py-7 rounded-2xl font-semibold transition-all ${
                !customAmount && selectedPreset === amt ? "bg-blue-600 text-white" : "border border-slate-200 hover:border-blue-300"
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

      {/* Donor Details */}
      <div className="space-y-6">
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-500">Your Information</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <input name="firstName" type="text" required placeholder="First Name" className="border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" />
          <input name="lastName" type="text" required placeholder="Last Name" className="border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" />
        </div>
        <input name="email" type="email" required placeholder="Email Address" className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none" />
        <textarea name="note" rows={3} placeholder="Note or prayer request (optional)" className="w-full border border-slate-200 focus:border-blue-600 rounded-2xl px-6 py-5 outline-none resize-y" />
      </div>

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