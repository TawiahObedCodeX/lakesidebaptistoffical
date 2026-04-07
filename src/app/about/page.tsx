"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useRef, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

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
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedCounterProps = {
  target: number;
  suffix?: string;
};

function AnimatedCounter({ target, suffix = "+" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let current = 0;
    const step = Math.ceil(target / 80);

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
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

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover scale-110"
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
   DATA  (all strings use straight ASCII quotes)
───────────────────────────────────────────── */

const TABS = [
  {
    id: "vision",
    label: "Our Vision",
    img: "/images/lbcimg3.jpeg",
    heading: "Our Vision to Serve,",
    accent: " Love, and Grow",
    subtitle:
      "Our vision is to share God's love, foster spiritual growth, and serve our community with compassion and purpose.",
    body: "Our vision is to serve our community with compassion, love unconditionally, and foster spiritual growth. Through dedicated service, heartfelt worship, and supportive fellowship, we strive to create a nurturing environment where individuals can deepen their faith, connect with others, and make a positive impact.",
  },
  {
    id: "mission",
    label: "Our Mission",
    img: "/images/lbcimg2.jpeg",
    heading: "Our Mission:",
    accent: " Faith in Action",
    subtitle:
      "Our mission is to share God's love, foster spiritual growth, and serve our community with compassion and purpose.",
    body: "Our vision is to serve our community with compassion, love unconditionally, and foster spiritual growth. Through dedicated service, heartfelt worship, and supportive fellowship, we strive to create a nurturing environment where individuals can deepen their faith, connect with others, and make a positive impact.",
  },
  {
    id: "approach",
    label: "Our Approach",
    img: "/images/lbcimg1.jpeg",
    heading: "Our Approach:",
    accent: " Rooted in Love",
    subtitle:
      "Our approach is to share God's love, foster spiritual growth, and serve our community with compassion and purpose.",
    body: "Our approach is to serve our community with compassion, love unconditionally, and foster spiritual growth. Through dedicated service, heartfelt worship, and supportive fellowship, we strive to create a nurturing environment where individuals can deepen their faith, connect with others, and make a positive impact.",
  },
];

const FAQS = [
  {
    id: "one",
    q: "Why is faith a core value?",
    a: "Faith is the starting point of a relationship with God. In Christianity, for example, without faith it is impossible to please God (Hebrews 11:6).",
  },
  {
    id: "two",
    q: "How does the church demonstrate love?",
    a: "Church leaders provide emotional and spiritual support during tough times - loss, illness, family problems.",
  },
  {
    id: "three",
    q: "How is community fostered within the church?",
    a: "Coming together for worship, prayer, and teaching helps create a shared experience and spiritual unity.",
  },
  {
    id: "four",
    q: "What is the importance of spiritual growth?",
    a: "As people grow spiritually, they come to know God more personally - not just through knowledge, but through experience, prayer, and trust.",
  },
  {
    id: "five",
    q: "How do these values shape church activities?",
    a: "Visiting the sick, comforting the grieving, and supporting people in crisis flow from Christ-like love.",
  },
];

const COUNTERS = [
  {
    value: 350,
    suffix: "+",
    label: "Oldest Member",
    desc: "Our oldest member is Mary Thompson, 95 years old, attending since 1945.",
  },
  {
    value: 98,
    suffix: "+",
    label: "Youth Retreats",
    desc: "Transformative annual retreats shaping the next generation of faithful leaders.",
  },
  {
    value: 148,
    suffix: "+",
    label: "Tech Workshops",
    desc: "Equipping our congregation with modern skills rooted in purpose.",
  },
  {
    value: 58,
    suffix: "+",
    label: "Christmas Concerts",
    desc: "Decades of joyful celebration bringing the community together.",
  },
];

const WHAT_WE_DO = [
  {
    icon: "/images/icon-what-we-1.svg",
    title: "Worship Services",
    desc: "Experience spiritual growth and meaningful connection through heartfelt worship and fellowship. Everyone is welcome to join us.",
    href: "/services",
  },
  {
    icon: "/images/icon-what-we-2.svg",
    title: "Community Outreach",
    desc: "Experience spiritual growth and meaningful connection through heartfelt worship and fellowship. Everyone is welcome to join us.",
    href: "/ministries",
  },
  {
    icon: "/images/icon-what-we-3.svg",
    title: "Educational Programs",
    desc: "Experience spiritual growth and meaningful connection through heartfelt worship and fellowship. Everyone is welcome to join us.",
    href: "/blog",
  },
];

const TEAM = [
  { img: "/images/yendork.JPG", name: "Joseph Yendork", role: "Youth Patron" },
  { img: "/images/team-2.jpg", name: "Sophia Simmons", role: "Pastor" },
  {
    img: "/images/team-3.jpg",
    name: "Savannah Nguyen",
    role: "Head of Worship Team",
  },
  {
    img: "/images/team-4.jpg",
    name: "Charlotte Wilson",
    role: "Head of Worship Team",
  },
];

const ABOUT_LIST = [
  { icon: "/images/icon-about-list-1.svg", label: "Share God's Love" },
  { icon: "/images/icon-about-list-2.svg", label: "Foster Spiritual Growth" },
  { icon: "/images/icon-about-list-3.svg", label: "Serve Our Community" },
  {
    icon: "/images/icon-about-list-4.svg",
    label: "Build Strong Relationships",
  },
];

const SOCIALS = ["facebook", "linkedin", "instagram", "twitter"] as const;
const CORE_IMAGES = ["/images/mimi.JPG", "/images/old.JPG", "/images/ga.JPG"];

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("vision");
  const [openFaq, setOpenFaq] = useState("one");

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
        className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <img
            src="/images/fade.gif"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-brand-primary/75 via-brand-primary/55 to-brand-primary/85" />
        </motion.div>

        <Orb className="w-96 h-96 bg-brand-accent/20 top-1/4 -left-24" />
        <Orb className="w-80 h-80 bg-brand-secondary/20 bottom-1/4 -right-20" />

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
            <div className="h-px w-12 bg-brand-accent" />
            <span className="text-brand-accent tracking-[4px] text-xs font-semibold uppercase">
              Our Story
            </span>
            <div className="h-px w-12 bg-brand-accent" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8"
          >
            About <span className="text-[var(--color-brand-accent)]">Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A vibrant community of believers dedicated to worship, fellowship,
            and service &mdash; sharing God&apos;s love every single day.
          </motion.p>

          {/* <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-10 flex items-center justify-center gap-2 text-white/50 text-sm"
          >
            <Link href="/" className="hover:text-[var(--color-brand-accent)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--color-brand-accent)]">About Us</span>
          </motion.nav> */}
        </motion.div>
      </section>

      {/* ══════════════════════════
          2. ABOUT US
      ══════════════════════════ */}
      <section className="py-28 lg:py-36 bg-white relative overflow-hidden">
        <Orb className="w-[480px] h-[480px] bg-[var(--color-brand-accent)]/6 -top-40 -right-40" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Images */}
            <FadeUp className="relative">
              <div className="relative h-[520px] lg:h-[620px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 left-0 w-[75%] h-[75%] rounded-3xl overflow-hidden shadow-2xl"
                >
                  <ParallaxImage
                    src="/images/REV EDGAR.jpg"
                    alt="Church community"
                    className="w-full h-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 right-0 w-[65%] h-[65%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                >
                  <ParallaxImage
                    src="/images/girls.jpg"
                    alt="Girls"
                    className="w-full h-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 160, delay: 0.45 }}
                  className="absolute top-[46%] right-[8%] bg-[var(--color-brand-primary)] text-white rounded-2xl p-5 shadow-2xl z-10 text-center"
                >
                  <p className="text-4xl font-bold text-[var(--color-brand-accent)] leading-none">
                    50+
                  </p>
                  <p className="text-[10px] tracking-widest text-white/70 uppercase mt-2">
                    Years of Grace
                  </p>
                </motion.div>
              </div>
            </FadeUp>

            {/* Content */}
            <div>
              <FadeUp>
                <span className="inline-flex items-center gap-2 text-[var(--color-brand-secondary)] text-xs tracking-[4px] font-semibold uppercase mb-5">
                  <span className="block h-px w-8 bg-[var(--color-brand-secondary)]" />
                  About Us
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-[var(--color-brand-primary)] leading-[1.1] mb-6">
                  Faith, hope, and love in{" "}
                  <span className="text-[var(--color-brand-accent)]">
                    action every day
                  </span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-[var(--color-site-muted)] text-lg leading-relaxed mb-5">
                  We are a vibrant community of believers dedicated to worship,
                  fellowship, and service. Our mission is to share God&apos;s
                  love, grow in faith, and make a positive impact in the world
                  through compassionate outreach and meaningful connections.
                </p>
                <p className="text-site-muted text-lg leading-relaxed mb-10">
                  Our church is a welcoming place where everyone can find
                  support, inspiration, and a sense of belonging. Together, we
                  strive to live out our faith and make a difference.
                </p>
              </FadeUp>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ABOUT_LIST.map((item, i) => (
                  <FadeUp key={i} delay={0.2 + i * 0.1}>
                    <motion.div
                      whileHover={{
                        x: 6,
                        backgroundColor: "rgba(201,166,107,0.08)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-divider-dark cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-accent-muted flex items-center justify-center shrink-0">
                        <img src={item.icon} alt="" className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-brand-primary text-[15px]">
                        {item.label}
                      </h4>
                    </motion.div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          3. VISION / MISSION / APPROACH
      ══════════════════════════ */}
      <section className="py-28 bg-brand-primary relative overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-brand-accent/10 -top-32 left-1/2 -translate-x-1/2" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <FadeUp className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-brand-accent text-xs tracking-[4px] font-semibold uppercase mb-5">
              <span className="block h-px w-8 bg-brand-accent" />
              Our Foundation
              <span className="block h-px w-8 bg-brand-accent" />
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
              Building Faithful Community Through Love, Service,{" "}
              <span className="text-brand-accent">
                Worship, and Fellowship.
              </span>
            </h2>
          </FadeUp>

          <FadeUp
            delay={0.15}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-brand-accent text-brand-primary"
                    : "border border-white/20 text-white/70 hover:border-brand-accent hover:text-brand-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </FadeUp>

          <AnimatePresence mode="wait">
            {TABS.filter((t) => t.id === activeTab).map((tab) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white leading-snug mb-6">
                    {tab.heading}
                    <span className="text-brand-accent">{tab.accent}</span>
                  </h3>
                  <p className="text-white/90 text-xl font-medium leading-relaxed mb-5">
                    {tab.subtitle}
                  </p>
                  <p className="text-white/60 text-base leading-relaxed">
                    {tab.body}
                  </p>
                  <Link
                    href="/services"
                    className="mt-10 inline-flex items-center gap-3 text-brand-accent font-semibold"
                  >
                    Learn More
                    <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      &rarr;
                    </motion.span>
                  </Link>
                </div>

                <div className="relative h-72 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden">
                  <ParallaxImage
                    src={tab.img}
                    alt={tab.label}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-primary/50 to-transparent" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════
          4. COUNTERS
      ══════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,166,107,0.07),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {COUNTERS.map((c, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: "0 24px 60px rgba(44,62,80,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="p-8 rounded-3xl border border-divider-dark bg-white text-center group cursor-default"
                >
                  <div className="text-5xl sm:text-6xl font-bold text-brand-primary mb-2 group-hover:text-brand-accent transition-colors duration-300">
                    <AnimatedCounter target={c.value} suffix={c.suffix} />
                  </div>
                  <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-widest mb-3">
                    {c.label}
                  </h4>
                  <p className="text-site-muted text-sm leading-relaxed">
                    {c.desc}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          5. WHAT WE DO
      ══════════════════════════ */}
      <section className="py-28 bg-site-bg relative overflow-hidden">
        <Orb className="w-80 h-80 bg-brand-secondary/10 bottom-0 left-0" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <FadeUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-brand-secondary text-xs tracking-[4px] font-semibold uppercase mb-4">
              <span className="block h-px w-8 bg-brand-secondary" />
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-brand-primary">
              Living Our{" "}
              <span className="text-brand-accent">Faith Together</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {WHAT_WE_DO.map((w, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 220 }}
                  className="group relative bg-white rounded-3xl p-10 shadow-[0_4px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(44,62,80,0.14)] transition-shadow duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="w-16 h-16 rounded-2xl bg-brand-accent-muted flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <img src={w.icon} alt="" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-primary mb-4">
                    {w.title}
                  </h3>
                  <p className="text-site-muted leading-relaxed text-[15px]">
                    {w.desc}
                  </p>
                  <Link
                    href={w.href}
                    className="mt-8 inline-flex items-center gap-2 text-brand-secondary text-sm font-semibold group-hover:text-brand-accent transition-colors"
                  >
                    Explore &rarr;
                  </Link>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          6. OUR TEAM
      ══════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <FadeUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-brand-secondary)] text-xs tracking-[4px] font-semibold uppercase mb-4">
              <span className="block h-px w-8 bg-[var(--color-brand-secondary)]" />
              Our Team
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-brand-primary)]">
              Meet Our{" "}
              <span className="text-[var(--color-brand-accent)]">
                Pastors &amp; Deacons
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TEAM.map((member, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ type: "spring", stiffness: 220 }}
                  className="group"
                >
                  <div className="relative rounded-3xl overflow-hidden mb-5 aspect-[3/4]">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-primary)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div className="flex gap-2">
                        {SOCIALS.map((s) => (
                          <motion.a
                            key={s}
                            href="#"
                            whileHover={{ scale: 1.2, y: -3 }}
                            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-brand-primary)] transition-colors text-sm"
                          >
                            <Icon name={s} />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-[var(--color-brand-primary)] text-lg capitalize mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[var(--color-brand-secondary)] text-sm font-medium capitalize">
                    {member.role}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          7. PASTOR'S MESSAGE
      ══════════════════════════ */}
      <section className="py-28 bg-[var(--color-site-bg)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp className="relative">
              <div className="relative rounded-3xl overflow-hidden h-[460px] lg:h-[580px]">
                <ParallaxImage
                  src="/images/lol1 (2).jpg"
                  alt="Pastor"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-primary)]/30 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.3 }}
                className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl bg-[var(--color-brand-accent)] flex items-center justify-center text-[var(--color-brand-primary)] text-5xl font-serif shadow-xl leading-none"
              >
                &ldquo;
              </motion.div>
            </FadeUp>

            <div>
              <FadeUp>
                <span className="inline-flex items-center gap-2 text-[var(--color-brand-secondary)] text-xs tracking-[4px] font-semibold uppercase mb-5">
                  <span className="block h-px w-8 bg-[var(--color-brand-secondary)]" />
                  Pastor&apos;s Message
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-brand-primary)] leading-tight mb-8">
                  Your generosity makes a{" "}
                  <span className="text-[var(--color-brand-accent)]">
                    profound impact
                  </span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-[var(--color-brand-primary)] font-semibold text-xl leading-relaxed mb-6">
                  Our mission is to share God&apos;s love, foster spiritual
                  growth, and serve our community with compassion and purpose.
                </p>
                <p className="text-[var(--color-site-muted)] text-lg leading-relaxed mb-12">
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
                    <p className="text-[var(--color-brand-primary)] font-bold">
                      Senior Pastor
                    </p>
                    <p className="text-[var(--color-site-muted)] text-sm">
                      Lakeside Baptist Church
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.35}>
                <Link
                  href="/pastor"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[var(--color-brand-primary)] text-white font-semibold hover:bg-[var(--color-brand-primary-dark)] transition-colors duration-300 shadow-lg"
                >
                  Meet Our Pastor &rarr;
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          8. CORE VALUES
      ══════════════════════════ */}
      <section className="py-28 bg-[var(--color-brand-primary)] relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-[var(--color-brand-secondary)]/15 -bottom-40 -left-40" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Foundations of Our Faith and{" "}
              <span className="text-[var(--color-brand-accent)]">
                Community Life
              </span>
            </h2>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeUp>
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <motion.div
                    key={faq.id}
                    layout
                    className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === faq.id ? "" : faq.id)
                      }
                      className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <span className="text-white font-semibold text-[15px] leading-snug">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: openFaq === faq.id ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[var(--color-brand-accent)] text-2xl flex-shrink-0 font-light"
                      >
                        +
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openFaq === faq.id && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-white/65 text-[15px] leading-relaxed border-t border-white/10 pt-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            {/* <FadeUp delay={0.2}>
              <div className="relative h-[380px] sm:h-[500px]">
                {CORE_IMAGES.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, y: 30, rotate: (i - 1) * 5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: (i - 1) * 5 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                    whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
                    className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 cursor-pointer"
                    style={{ zIndex: 3 - i }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-primary)]/30 to-transparent" />
                  </motion.div>
                ))}
                <p className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-[10px] tracking-widest uppercase z-20">
                  Hover to explore
                </p>
              </div>
            </FadeUp> */}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          9. CTA STRIP
      ══════════════════════════ */}
      {/* <section className="py-20 bg-[var(--color-brand-accent)] relative overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-brand-primary)] mb-5">
              Ready to join our community?
            </h2>
            <p className="text-[var(--color-brand-primary)]/70 text-lg mb-10 max-w-xl mx-auto">
              Whether you&apos;re new to faith or looking for a spiritual home,
              our doors are always open.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="px-10 py-4 rounded-full bg-[var(--color-brand-primary)] text-white font-bold text-base hover:bg-[var(--color-brand-primary-dark)] transition-colors shadow-lg"
              >
                Join a Service &rarr;
              </Link>
              <Link
                href="/donation"
                className="px-10 py-4 rounded-full border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-bold text-base hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"
              >
                Give Online
              </Link>
            </div>
          </FadeUp>
        </div>
      </section> */}
    </div>
  );
}
