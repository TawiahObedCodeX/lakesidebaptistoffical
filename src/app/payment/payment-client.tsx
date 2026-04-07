"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Alert } from "@/components/ui/Alert";
import { strongId } from "@/lib/ids";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

type PaystackCallbackResponse = { reference?: string };

type Props = {
  donationId: number;
  donation: {
    amount: number;
    currency: string;
    name: string;
    email: string;
    note: string;
  };
  paystackPublicKey: string;
  userEmail?: string;
  userName?: string;
};

type Method = "paystack" | "mobile_money" | "card";

const NETWORKS = [
  { value: "mtn", label: "MTN MoMo" },
  { value: "vod", label: "Telecel (Vodafone) Cash" },
  { value: "atl", label: "AirtelTigo Money" },
] as const;

export function PaymentClient({
  donation,
  paystackPublicKey,
  userEmail,
  userName,
}: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("paystack");
  const [network, setNetwork] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountLabel = useMemo(() => `GH₵ ${donation.amount.toFixed(2)}`, [donation.amount]);

  useEffect(() => {
    console.log("PaymentClient mounted - Paystack Key:", paystackPublicKey ? "PRESENT" : "MISSING");
  }, [paystackPublicKey]);

  async function verifyOnServer(reference: string) {
    try {
      const res = await fetch("/api/payments/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Verification failed");

      router.push(data.redirectUrl || "/thank-you");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Payment verification failed");
    }
  }

  function startPaystack() {
    console.log("startPaystack called - Key length:", paystackPublicKey?.length || 0);

    if (!paystackPublicKey) {
      setError("Paystack public key missing – check .env.local");
      setLoading(false);
      return;
    }

    if (!window.PaystackPop?.setup) {
      setError("Paystack SDK not loaded. Refresh and try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const payAmount = Math.round(donation.amount * 100);
    const ref = strongId("DON");

    console.log("Opening Paystack popup → amount:", payAmount, "ref:", ref);

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: userEmail || donation.email,
      amount: payAmount,
      currency: donation.currency || "GHS",
      ref,
      channels: method === "mobile_money" ? ["mobile_money"] : method === "card" ? ["card"] : ["card", "bank", "ussd", "mobile_money"],
      metadata: {
        custom_fields: [
          { display_name: "Donor Name", variable_name: "donor_name", value: donation.name || "Anonymous" },
        ],
        ...(method === "mobile_money" && network && {
          custom_filters: { supported_mobile_money_providers: [network] },
        }),
      },
      callback: function (response: PaystackCallbackResponse) {
        // Paystack expects a plain function (not async)
        const reference = String(response?.reference ?? "").trim();
        console.log("Paystack callback received - ref:", reference);
        if (!reference) {
          setLoading(false);
          setError("Missing reference from Paystack");
          return;
        }
        verifyOnServer(reference).catch((err) => {
          setLoading(false);
          setError(err.message || "Verification failed");
        });
      },
      onClose: function () {
        console.log("Paystack popup closed by user");
        setLoading(false);
        setError("Transaction was cancelled.");
      },
    });

    handler.openIframe();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted - Method:", method);

    if (method === "mobile_money" && (!network || !phone.trim())) {
      setError("Please select network and enter phone number.");
      return;
    }

    startPaystack();
  }

  return (
    <form onSubmit={onSubmit}>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Paystack SDK script loaded successfully")}
      />

      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Donation Summary */}
        <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-5 sm:p-8 shadow-lg mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[--pri]">
            Complete your donation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Secure • Confirmation sent after payment
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5 sm:p-6 border border-slate-200">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-500">
              Donation Amount
            </div>
            <div className="mt-1 text-4xl sm:text-5xl font-black text-[--pri]">
              {amountLabel}
            </div>

            <div className="mt-4 text-sm space-y-1">
              <div className="font-semibold">{donation.name || "Anonymous Donor"}</div>
              <div className="text-slate-500 break-all">{donation.email}</div>
              {donation.note && (
                <div className="mt-2 italic text-slate-600 text-sm">Note: {donation.note}</div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-5 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[--pri]">
            Payment Method
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Paystack is recommended for fast & secure checkout
          </p>

          {error && <Alert kind="error" className="mt-4">{error}</Alert>}

          <div className="mt-6 space-y-6">
            {/* Method Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "paystack", label: "Paystack", hint: "Cards & more" },
                { id: "mobile_money", label: "MoMo", hint: "All networks" },
                { id: "card", label: "Card", hint: "Visa / Mastercard" },
              ].map((m) => {
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as Method)}
                    className={`rounded-xl border-2 px-4 py-5 text-left transition-all ${
                      active
                        ? "border-[--sec] bg-[color-mix(in_oklab,var(--sec)_10%,white)] shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="font-bold text-[--pri]">{m.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{m.hint}</div>
                  </button>
                );
              })}
            </div>

            {/* MoMo fields */}
            {method === "mobile_money" && (
              <div className="space-y-4 rounded-xl bg-slate-50 p-6 border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[--sec] focus:ring-[--sec] outline-none"
                  >
                    <option value="">Select network</option>
                    {NETWORKS.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="024 123 4567"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[--sec] focus:ring-[--sec] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[--sec] to-[#7b5a43] px-6 py-4 text-base font-extrabold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Your payment is secure • Confirmation sent shortly
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}