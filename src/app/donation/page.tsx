// app/(routes)/donation/page.tsx
"use client";
import { DonationForm } from "./donation-form";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const FAQ_ITEMS = [
  {
    q: "Is my giving confidential?",
    a: "Yes. All donations are processed securely and your personal information is never shared publicly. We treat every gift with the highest level of confidentiality.",
  },
  {
    q: "Can I give towards a specific project?",
    a: "Absolutely. Use the “Event / Project” purpose or leave a note in the prayer/request field so we can direct your gift exactly where you intend.",
  },
  {
    q: "How is my payment processed?",
    a: "Payments are handled securely through Paystack. We never store your card details. After a successful payment you will receive an email confirmation.",
  },
];

export default function DonationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-white min-h-screen">
      {/* ========== HERO SECTION (UNTOUCHED) ========== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-blue-900 px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#60A5FA_0%,transparent_70%)] opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-36 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex justify-center gap-6 mb-8"
          />

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

      {/* ========== MAIN GIVING SECTION ========== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT – Image + Why We Give */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="space-y-10"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-4/5 sm:aspect-5/6 shadow-xl">
                <img
                  src="/images/kntim.jpg"
                  alt="Sanctuary interior"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[0.25em] text-[#B85C38] uppercase mb-4">
                  Why We Give
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 leading-tight mb-8">
                  Generosity is a way of participating in the work of God
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      title: "Worship",
                      desc: "Your gifts sustain a place where people encounter God through music, prayer, and the Word.",
                    },
                    {
                      title: "Community",
                      desc: "Funding ministries that build deep relationships and care for families across our city.",
                    },
                    {
                      title: "Compassion",
                      desc: "Supporting those in need through food, shelter, and practical help in Jesus’ name.",
                    },
                    {
                      title: "Mission",
                      desc: "Sending and sustaining workers who carry the gospel beyond our walls to the nations.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <h3 className="text-lg font-medium text-slate-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-xl">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT – Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-28"
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
        </div>
      </section>

      {/* ========== WHERE IT GOES ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-lg font-semibold tracking-[0.25em] text-[#B85C38]  uppercase mb-3">
                Where It Goes
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-slate-900 leading-tight">
                The tangible impact of
                <br className="hidden sm:block" /> your generosity
              </h2>
            </div>
            <button className="text-lg font-semibold tracking-widest text-slate-700 uppercase hover:text-slate-900 transition-colors self-start sm:self-auto">
              See Full Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Sustaining the Sanctuary",
                img: "/images/children1.jpg",
              },
              {
                title: "City Compassion",
                img: "/images/mimi.jpg",
              },
              {
                title: "Global Mission",
                img: "/images/serviceyouth.png",
              },
              {
                title: "Next Generation",
                img: "/images/umm.jpg",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="relative group overflow-hidden rounded-2xl aspect-16/10"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-5 left-5 text-white font-medium text-lg tracking-wide">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== QUOTE SECTION ========== */}
      <section className="bg-slate-900 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="text-5xl text-amber-500/80 font-serif leading-none">
              “
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-white leading-tight mt-4 mb-8">
              What we receive, we have the opportunity to share.
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Every gift is a seed planted into eternal purpose — funding
              worship, compassion, and mission that outlasts us all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== THREE IMAGE STRIP ========== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              "/images/childministries.png",
              "/images/mimi.jpg",
              "/images/311.jpg ",
            ].map((src, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative aspect-4/5 overflow-hidden rounded-2xl"
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-lg font-semibold tracking-[0.25em] text-[#B85C38] uppercase mb-3 text-center">
            Questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-slate-900 text-center mb-12">
            About Giving
          </h2>

          <div className="space-y-0">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-b border-slate-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="text-lg sm:text-xl font-medium text-slate-800 group-hover:text-slate-900 transition-colors pr-4">
                    {item.q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {openFaq === i ? (
                      <FaMinus className="text-lg" />
                    ) : (
                      <FaPlus className="text-lg" />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-slate-600 leading-relaxed text-lg">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}