// app/(routes)/donation/page.tsx
"use client";
import { DonationForm } from "./donation-form";
import { motion } from "framer-motion";

export default function DonationPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-blue-900 px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#60A5FA_0%,transparent_70%)] opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-36 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-light tracking-tighter leading-none mb-6 text-white font-serif"
          >
            Give Boldly.
            <br />
            <span className="text-[#B85C38] font-medium">Impact Eternally.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-blue-100 max-w-2xl mx-auto font-light"
          >
            Your generosity powers lives, faith, and community transformation.
          </motion.p>
        </div>

        {/* Curvy Divider */}
        <div className="absolute bottom-0 left-0 w-full -mb-1 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-20 sm:h-24 md:h-28 lg:h-32 fill-white"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* ========== GIVING FORM SECTION ========== */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-6 sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 mb-1">
                Give with Purpose
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Your gift makes a profound difference.
              </p>

              <DonationForm />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}