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

// const FAQS = [
//   {
//     id: "one",
//     q: "Why is faith a core value?",
//     a: "Faith is the starting point of a relationship with God. In Christianity, for example, without faith it is impossible to please God (Hebrews 11:6).",
//   },
//   {
//     id: "two",
//     q: "How does the church demonstrate love?",
//     a: "Church leaders provide emotional and spiritual support during tough times - loss, illness, family problems.",
//   },
//   {
//     id: "three",
//     q: "How is community fostered within the church?",
//     a: "Coming together for worship, prayer, and teaching helps create a shared experience and spiritual unity.",
//   },
//   {
//     id: "four",
//     q: "What is the importance of spiritual growth?",
//     a: "As people grow spiritually, they come to know God more personally - not just through knowledge, but through experience, prayer, and trust.",
//   },
//   {
//     id: "five",
//     q: "How do these values shape church activities?",
//     a: "Visiting the sick, comforting the grieving, and supporting people in crisis flow from Christ-like love.",
//   },
// ];

// const COUNTERS = [
//   {
//     value: 350,
//     suffix: "+",
//     label: "Oldest Member",
//     desc: "Our oldest member is Mary Thompson, 95 years old, attending since 1945.",
//   },
//   {
//     value: 98,
//     suffix: "+",
//     label: "Youth Retreats",
//     desc: "Transformative annual retreats shaping the next generation of faithful leaders.",
//   },
//   {
//     value: 148,
//     suffix: "+",
//     label: "Tech Workshops",
//     desc: "Equipping our congregation with modern skills rooted in purpose.",
//   },
//   {
//     value: 58,
//     suffix: "+",
//     label: "Christmas Concerts",
//     desc: "Decades of joyful celebration bringing the community together.",
//   },
// ];

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

// const ABOUT_LIST = [
//   { icon: "/images/icon-about-list-1.svg", label: "Share God's Love" },
//   { icon: "/images/icon-about-list-2.svg", label: "Foster Spiritual Growth" },
//   { icon: "/images/icon-about-list-3.svg", label: "Serve Our Community" },
//   {
//     icon: "/images/icon-about-list-4.svg",
//     label: "Build Strong Relationships",
//   },
// ];

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
      <div className="h-px w-12 bg-brand-accent" />
      <span className="text-brand-accent text-xl font-bold tracking-[0.25em] uppercase">
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
      className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] tracking-tight mb-8"
    >
      About <span className="text-brand-accent">Us</span>
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

  {/* CURVY DIVIDER - FIXED */}
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
          2. ABOUT US
      ══════════════════════════ */}
      <section className="py-28 lg:py-36 bg-white relative overflow-hidden">
        <Orb className="w-120 h-120 bg-brand-accent/6 -top-40 -right-40" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Images */}
            <FadeUp className="relative">
              <div className="relative h-130 lg:h-155">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 left-0 w-[75%] h-[75%] rounded-3xl overflow-hidden shadow-2xl"
                >
                  <ParallaxImage
                    src="/images/aboutimg2.png"
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
                    src="/images/aboutimg1.png"
                    alt="Girls"
                    className="w-full h-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 160, delay: 0.45 }}
                  className="absolute bottom-6 right-6 bg-brand-primary text-white rounded-2xl p-5 shadow-2xl z-10 text-center"
                >
                  <p className="text-4xl font-bold text-brand-accent leading-none">
                    16
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
                {/* <span className="inline-flex items-center gap-2 text-brand-secondary text-xs tracking-[4px] font-semibold uppercase mb-5">
                  <span className="block h-px w-8 bg-brand-secondary" />
                  About Us
                </span> */}
                <h2 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-brand-accent leading-[1.1] mb-6">
                  Faith, hope, and love in{" "}
                  <span className="text-brand-accent">
                    action every day
                  </span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-site-muted text-lg leading-relaxed mb-5">
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

            
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          3. VISION / MISSION / APPROACH
      ══════════════════════════ */}
      <section className="py-28 bg-blue-900 relative overflow-hidden">
        <Orb className="w-150 h-150 bg-brand-accent/10 -top-32 left-1/2 -translate-x-1/2" />
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
            <span className="inline-flex items-center gap-2 text-brand-accent text-lg tracking-[4px] font-semibold uppercase mb-5">
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
                    ? "bg-white text-brand-primary"
                    : "border border-white/20 text-white/70 hover:border-white hover:text-white"
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
                
                </div>

                <div className="relative h-72 sm:h-96 lg:h-115 rounded-3xl overflow-hidden">
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
                className="absolute -top-5 -right-5 w-20 h-20 rounded-2xl bg-brand-accent flex items-center justify-center text-brand-primary text-5xl font-serif shadow-xl leading-none"
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
                  <span className="text-brand-accent">
                    profound impact
                  </span>
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

    </div>
  );
}
