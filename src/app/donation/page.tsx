// app/(routes)/donation/page.tsx
"use client";
import { DonationForm } from "./donation-form";
import { motion } from "framer-motion";
import {
  FaChurch,
  FaHandsHelping,
  FaHeart,
  FaPray,
  FaGift,
} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";

export default function DonationPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-blue-900 px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#60A5FA_0%,transparent_70%)] opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-36 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex justify-center gap-6 mb-8"
          >
           
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-light tracking-tighter leading-none mb-6 text-white font-serif"
          >
            Give Boldly.
            <br />
            <span className="text-red-500 font-medium">
              Impact Eternally.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-blue-100 max-w-2xl mx-auto font-light"
          >
            Your generosity powers lives, faith, and community transformation.
          </motion.p>

          {/* <motion.a
            href="#donation-form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-14 inline-flex items-center gap-4 bg-white text-slate-900 hover:bg-amber-400 hover:text-slate-900 font-semibold text-xl px-14 py-7 rounded-3xl shadow-2xl transition-all duration-300 group"
          >
            <MdOutlinePayment className="text-3xl group-hover:scale-110 transition" />
            Make a Donation
          </motion.a> */}
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

      {/* DONATION FORM SECTION */}
      <section id="donation-form" className="pt-20 pb-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-amber-100 text-amber-600 px-6 py-2.5 rounded-full mb-6 text-sm font-medium">
              <FaGift /> SECURE GIVING
            </div>
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 font-serif">
              Support God’s Work
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 md:p-16"
          >
            <DonationForm />
          </motion.div>
        </div>
      </section>

      {/* IMPACT SECTION - Scroll Triggered */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-light text-slate-800">
              Where Your Gift Makes an Impact
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaChurch,
                title: "Worship & Ministry",
                desc: "Fuel powerful services and discipleship",
              },
              {
                icon: FaHandsHelping,
                title: "Outreach & Charity",
                desc: "Feed the hungry and support the vulnerable",
              },
              {
                icon: FaHeart,
                title: "Youth & Next Generation",
                desc: "Raise bold leaders for Christ",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group bg-white p-10 rounded-3xl border border-slate-100 hover:border-amber-300 hover:shadow-xl transition-all duration-500"
              >
                <div className="text-6xl text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <item.icon />
                </div>
                <h4 className="text-2xl font-medium mb-4 text-slate-900">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
