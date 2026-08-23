"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

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

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function ParallaxImage({ src, alt, className = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

const Orb = ({ className }: { className?: string }) => (
  <div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
  />
);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const TABS = [
  {
    id: "vision",
    label: "Our vision",
    icon: "✦",
    heading: "A home for every hopeful heart.",
    body: "We imagine a church where faith feels close, questions are welcomed, and every person discovers they have a meaningful place in God's story.",
  },
  {
    id: "mission",
    label: "Our mission",
    icon: "✧",
    heading: "Faith that shows up every day.",
    body: "We exist to love God, love people, and serve our city with open hands and open hearts—making disciples who make disciples.",
  },
  {
    id: "approach",
    label: "Our approach",
    icon: "❋",
    heading: "Presence over performance.",
    body: "We walk slowly with people, create space for honest questions, and practice a faith that is both deeply rooted and radically welcoming.",
  },
];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("vision");

  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const activeContent = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="bg-site-bg overflow-x-hidden">
      {/* ══════════════════════════
          1. HERO
      ══════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#1a2530] px-6 py-20"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <img
            src="/images/fade.gif"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-white" />
            <span className="text-red-600 text-xl font-bold tracking-[0.25em] uppercase">
              Our Story
            </span>
            <div className="h-px w-12 bg-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight mb-8"
          >
            About <span className="text-red-600">Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A vibrant community of believers dedicated to worship, fellowship,
            and service sharing God&apos;s love every single day.
          </motion.p>
        </motion.div>

        {/* CURVY DIVIDER */}
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

      {/* ══════════════════════════
          2. ABOUT US  (matches first UI)
      ══════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-36 bg-[#F8F6F1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
            {/* LEFT — Image + badge */}
            <FadeUp className="relative order-1">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]"
                >
                  <ParallaxImage
                    src="/images/aboutimg2.png"
                    alt="Friends standing together at sunset"
                    className="w-full h-full"
                  />
                </motion.div>

                {/* Gold badge — bottom right of image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    delay: 0.45,
                  }}
                  className="absolute -bottom-4 -right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-10"
                >
                  <div className="bg-[#C4A35A] text-[#1a1a1a] rounded-xl px-5 py-4 sm:px-6 sm:py-5 shadow-xl text-center min-w-[110px]">
                    <div className="flex justify-center mb-1.5">
                      {/* Fixed complete SVG path */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="text-[#1a1a1a]"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <p className="text-2xl sm:text-3xl font-serif font-semibold leading-none tracking-tight">
                      16 years
                    </p>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mt-1.5 font-medium opacity-80">
                      OF GRACE
                    </p>
                  </div>
                </motion.div>
              </div>
            </FadeUp>

            {/* RIGHT — Content */}
            <div className="order-2">
              <FadeUp>
                <p className="text-[#B85C38] text-xs sm:text-sm tracking-[0.25em] font-semibold uppercase mb-5">
                  WHO WE ARE
                </p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h2 className="font-serif text-[2.4rem] sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem] leading-[1.12] tracking-tight text-[#1a1a1a] mb-6">
                  More than a
                  <br />
                  building.
                  <br />
                  <span className="text-[#B85C38]">A belonging.</span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.16}>
                <div className="space-y-5 text-[#5c5c5c] text-base sm:text-lg leading-relaxed max-w-lg">
                  <p>
                    We are a diverse family learning to follow Jesus together.
                    Our doors are open to the curious, the certain, the
                    searching, and the starting over.
                  </p>
                  <p>
                    There is room here for your whole story. Come find a people
                    who will walk with you through every season.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.28}>
                <Link
                  href="/our-story"
                  className="group inline-flex items-center gap-2 mt-10 text-[#B85C38] text-sm font-semibold tracking-[0.15em] uppercase hover:gap-3 transition-all duration-300"
                >
                  DISCOVER OUR STORY
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          3. OUR FOUNDATION  (matches second UI)
      ══════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-36 bg-[#0F1419] relative overflow-hidden">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          {/* Header */}
          <FadeUp className="mb-14 sm:mb-16 lg:mb-20">
            <p className="text-[#C45C3A] text-xs sm:text-sm tracking-[0.3em] font-semibold uppercase mb-5">
              OUR FOUNDATION
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] text-[#F5F0E8] leading-[1.15] max-w-2xl">
              A faith with its sleeves
              <br />
              rolled up.
            </h2>
          </FadeUp>

          {/* Split layout */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
            {/* LEFT — Tab list */}
            <div className="lg:col-span-5">
              <div className="flex flex-col">
                {TABS.map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`group relative flex items-center justify-between py-5 sm:py-6 border-t border-white/10 text-left transition-colors duration-300 ${
                        isActive
                          ? "text-[#E8A87C]"
                          : "text-white/55 hover:text-white/85"
                      }`}
                    >
                      <span
                        className={`text-lg sm:text-xl font-medium tracking-wide transition-colors duration-300 ${
                          isActive ? "text-[#E8A87C]" : ""
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`text-xl sm:text-2xl transition-all duration-300 ${
                          isActive
                            ? "text-[#E8A87C] translate-x-0"
                            : "text-white/30 group-hover:text-white/60 group-hover:translate-x-1"
                        }`}
                      >
                        ›
                      </span>
                      {/* active indicator line */}
                      {isActive && (
                        <motion.div
                          layoutId="foundation-active"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#E8A87C]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
                <div className="border-t border-white/10" />
              </div>
            </div>

            {/* RIGHT — Content panel */}
            <div className="lg:col-span-7 relative min-h-[220px] sm:min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeContent.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="pl-0 lg:pl-8 xl:pl-12 border-l-0 lg:border-l border-white/10"
                >
                  <div className="mb-5 sm:mb-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C4A35A]/10 text-[#C4A35A] text-lg">
                      {activeContent.icon}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-[#F5F0E8] leading-[1.2] mb-5 sm:mb-6 max-w-md">
                    {activeContent.heading}
                  </h3>

                  <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                    {activeContent.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          7. PASTOR'S MESSAGE
      ══════════════════════════ */}
      <section className="py-28 bg-site-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp className="relative">
              <div className="relative rounded-3xl overflow-hidden h-115 lg:h-145">
                <ParallaxImage
                  src="/images/pastorimg.jpg"
                  alt="Pastor"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-primary/30 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.3 }}
                className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center text-white text-5xl font-serif shadow-xl leading-none"
              >
                &ldquo;
              </motion.div>
            </FadeUp>

            <div>
              <FadeUp>
                <span className="inline-flex items-center gap-2 text-brand-secondary text-lg tracking-[4px] font-semibold uppercase mb-5">
                  <span className="block h-px w-8 bg-brand-secondary" />
                  Pastor&apos;s Message
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-brand-primary leading-tight mb-8">
                  Your generosity makes a{" "}
                  <span className="text-red-600">profound impact</span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-brand-primary font-semibold text-xl leading-relaxed mb-6">
                  Our mission is to share God&apos;s love, foster spiritual
                  growth, and serve our community with compassion and purpose.
                </p>
                <p className="text-site-muted text-lg leading-relaxed mb-12">
                  We would love to get to know you better. Feel free to reach
                  out to us through our Contact Us page, or join us for one of
                  our upcoming services or events. Our doors are always open,
                  and we look forward to welcoming you into our church family.
                </p>
              </FadeUp>

              <FadeUp delay={0.25}>
                <div className="flex items-center gap-6 mb-10">
                  <img
                    src="/images/pastors-signature.svg"
                    alt="Signature"
                    className="h-14 opacity-70"
                  />
                  <div>
                    <p className="text-brand-primary font-bold">
                      Senior Pastor
                    </p>
                    <p className="text-site-muted text-sm">
                      Lakeside Baptist Church
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.35}>
                <Link
                  href="/pastor"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-black text-white font-semibold hover:bg-blue-900 transition-colors duration-300 shadow-lg"
                >
                  Meet Our Pastor &rarr;
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
    PASTOR QUOTE SECTION  (matches first image)
══════════════════════════ */}
<section className="bg-[#9B2C2C] py-20 sm:py-24 lg:py-32 overflow-hidden">
  <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
      {/* LEFT — Quote */}
      <div className="order-2 lg:order-1">
        <FadeUp>
          <blockquote className="font-serif text-[1.85rem] sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem] leading-[1.25] text-[#F8EDE3] mb-8 sm:mb-10">
            “You don&apos;t have to
            <br className="hidden sm:block" />
            have it all together to
            <br className="hidden sm:block" />
            have a place here.”
          </blockquote>
        </FadeUp>

        <FadeUp delay={0.12}>
          <p className="text-[#E8C9B8] text-base sm:text-lg leading-relaxed max-w-md mb-8 sm:mb-10">
            We are becoming whole, together — through worship, honest
            friendship, and a faith that meets us exactly where we are.
          </p>
        </FadeUp>

        <FadeUp delay={0.22}>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#E8C9B8]/60" />
            <p className="text-[#E8C9B8] text-xs sm:text-sm tracking-[0.2em] uppercase font-medium">
              Senior Pastor · LBC
            </p>
          </div>
        </FadeUp>
      </div>

      {/* RIGHT — Image */}
      <FadeUp delay={0.1} className="order-1 lg:order-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/3] sm:aspect-[5/4] rounded-sm overflow-hidden shadow-2xl"
        >
          <ParallaxImage
            src="/images/aboutimg2.png"
            alt="Friends standing together at sunset"
            className="w-full h-full"
          />
        </motion.div>
      </FadeUp>
    </div>
  </div>
</section>

{/* ══════════════════════════
    CTA — YOUR NEXT CHAPTER  (matches second image)
══════════════════════════ */}
<section className="bg-[#F7F4EF] py-24 sm:py-28 lg:py-36 relative overflow-hidden">
  <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
    <FadeUp>
      <p className="text-[#9B2C2C] text-xs sm:text-sm tracking-[0.3em] font-semibold uppercase mb-6 sm:mb-8">
        YOUR NEXT CHAPTER
      </p>
    </FadeUp>

    <FadeUp delay={0.1}>
      <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.15] tracking-tight text-[#1C1C1C] mb-6 sm:mb-8">
        There is a seat
        <br />
        <span className="text-[#9B2C2C]">with your name on</span>
        <br />
        <span className="text-[#9B2C2C]">it.</span>
      </h2>
    </FadeUp>

    <FadeUp delay={0.2}>
      <p className="text-[#5C5C5C] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12">
        Join us this Sunday at 9:00 or 11:00 AM. Come early
        <br className="hidden sm:block" />
        for coffee. Stay for the conversation.
      </p>
    </FadeUp>

    <FadeUp delay={0.3}>
      <Link
        href="/visit"
        className="group inline-flex items-center gap-2.5 bg-[#9B2C2C] text-white px-8 py-4 sm:px-10 sm:py-4.5 text-sm font-semibold tracking-[0.12em] uppercase rounded-sm hover:bg-[#7A2222] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        PLAN YOUR VISIT
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          ↗
        </span>
      </Link>
    </FadeUp>
  </div>
</section>
    </div>
  );
}