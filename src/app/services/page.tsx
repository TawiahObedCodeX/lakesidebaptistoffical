"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import {
  FaChild,
  FaMusic,
  FaGlobe,
  FaHeart,
  FaUserFriends,
  FaClock,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const featuredSermons = [
  {
    id: 1,
    category: "THEOLOGY",
    day: "14",
    month: "MAY",
    preacher: "DR. MARCUS THORNE",
    duration: "42 MIN",
    title: "The Architecture of Grace",
    img: "/images/pastorimg.jpg", // replace with your actual image
    featured: true,
  },
  {
    id: 2,
    category: "SPIRITUAL GROWTH",
    day: "07",
    month: "MAY",
    preacher: "SARAH JENKINS",
    duration: "35 MIN",
    title: "Walking in Stillness",
    img: "/images/pastorimg.jpg",
    featured: false,
  },
  {
    id: 3,
    category: "FAITH",
    day: "30",
    month: "APR",
    preacher: "DR. MARCUS THORNE",
    duration: "38 MIN",
    title: "The Unseen Hand",
    img: "/images/pastorimg.jpg",
    featured: false,
  },
];

const serviceTimes = [
  {
    day: "SUNDAY",
    time: "8:00 – 11:00",
    period: "AM",
    label: "Main Worship Service",
    icon: <FaClock className="w-4 h-4" />,
  },
  {
    day: "WEDNESDAY",
    time: "7:00 – 8:30",
    period: "PM",
    label: "Midweek Prayer & Study",
    icon: <FaClock className="w-4 h-4" />,
  },
  {
    day: "ONLINE",
    time: "Every",
    period: "Sunday",
    label: "Live Stream Available",
    icon: <FaMusic className="w-4 h-4" />,
  },
];

