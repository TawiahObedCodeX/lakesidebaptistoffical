// app/donation/verify/page.tsx
// Payment Verification Page
// This page shows the result after a donor completes their payment
// It verifies the payment with our backend and displays a receipt
// The page handles 3 states: Loading → Success → Error

"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaDownload,
  FaHome,
  FaChurch,
  FaEnvelope,
  FaPhone,
  FaReceipt,
  FaUser,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";

// Types for the receipt data returned from our API
// This defines the shape of data we expect after verification
interface ReceiptData {
  amount: number | string;  // Donation amount
  purpose: string;           // What the donation was for
  reference: string;         // Unique payment reference number
  donorName: string;         // Name of the person who donated
  donorEmail: string;        // Email of the donor
  date: string;              // When the payment was verified
}

// Main page component wrapped in Suspense
// Suspense is needed because useSearchParams() can cause client-side rendering issues
// This is a Next.js requirement for pages using URL parameters
export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyPaymentContent />
    </Suspense>
  );
}

// Loading state shown while verification is in progress
// This appears immediately when the page loads
function LoadingState() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Spinning loader animation - shows the system is working */}
        <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-b-2 border-white mx-auto mb-5"></div>
        <p className="text-white text-base sm:text-lg tracking-wide">
          Verifying your payment...
        </p>
      </div>
    </main>
  );
}

