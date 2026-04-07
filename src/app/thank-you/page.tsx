import { Suspense } from "react";
import { ThankYouContent } from "./thank-you-content";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    // Matches the dark "Professional" background of the main page
    <main className="min-h-dvh bg-[#0F172A] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative mx-auto h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-brand-accent/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-accent animate-spin"></div>
        </div>
        <p className="text-brand-accent text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
          Verifying Transaction
        </p>
      </div>
    </main>
  );
}