const ministries = [
  {
    id: "01",
    icon: <FaChild className="w-5 h-5" />,
    title: "Children's Ministry",
    desc: "Nurturing the next generation in a fun, safe, and Christ-centered environment.",
  },
  {
    id: "02",
    icon: <FaMusic className="w-5 h-5" />,
    title: "Youth Ministry",
    desc: "Empowering teens to live out their faith boldly in today's world.",
  },
  {
    id: "03",
    icon: <FaMusic className="w-5 h-5" />,
    title: "Worship Team",
    desc: "Leading our community into God's presence through music and creativity.",
  },
  {
    id: "04",
    icon: <FaGlobe className="w-5 h-5" />,
    title: "Outreach & Missions",
    desc: "Extending God's love to our local community and beyond.",
  },
  {
    id: "05",
    icon: <FaHeart className="w-5 h-5" />,
    title: "Marriage & Family",
    desc: "Strengthening bonds through biblical principles and shared experiences.",
  },
  {
    id: "06",
    icon: <FaUserFriends className="w-5 h-5" />,
    title: "Men's Ministry",
    desc: "Building strong men of character through fellowship and service.",
  },
];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {/* 1. HERO — untouched */}
      <PageHero
        eyebrow="Our Services"
        title="Experience God Like Never Before"
        subtitle="Join us for powerful worship, life-changing messages, and a loving community"
        imageSrc="/images/lbcimg3.jpeg"
      />

      {/* ═══════════════════════════════════════
          2. FEATURED TEACHINGS
      ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-16">
            <div className="max-w-xl">
              <FadeUp>
                <p className="text-[11px] sm:text-xs tracking-[0.25em] font-semibold uppercase text-slate-500 mb-4">
                  FEATURED TEACHINGS
                </p>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.1] tracking-tight text-[#1a1a1a]">
                  Life-Changing
                  <br />
                  Truths
                </h2>
              </FadeUp>
              <FadeUp delay={0.14}>
                <p className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed max-w-md">
                  Explore our latest messages designed to challenge your thinking and
                  nourish your spirit.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.18}>
              <Link
                href="/sermons"
                className="inline-flex items-center justify-center border border-slate-300 px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                BROWSE ARCHIVE
              </Link>
            </FadeUp>
          </div>

          {/* Sermon Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Large featured card */}
            <FadeUp className="lg:col-span-7">
              <div className="group relative overflow-hidden rounded-sm bg-slate-100">
                <div className="relative aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={featuredSermons[0].img}
                    alt={featuredSermons[0].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Category */}
                  <span className="absolute top-5 left-5 text-[10px] tracking-[0.2em] font-semibold uppercase text-white/90">
                    {featuredSermons[0].category}
                  </span>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-lg hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] font-semibold uppercase text-white">
                    LISTEN PREVIEW
                  </span>
                </div>

                {/* Meta */}
                <div className="p-6 sm:p-8 bg-white">
                  <div className="flex items-start gap-5">
                    <div className="text-center shrink-0">
                      <p className="text-3xl font-serif font-medium leading-none text-[#1a1a1a]">
                        {featuredSermons[0].day}
                      </p>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-slate-500 mt-1">
                        {featuredSermons[0].month}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">
                            ♂
                          </span>
                          {featuredSermons[0].preacher}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="opacity-60">⏱</span>
                          {featuredSermons[0].duration}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-[1.7rem] text-[#1a1a1a] leading-snug">
                        {featuredSermons[0].title}
                      </h3>
                      <Link
                        href={`/sermons/${featuredSermons[0].id}`}
                        className="inline-flex items-center gap-2 mt-4 text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        VIEW SERMON <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Right column – two smaller cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
              {featuredSermons.slice(1).map((sermon, i) => (
                <FadeUp key={sermon.id} delay={0.1 + i * 0.08}>
                  <div className="group relative overflow-hidden rounded-sm bg-slate-100">
                    <div className="relative aspect-[16/9]">
                      <img
                        src={sermon.img}
                        alt={sermon.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/25" />
                      <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] font-semibold uppercase text-white/90">
                        {sermon.category}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 shadow-md hover:scale-105 transition-transform">
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] font-semibold uppercase text-white">
                        LISTEN PREVIEW
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 bg-white">
                      <div className="flex items-start gap-4">
                        <div className="text-center shrink-0">
                          <p className="text-2xl font-serif font-medium leading-none text-[#1a1a1a]">
                            {sermon.day}
                          </p>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-slate-500 mt-0.5">
                            {sermon.month}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-1.5">
                            <span className="flex items-center gap-1.5">
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">
                                ♂
                              </span>
                              {sermon.preacher}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="opacity-60">⏱</span>
                              {sermon.duration}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl text-[#1a1a1a] leading-snug">
                            {sermon.title}
                          </h3>
                          <Link
                            href={`/sermons/${sermon.id}`}
                            className="inline-flex items-center gap-2 mt-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-700 hover:text-slate-900 transition-colors"
                          >
                            VIEW SERMON <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. THE WEEKLY RHYTHM
      ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-24 lg:py-28 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-14 lg:mb-16">
            <FadeUp>
              <p className="text-[11px] sm:text-xs tracking-[0.3em] font-semibold uppercase text-slate-500 mb-4">
                THE WEEKLY RHYTHM
              </p>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.15] tracking-tight text-[#1a1a1a]">
                Make Room for What
                <br />
                Matters
              </h2>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200/80 rounded-sm overflow-hidden shadow-sm">
            {serviceTimes.map((item, i) => (
              <FadeUp key={item.day} delay={0.1 + i * 0.08}>
                <div className="bg-white px-8 py-12 sm:py-14 text-center h-full flex flex-col items-center">
                  <div className="text-slate-400 mb-6">{item.icon}</div>
                  <p className="text-[11px] tracking-[0.2em] font-semibold uppercase text-slate-500 mb-4">
                    {item.day}
                  </p>
                  <p className="font-serif text-3xl sm:text-4xl text-[#1a1a1a] leading-none">
                    {item.time}
                  </p>
                  <p className="font-serif text-3xl sm:text-4xl text-[#1a1a1a] mt-1">
                    {item.period}
                  </p>
                  <p className="mt-5 text-sm text-slate-500">{item.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. MINISTRIES – Find Your Place
      ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-16">
            <div className="max-w-xl">
              <FadeUp>
                <p className="text-[11px] sm:text-xs tracking-[0.25em] font-semibold uppercase text-slate-500 mb-4">
                  MINISTRIES
                </p>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.1] tracking-tight text-[#1a1a1a]">
                  Find Your Place
                </h2>
              </FadeUp>
              <FadeUp delay={0.14}>
                <p className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed max-w-md">
                  There is a place for every season, every age, and every story. Discover
                  where you belong in the Lakeside family.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.18}>
              <Link
                href="/ministries"
                className="inline-flex items-center gap-2 border border-slate-300 px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                ALL COMMUNITIES <span>→</span>
              </Link>
            </FadeUp>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {ministries.map((m, i) => (
              <FadeUp key={m.id} delay={0.06 + i * 0.05}>
                <div className="group relative h-full bg-[#FAFAF9] border border-slate-100 rounded-sm p-7 sm:p-8 flex flex-col transition-all duration-300 hover:border-slate-200 hover:shadow-sm">
                  {/* Number + Icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-slate-300 transition-colors">
                      {m.icon}
                    </div>
                    <span className="text-4xl font-serif text-slate-200/80 leading-none select-none">
                      {m.id}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-[1.35rem] text-[#1a1a1a] mb-3">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed grow mb-6">
                    {m.desc}
                  </p>

                  <Link
                    href="/ministries"
                    className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-700 group-hover:text-slate-900 transition-colors"
                  >
                    LEARN MORE <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}