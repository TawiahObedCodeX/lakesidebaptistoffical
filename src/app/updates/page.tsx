"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";

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
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const featuredSermon = {
  label: "SERMON",
  title: "This Week's Sermon: Embracing Forgiveness",
  excerpt:
    "Learning to forgive is the first step to freedom. A reflection on the power of letting go and the grace found in reconciliation. Join us as we explore what it means to forgive.",
  date: "Feb 2, 2026",
  readTime: "6 min read",
  image: "/images/Blessing.jpg",
  href: "/blog/1",
};

const journalPosts = [
  {
    id: 1,
    category: "COMMUNITY",
    title: "Walking in Faith Daily",
    excerpt:
      "Finding the sacred in the ordinary moments of our everyday lives and how small practices lead to deeper faith.",
    image: "/images/khady.jpg",
    href: "/blog/3",
    featured: true,
  },
  {
    id: 2,
    category: "BIBLE STUDY",
    title: "The Parables of Jesus",
    date: "JAN 15",
    readTime: "8 MIN READ",
    image: "/images/biblestudies.jpg",
    href: "/blog/5",
  },
  {
    id: 3,
    category: "REFLECTION",
    title: "Finding Peace in Stillness",
    date: "JAN 12",
    readTime: "5 MIN READ",
    image: "/images/aboutimg4.jpeg",
    href: "/blog/6",
  },
  {
    id: 4,
    category: "OUTREACH",
    title: "Helping Hands Program",
    date: "JAN 08",
    readTime: "10 MIN READ",
    image: "/images/choir.jpg",
    href: "/blog/4",
  },
];

