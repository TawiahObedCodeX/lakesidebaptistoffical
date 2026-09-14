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
const schedule = [
  {
    time: "9:00 AM",
    title: "Sunday Worship",
    description: "Main sanctuary service with full choir.",
  },
  {
    time: "8:00 AM",
    title: "Bible Study",
    description: "Deep dive into the Word in the fellowship hall.",
  },
  {
    time: "6:00 PM",
    title: "Prayer Meeting",
    description: "Mid-week corporate prayer and intercession.",
  },
  {
    time: "First Sunday",
    title: "Communion",
    description: "Sacred time of remembrance and grace.",
  },
  {
    time: "6:00 PM",
    title: "Youth Service",
    description: "High energy worship and relevant teaching. friday evening",
  },
  {
    time: "Seasonal",
    title: "Special Programs",
    description: "Conferences, outreach, and holiday services.",
  },
];

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



/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function AboutPage() {


  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);



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
            <span className="text-red-400/90 text-xl font-bold tracking-[0.25em] uppercase">
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
            About <span className="text-red-400/90">Us</span>
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

      {/* ══════════════════════════
          3. OUR FOUNDATION  (matches second UI)
      ══════════════════════════ */}

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
                  <span className="text-[#B85C38]">profound impact</span>
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
      <section className="bg-blue-900/95 py-20 sm:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
            {/* LEFT — Quote */}
            <div className="order-2 lg:order-1">
              <FadeUp>
                <blockquote className="font-serif text-[1.85rem] sm:text-4xl lg:text-[2.75rem] xl:text-[3.1rem] leading-tight text-[#F8EDE3] mb-8 sm:mb-10">
                  “You don&apos;t have to
                  <br className="hidden sm:block" />
                  have it all together to
                  <br className="hidden sm:block" />
                  have a place here.”
                </blockquote>
              </FadeUp>

              <FadeUp delay={0.12}>
                <p className="text-[#E8C9B8] text-base sm:text-xl leading-relaxed max-w-md mb-8 sm:mb-10">
                  We are becoming whole, together — through worship, honest
                  friendship, and a faith that meets us exactly where we are.
                </p>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="flex items-center gap-3"></div>
              </FadeUp>
            </div>

            {/* RIGHT — Image */}
            <FadeUp delay={0.1} className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-4/3 sm:aspect-5/4 rounded-sm overflow-hidden shadow-2xl"
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
            <p className="text-[#5C5C5C] text-base sm:text-xl leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12">
              Join us this Sunday at 9:00 or 11:00 AM. Come early
              <br className="hidden sm:block" />
              for coffee. Stay for the conversation.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Link
              href="https://maps.app.goo.gl/Yz2cagLBaWCynadDA?g_st=ic"
              className="group inline-flex items-center gap-2.5 bg-blue-900 text-white px-8 py-4 sm:px-10 sm:py-4.5 text-sm font-semibold tracking-[0.12em] uppercase rounded-lg hover:bg-black transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-0.5"
            >
              PLAN YOUR VISIT
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ========== WEEKLY SCHEDULE ========== */}
      <section id="schedule" className="scroll-mt-28 py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-4"
            >
              Our Weekly Schedule
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Join us throughout the week for fellowship and growth.
            </motion.p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden sm:block" />

            <div className="space-y-12 sm:space-y-16">
              {schedule.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    className={`relative flex flex-col sm:flex-row items-center gap-6 sm:gap-0 ${
                      isLeft ? "sm:justify-start" : "sm:justify-end"
                    }`}
                  >
                    {/* Content card */}
                    <div
                      className={`w-full sm:w-[42%] ${
                        isLeft
                          ? "sm:text-right sm:pr-12"
                          : "sm:text-left sm:pl-12 sm:order-2"
                      }`}
                    >
                      <p className="text-lg font-medium text-black mb-1">
                        {item.time}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#B85C38] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-gray-300 shadow-sm z-10 hidden sm:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