// The actual verification logic component
// This handles all the business logic for verifying payments
function VerifyPaymentContent() {
  // Get URL parameters from the current page URL
  // Paystack redirects here with either 'reference' or 'trxref' parameter
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  // State management for the verification flow
  const [receipt, setReceipt] = useState<ReceiptData | null>(null); // Holds the receipt data on success
  const [loading, setLoading] = useState(true);                      // Controls loading spinner
  const [error, setError] = useState<string | null>(null);           // Holds error message if verification fails

  // useRef to prevent double verification in React StrictMode
  // StrictMode intentionally runs effects twice in development to catch bugs
  // This flag ensures we only verify the payment once
  const hasVerified = useRef(false);

  // FIXED: The verification logic is now a standalone async function
  // It's defined with useCallback to maintain referential stability
  // but the actual state updates happen asynchronously via the fetch
  const verifyPayment = useCallback(async (ref: string) => {
    // If already verified (StrictMode double-run), skip
    if (hasVerified.current) return;
    hasVerified.current = true;

    try {
      // Call our backend API to verify the payment
      // This checks with Paystack AND our database for the payment status
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref }),
      });

      // Parse the JSON response from our server
      const data = await res.json();

      if (data.ok) {
        // Payment was verified successfully!
        // Store the receipt data to display to the donor
        setReceipt(data.data);
      } else {
        // Payment verification returned an error
        // This could mean: payment failed, OTP not verified, or other issues
        setError(
          data.error ||
            "Payment verification failed. Please contact the church office."
        );
      }
    } catch (_err) {
      // Network errors (can't reach server) or unexpected errors go here
      // The underscore prefix tells ESLint we're intentionally not using the error variable
      setError(
        "Unable to verify payment. Please contact the church office for confirmation."
      );
    } finally {
      // FIXED: Set loading to false in finally block
      // This ensures loading stops regardless of success or failure
      setLoading(false);
    }
  }, []);

  // FIXED: Effect now only initiates the verification without calling setState directly
  // The verification function handles all state updates asynchronously
  useEffect(() => {
    // Store a flag to track if the component is still mounted
    // This prevents state updates on unmounted components
    let isMounted = true;

    // Create an async wrapper function inside the effect
    // This separates the effect logic from the state updates
    async function initializeVerification() {
      if (!reference) {
        // If no reference found in URL, show an error
        // This happens if someone navigates directly to this page without a payment
        if (isMounted) {
          setError("No payment reference found. Please try your donation again.");
          setLoading(false);
        }
        return;
      }

      // Call the verification function
      // State updates happen inside verifyPayment via the fetch response
      await verifyPayment(reference);
    }

    // Start the verification process
    initializeVerification();

    // Cleanup function: runs when component unmounts
    // Prevents state updates on unmounted components (memory leak prevention)
    return () => {
      isMounted = false;
    };
  }, [reference, verifyPayment]);

  // Opens the browser's print dialog for printing the receipt
  // This allows donors to keep a physical copy of their donation record
  function printReceipt() {
    window.print();
  }

  // Formats the amount to always show 2 decimal places
  // Example: 500 → "500.00", 123.5 → "123.50"
  function formatAmount(amount: number | string): string {
    return Number(amount).toFixed(2);
  }

  // ───────────────────── LOADING STATE ─────────────────────
  // Show spinner while verification is in progress
  if (loading) {
    return <LoadingState />;
  }

  // ───────────────────── ERROR STATE ─────────────────────
  // Show error message if verification failed
  if (error) {
    return (
      <main className="min-h-screen bg-linear-to-b from-blue-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Error header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-4 text-center">
            <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Payment Status
            </p>
          </div>
          {/* Error content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10 text-center">
            <div className="text-4xl sm:text-5xl mb-4">😔</div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
              Verification Failed
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-7">
              {error}
            </p>
            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                href="/donation"
                className="block w-full py-3 sm:py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
              >
                Try Again
              </Link>
              <Link
                href="/contact"
                className="block w-full py-3 sm:py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition"
              >
                Contact Church Office
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  // ───────────────────── SUCCESS STATE ─────────────────────
  // Show the donation receipt when verification succeeds
  if (receipt) {
    // Map purpose codes to human-readable labels
    const purposeLabels: Record<string, string> = {
      TITHE: "Tithe",
      OFFERING: "Offering",
      GIVE: "General Giving",
      EVENT_TICKET: "Event / Project",
    };

    // Format the date for display in Ghana locale
    const receiptDate = new Date(receipt.date);
    const formattedDate = receiptDate.toLocaleDateString("en-GH", {
      weekday: "long",   // Example: "Monday"
      year: "numeric",   // Example: "2024"
      month: "long",     // Example: "January"
      day: "numeric",    // Example: "15"
    });
    const formattedTime = receiptDate.toLocaleTimeString("en-GH", {
      hour: "2-digit",   // Example: "02"
      minute: "2-digit", // Example: "30"
    });

    return (
      <main className="min-h-screen bg-linear-to-b from-blue-900 to-slate-900 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
        <div className="w-full max-w-95 sm:max-w-md mx-auto">
          {/* Top success badge - animated entrance */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-5 sm:mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-400/30 text-green-300 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full mb-3">
              <FaCheckCircle className="text-green-400 text-[11px]" />
              Payment Verified
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Thank You
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              Your donation has been received
            </p>
          </motion.div>

          {/* Professional Receipt Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header with church name */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-5 sm:px-6 py-4 sm:py-5 text-center relative">
              <div className="absolute top-2.5 right-3 text-[9px] sm:text-[10px] font-semibold tracking-widest text-blue-200/90 uppercase">
                Official Receipt
              </div>

              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center">
                  <FaChurch className="text-white text-lg sm:text-xl" />
                </div>
              </div>

              <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                Lakeside Baptist Church
              </h2>
              <p className="text-blue-200 text-[11px] sm:text-xs mt-0.5">
                Donation Confirmation
              </p>
            </div>

            {/* Amount display - the most prominent part */}
            <div className="bg-slate-50 border-b border-slate-100 px-5 sm:px-6 py-4 sm:py-5 text-center">
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">
                Amount Received
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                GH₵{formatAmount(receipt.amount)}
              </p>
              <p className="text-sm font-medium text-blue-600 mt-1">
                {purposeLabels[receipt.purpose] || receipt.purpose}
              </p>
            </div>

            {/* Transaction details */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-3.5">
              {/* Receipt Number */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <FaHashtag className="text-[11px] text-slate-400" />
                  <span className="text-xs sm:text-sm">Receipt No.</span>
                </div>
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-slate-800 text-right break-all leading-snug">
                  {receipt.reference}
                </span>
              </div>

              {/* Donor Name */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <FaUser className="text-[11px] text-slate-400" />
                  <span className="text-xs sm:text-sm">Donor</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 text-right">
                  {receipt.donorName}
                </span>
              </div>

              {/* Donor Email */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <FaEnvelope className="text-[11px] text-slate-400" />
                  <span className="text-xs sm:text-sm">Email</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-700 text-right break-all leading-snug">
                  {receipt.donorEmail}
                </span>
              </div>

              {/* Date and Time */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <FaCalendarAlt className="text-[11px] text-slate-400" />
                  <span className="text-xs sm:text-sm">Date</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-700 text-right leading-snug">
                  {formattedDate}
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> · </span>
                  {formattedTime}
                </span>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <FaReceipt className="text-[11px] text-slate-400" />
                  <span className="text-xs sm:text-sm">Status</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold border border-green-100">
                  <FaCheckCircle className="text-[9px]" />
                  Verified
                </span>
              </div>
            </div>

            {/* Bible verse - spiritual encouragement */}
            <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 px-3.5 sm:px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
              <p className="text-amber-800/90 text-[11px] sm:text-xs italic leading-relaxed">
                &ldquo;Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver.&rdquo;
              </p>
              <p className="text-amber-600 text-[10px] sm:text-[11px] font-semibold mt-1.5">
                — 2 Corinthians 9:7
              </p>
            </div>

            {/* Action buttons */}
            <div className="px-4 sm:px-5 pb-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                onClick={printReceipt}
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-[0.98]"
              >
                <FaDownload className="text-[11px]" />
                Print
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition active:scale-[0.98]"
              >
                <FaHome className="text-[11px]" />
                Home
              </Link>
            </div>

            {/* Church contact footer */}
            <div className="border-t border-slate-100 px-4 sm:px-5 py-3.5 bg-slate-50/90">
              <div className="flex flex-col xs:flex-row items-center justify-center gap-x-4 gap-y-1.5 text-[10px] sm:text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <FaEnvelope className="text-[9px] text-slate-400" />
                  lakesidebaptistchurch1@gmail.com
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaPhone className="text-[9px] text-slate-400" />
                  +233 24 838 3745
                </span>
              </div>
            </div>
          </motion.div>

          {/* Secondary navigation links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 sm:mt-6 flex justify-center gap-5 sm:gap-6 text-xs sm:text-sm"
          >
            <Link
              href="/services"
              className="text-blue-200/90 hover:text-white transition"
            >
              Join Us for Service
            </Link>
            <Link
              href="/contact"
              className="text-blue-200/90 hover:text-white transition"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  // Fallback: return null if none of the states match
  // This should never happen but satisfies React's return requirements
  return null;
}