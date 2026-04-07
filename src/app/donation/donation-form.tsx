"use client";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";

const PRESETS = [100, 200, 300, 400, 500, 600] as const;

export function DonationForm() {
  const [selectedPreset, setSelectedPreset] = useState<number>(PRESETS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedAmount = useMemo(() => {
    const n = Number(customAmount.trim());
    return Number.isFinite(n) && n > 0 ? n : selectedPreset;
  }, [customAmount, selectedPreset]);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!firstName || !lastName || !email) {
      setLoading(false);
      setError("Please provide your full name and email address.");
      return;
    }

    if (resolvedAmount < 10) {
      setLoading(false);
      setError("Minimum donation amount is GH₵10.");
      return;
    }

    try {
      const initiateRes = await fetch("/api/donations/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: resolvedAmount,
          firstName,
          lastName,
          email,
          note: note || undefined,
        }),
      });
      const initiateData = await initiateRes.json();
      if (!initiateData.ok || !initiateData.donationId) {
        throw new Error(initiateData.error || "Failed to start donation");
      }

      const payRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationId: initiateData.donationId }),
      });
      const payData = await payRes.json();

      if (!payData.ok || !payData.authorization_url) {
        throw new Error(payData.error || "Payment initialization failed");
      }
      window.location.href = payData.authorization_url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-10">
      {error && <Alert kind="error">{error}</Alert>}

      {/* Amount Selection */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-brand-primary/10 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">Select Amount</h2>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-brand-secondary">GH₵</span>
            <span className="text-5xl font-light text-brand-primary tracking-tighter">
              {resolvedAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelectedPreset(amt);
                setCustomAmount("");
              }}
              className={`py-4 rounded-xl font-medium transition-all duration-300 border ${
                !customAmount && selectedPreset === amt
                  ? "bg-brand-primary border-brand-primary text-white shadow-lg scale-[1.02]"
                  : "bg-white border-neutral-200 text-brand-primary hover:border-brand-accent hover:bg-neutral-50"
              }`}
            >
              GH₵{amt}
            </button>
          ))}
        </div>

        <div className="group relative">
          <input
            type="number"
            inputMode="decimal"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Other Amount"
            className="w-full bg-white px-6 py-5 text-lg font-medium rounded-xl border border-neutral-200 focus:border-brand-accent focus:ring-0 outline-none transition-all placeholder:text-neutral-300"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-accent tracking-widest uppercase pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
            Custom
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary/60 border-b border-brand-primary/10 pb-4">
          Donor Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            type="text"
            required
            placeholder="First Name"
            className="w-full px-5 py-4 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:border-brand-accent outline-none transition-all"
          />
          <input
            name="lastName"
            type="text"
            required
            placeholder="Last Name"
            className="w-full px-5 py-4 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <input
          name="email"
          type="email"
          required
          placeholder="Email Address"
          className="w-full px-5 py-4 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:border-brand-accent outline-none transition-all"
        />
        <textarea
          name="note"
          rows={2}
          placeholder="Note or Dedication (Optional)"
          className="w-full px-5 py-4 rounded-xl border border-neutral-200 bg-white/50 focus:bg-white focus:border-brand-accent resize-none outline-none transition-all"
        />
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-xl bg-brand-secondary hover:bg-brand-secondary-dark active:scale-[0.99] transition-all font-bold text-white shadow-xl shadow-brand-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Complete Secure Donation"
          )}
        </button>
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          Encrypted Secure Checkout • GH₵ Currency
        </p>
      </div>
    </form>
  );
}