// app/donation/verify/page.tsx
"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload, FaHome, FaChurch } from "react-icons/fa";

// Types for the receipt data
interface ReceiptData {
  amount: number
  purpose: string
  reference: string
  donorName: string
  donorEmail: string
  date: string
}

// Main component wrapped in Suspense for useSearchParams
export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyPaymentContent />
    </Suspense>
  );
}

// Loading state shown while the page is loading
function LoadingState() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
        <p className="text-white text-xl">Verifying your payment...</p>
      </div>
    </main>
  );
}

// The actual verification and receipt display
function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if verification has been done
  // This prevents double verification in development mode
  const hasVerified = useRef(false);

  // Define the verification function
  // This sends the payment reference to our API for verification
  const verifyPayment = useCallback(async (ref: string) => {
    // Prevent double verification
    if (hasVerified.current) return;
    hasVerified.current = true;
    
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref }),
      });

      const data = await res.json();

      if (data.ok) {
        setReceipt(data.data);
        setLoading(false);
      } else {
        setError(data.error || "Payment verification failed. Please contact the church office.");
        setLoading(false);
      }
    } catch (err) {
      setError("Unable to verify payment. Please contact the church office for confirmation.");
      setLoading(false);
    }
  }, []);

  // Start verification when the component mounts
  // We use useEffect to trigger the verification when we have a reference
  useEffect(() => {
    if (reference) {
      // Start verification asynchronously without calling setState directly
      verifyPayment(reference);
    } else {
      setError("No payment reference found. Please try your donation again.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  // Function to print the receipt
  function printReceipt() {
    window.print();
  }

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-linear-to-b from-blue-900 to-slate-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl p-10 text-center shadow-2xl"
        >
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Verification Failed</h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <div className="space-y-4">
            <Link
              href="/donation"
              className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="block w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition"
            >
              Contact Church Office
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Success state - Show receipt
  if (receipt) {
    const purposeLabels: Record<string, string> = {
      TITHE: 'Tithe',
      OFFERING: 'Offering',
      GIVE: 'General Giving',
      EVENT_TICKET: 'Event / Project'
    };

    const receiptDate = new Date(receipt.date);
    const formattedDate = receiptDate.toLocaleDateString('en-GH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = receiptDate.toLocaleTimeString('en-GH', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <main className="min-h-screen bg-linear-to-b from-blue-900 to-slate-900 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-lg"
            >
              <FaCheckCircle className="text-white text-5xl" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Thank You! 🎉
            </h1>
            <p className="text-xl text-blue-200">
              Your donation has been received and verified
            </p>
          </motion.div>

          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Receipt Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
              <FaChurch className="text-3xl mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Lakeside Baptist Church</h2>
              <p className="text-blue-200 text-sm mt-1">Official Donation Receipt</p>
              <div className="mt-6">
                <p className="text-5xl font-bold">GH₵{receipt.amount.toFixed(2)}</p>
                <p className="text-blue-200 mt-2">{purposeLabels[receipt.purpose] || receipt.purpose}</p>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Receipt Number</span>
                  <span className="font-mono text-sm font-semibold text-slate-900">{receipt.reference}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Donor Name</span>
                  <span className="font-semibold text-slate-900">{receipt.donorName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Email</span>
                  <span className="text-slate-900">{receipt.donorEmail}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-semibold text-slate-900">GH₵{receipt.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Purpose</span>
                  <span className="font-semibold text-slate-900">
                    {purposeLabels[receipt.purpose] || receipt.purpose}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Date</span>
                  <span className="text-slate-900">{formattedDate} at {formattedTime}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <FaCheckCircle className="text-xs" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Bible Verse */}
              <div className="mt-8 p-6 bg-amber-50 rounded-2xl text-center border border-amber-200">
                <p className="text-amber-800 italic leading-relaxed">
                  &ldquo;Each of you should give what you have decided in your heart to give, 
                  not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
                </p>
                <p className="text-amber-600 font-semibold mt-3">&mdash; 2 Corinthians 9:7</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  onClick={printReceipt}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition"
                >
                  <FaDownload />
                  Print Receipt
                </button>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition"
                >
                  <FaHome />
                  Go Home
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 text-center text-sm text-slate-500">
                <p>If you have any questions about your donation, please contact us:</p>
                <p className="mt-1">
                  📧 info@lakesidebaptistgh.org | 📞 +233 24 123 4567
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex justify-center gap-6">
              <Link
                href="/services"
                className="text-blue-200 hover:text-white transition"
              >
                Join Us for Service
              </Link>
              <Link
                href="/contact"
                className="text-blue-200 hover:text-white transition"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return null;
}