const upcomingEvents = [
  {
    day: "24",
    month: "DEC",
    title: "Christmas Eve Service",
    time: "7:00 PM",
    location: "MAIN SANCTUARY",
    image: "/images/church-hero.jpg",
  },
  {
    day: "05",
    month: "JAN",
    title: "Community Breakfast",
    time: "9:00 AM",
    location: "FELLOWSHIP HALL",
    image: "/images/khady.jpg",
  },
  {
    day: "18",
    month: "FEB",
    title: "Night of Worship",
    time: "8:00 PM",
    location: "AUDITORIUM",
    image: "/images/choir.jpg",
  },
];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  return (
    <main className="bg-site-bg overflow-x-hidden">
      {/* NAVBAR — untouched */}
      <SiteHeader />

      {/* ══════════════════════════
          1. HERO (same structure, refined text layout)
      ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#1a2530]"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image
            src="/images/church-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/75" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10 bg-white/70" />
            <span className="text-red-500 text-sm sm:text-base font-semibold tracking-[0.28em] uppercase">
              Journal
            </span>
            <div className="h-px w-10 bg-white/70" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            Inspiring Stories
            <br />
            <span className="text-white/90">&amp; Sermons</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/75 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Dive into our latest sermons, reflections, and faith-building
            insights. Explore, reflect, and grow with us.
          </motion.p>
        </motion.div>

        {/* CURVY DIVIDER */}
        <div className="absolute bottom-0 left-0 w-full -mb-1 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 sm:h-20 md:h-24 lg:h-28 fill-white"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════
          2. FEATURED SERMON  (matches first screenshot)
      ══════════════════════════ */}
      <section className="bg-[#F8F6F1] py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">
            {/* Image */}
            <FadeUp>
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]">
                <Image
                  src={featuredSermon.image}
                  alt={featuredSermon.title}
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>

            {/* Text */}
            <div>
              <FadeUp>
                <p className="text-[#9B2C2C] text-lg sm:text-xl tracking-[0.3em] font-semibold uppercase mb-5">
                  {featuredSermon.label}
                </p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
                  This Week&apos;s
                  <br />
                  Sermon:
                  <br />
                  <span className="text-[#1a1a1a]">Embracing</span>
                  <br />
                  Forgiveness
                </h2>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="text-[#5c5c5c] text-lg sm:text-xl leading-relaxed max-w-lg mb-8">
                  {featuredSermon.excerpt}
                </p>
              </FadeUp>

              <FadeUp delay={0.24}>
                <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm text-[#6b6b6b] mb-10">
                  <div>
                    <p className="text-xl tracking-[0.2em] uppercase text-[#9a9a9a] mb-1">
                      Date
                    </p>
                    <p className="font-medium text-[#1a1a1a] text-lg">
                      {featuredSermon.date}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-[#ddd]" />
                  <div>
                    <p className="text-xl tracking-[0.2em] uppercase text-[#9a9a9a] mb-1">
                      Read Time
                    </p>
                    <p className="font-medium text-[#1a1a1a] text-lg">
                      {featuredSermon.readTime}
                    </p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          3. LATEST UPDATES / JOURNAL  (matches second screenshot)
      ══════════════════════════ */}
      <section className="bg-[#F8F6F1] pb-20 sm:pb-28 lg:pb-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
            <FadeUp>
              <p className="text-[#9B2C2C] text-sm sm:text-lg tracking-[0.3em] font-semibold uppercase mb-3">
                Journal
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] leading-tight">
                Latest Updates
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[#6b6b6b] text-lg sm:text-xl max-w-xs leading-relaxed">
                Exploring faith, community, and the stories that shape our
                journey together.
              </p>
            </FadeUp>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Featured large post */}
            <FadeUp className="lg:col-span-7">
              <Link href={journalPosts[0].href} className="group block">
                <div className="relative aspect-16/11 sm:aspect-16/10 rounded-xl overflow-hidden mb-6 shadow-md">
                  <Image
                    src={journalPosts[0].image}
                    alt={journalPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-[#9B2C2C] text-lg tracking-[0.25em] font-semibold uppercase mb-2">
                  {journalPosts[0].category}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1a1a1a] leading-snug mb-3 group-hover:text-[#9B2C2C] transition-colors duration-300">
                  {journalPosts[0].title}
                </h3>
                <p className="text-[#5c5c5c] text-xl leading-relaxed max-w-lg mb-4">
                  {journalPosts[0].excerpt}
                </p>
              </Link>
            </FadeUp>

            {/* Side list */}
            <div className="lg:col-span-5 flex flex-col gap-7 sm:gap-8">
              {journalPosts.slice(1).map((post, idx) => (
                <FadeUp key={post.id} delay={0.1 + idx * 0.08}>
                  <Link
                    href={post.href}
                    className="group flex gap-5 items-start"
                  >
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[#9B2C2C] text-sm sm:text-lg tracking-[0.22em] font-semibold uppercase mb-1.5">
                        {post.category}
                      </p>
                      <h4 className="font-serif text-lg sm:text-xl text-[#1a1a1a] leading-snug mb-2 group-hover:text-[#9B2C2C] transition-colors duration-300">
                        {post.title}
                      </h4>
                      <p className="text-[#8a8a8a] text-sm tracking-wide">
                        {post.date} · {post.readTime}
                      </p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          4. FAITH IN EVERYDAY LIFE  (matches third screenshot)
      ══════════════════════════ */}
      <section className="bg-[#0F1419] py-20 sm:py-28 lg:py-36 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
            {/* Text */}
            <div>
              <FadeUp>
                <p className="text-red-500 text-xs sm:text-sm tracking-[0.28em] font-semibold uppercase mb-6">
                  Faith in Everyday Life
                </p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.9rem] xl:text-[3.4rem] text-[#F5F0E8] leading-[1.15] mb-6">
                  The moments
                  <br />
                  between
                  <br />
                  Sundays
                  <br />
                  matter, too.
                </h2>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-md mb-10">
                  Our faith isn&apos;t just for the sanctuary. It&apos;s for the
                  boardroom, the kitchen table, and the quiet walks at dusk.
                  Explore how we live out our calling in the rhythms of the
                  week.
                </p>
              </FadeUp>
            </div>

            {/* Image + quote card */}
            <FadeUp delay={0.1} className="relative">
              <div className="relative aspect-4/5 sm:aspect-5/6 rounded-sm overflow-hidden">
                <Image
                  src="/images/aboutimg2.png"
                  alt="City lights at night"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Quote overlay */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-6 sm:right-auto sm:max-w-70 bg-[#0F1419]/95 backdrop-blur-sm border border-white/10 p-5 sm:p-6"
              >
                <p className="font-serif text-white text-lg sm:text-xl leading-snug italic mb-3">
                  &ldquo;Grace is not a Sunday event; it is a daily
                  rhythm.&rdquo;
                </p>
                <p className="text-white/50 text-sm tracking-[0.2em] uppercase">
                  A Daily Reflection
                </p>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          5. UPCOMING EVENTS  (matches fourth screenshot)
      ══════════════════════════ */}
      <section className="bg-[#F8F6F1] py-20 sm:py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp className="text-center mb-14 sm:mb-16">
            <p className="text-[#9B2C2C] text-xs sm:text-lg tracking-[0.3em] font-semibold uppercase mb-4">
              Calendar
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a]">
              Upcoming Events
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {upcomingEvents.map((event, idx) => (
              <FadeUp key={event.title} delay={idx * 0.1}>
                <article className="group">
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-5 shadow-md">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-center shrink-0">
                      <p className="font-serif text-3xl sm:text-4xl font-medium text-[#1a1a1a] leading-none">
                        {event.day}
                      </p>
                      <p className="text-sm tracking-[0.15em] uppercase text-[#9B2C2C] mt-1 font-semibold">
                        {event.month}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-2xl text-[#1a1a1a] leading-snug mb-1.5">
                        {event.title}
                      </h3>
                      <p className="text-[#6b6b6b] text-sm sm:text-lg leading-relaxed tracking-wide">
                        {event.time} · {event.location}
                      </p>
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          6. COMMUNITY / HELPING HANDS  (matches fifth screenshot)
      ══════════════════════════ */}
      <section className="bg-[#F8F6F1] pb-24 sm:pb-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Image */}
            <FadeUp>
              <div className="relative aspect-4/5 sm:aspect-5/6 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)]">
                <Image
                  src="/images/aboutimg4.jpeg"
                  alt="Community serving together"
                  fill
                  className="object-cover"
                />
                {/* subtle decorative frame accent */}
                <div className="absolute -top-3 -right-3 w-24 h-24 border border-[#C4A35A]/40 rounded-sm pointer-events-none hidden sm:block" />
              </div>
            </FadeUp>

            {/* Text */}
            <div>
              <FadeUp>
                <p className="text-[#9B2C2C] text-xs sm:text-lg tracking-[0.3em] font-semibold uppercase mb-5">
                  Community
                </p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
                  Hands that serve.
                  <br />
                  Hearts that care.
                </h2>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="text-[#5c5c5c] text-base sm:text-xl leading-relaxed max-w-md mb-10">
                  Our Helping Hands program is the heartbeat of our community
                  engagement. Join us as we serve our local neighborhood through
                  practical help and meaningful connection.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}