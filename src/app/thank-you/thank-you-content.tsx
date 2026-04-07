"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref") || searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage(data.message || "Thank you for your generous donation!");
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed. Please contact support.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      });
  }, [reference]);

  if (status === "loading") {
    return (
      <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-brand-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-brand-accent animate-spin"></div>
          </div>
          <p className="text-brand-accent text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
            Confirming Payment
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0F172A] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[480px] w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-center">
          {/* Status Top Bar */}
          <div className={`h-2 w-full ${status === "success" ? 'bg-brand-accent' : 'bg-red-500'}`} />
          
          <div className="p-10 md:p-14">
            {status === "success" ? (
              <>
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-neutral-50 border border-brand-accent/20 shadow-sm">
                  <span className="text-4xl text-brand-accent">✦</span>
                </div>
                
                <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4 leading-tight">
                  Generosity <br /> <span className="italic text-brand-secondary">Received</span>
                </h1>
                
                <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                  {message}
                </p>
                
                <div className="bg-neutral-50 rounded-2xl p-5 mb-10 border border-neutral-100">
                  <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Reference ID</p>
                  <p className="text-sm font-mono text-brand-primary break-all">{reference}</p>
                </div>

                <Link
                  href="/donation"
                  className="inline-block w-full py-5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark transition-all shadow-xl shadow-brand-primary/20"
                >
                  Return to Home
                </Link>
              </>
            ) : (
              <>
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 border border-red-100">
                  <span className="text-4xl">!</span>
                </div>
                
                <h1 className="text-3xl font-serif font-bold text-slate-800 mb-4">
                  Action Required
                </h1>
                
                <p className="text-slate-600 mb-10 leading-relaxed text-sm">
                  {message}
                </p>

                <Link
                  href="/donation"
                  className="inline-block w-full py-5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-all"
                >
                  Try Again
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer Support Info */}
        <p className="mt-8 text-center text-xs text-slate-500 font-medium uppercase tracking-widest">
          A receipt has been sent to your email
        </p>
      </div>
    </main>
  );
}