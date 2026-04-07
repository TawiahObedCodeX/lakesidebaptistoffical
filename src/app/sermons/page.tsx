"use client";

import { useEffect, useRef, useState } from "react";

/* ── useInView (fully typed, tuple return) ───────────────────── */
function useInView(threshold = 0.12): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ── Icons (no changes needed) ───────────────────────────────── */
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const CalIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ── Data (three sermons) ─────────────────────────────────────── */
const sermons = [
  {
    id: 1,
    num: "01",
    month: "AUG",
    title: "Start a New Way of Living",
    preacher: "John Doe",
    category: "Prayer",
    time: "Aug 01 · 7:00 – 11:00 am",
    img: "/images/sermons-img-1.jpg",
  },
  {
    id: 2,
    num: "03",
    month: "AUG",
    title: "Overcoming Life's Challenges",
    preacher: "John Doe",
    category: "Faith",
    time: "Aug 03 · 7:00 – 11:00 am",
    img: "/images/sermons-img-2.jpg",
  },
  {
    id: 3,
    num: "08",
    month: "AUG",
    title: "Hope in Times of Trouble",
    preacher: "John Doe",
    category: "Hope",
    time: "Aug 08 · 7:00 – 11:00 am",
    img: "/images/sermons-img-3.jpg",
  },
];

type Sermon = (typeof sermons)[0];

/* ── Sermon Card ─────────────────────────────────────────────── */
function SermonCard({ sermon, index }: { sermon: Sermon; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const delay = index * 100;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cardStyle = {
    backgroundColor: "var(--color-site-surface)",
    borderRadius: "1rem",
    boxShadow: hovered
      ? "var(--shadow-card-lg, 0 28px 70px rgba(15, 23, 42, 0.12))"
      : "var(--shadow-card, 0 20px 56px rgba(15, 23, 42, 0.08))",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, box-shadow 0.3s ease`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      className="overflow-hidden flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <img
          src={sermon.img}
          alt={sermon.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--color-brand-primary-dark, #213243) 0%, transparent 100%)",
            opacity: 0.65,
          }}
        />
        {/* Date badge */}
        <div
          className="absolute top-3 left-3 rounded-xl px-2.5 py-1.5 text-center leading-none shadow-md"
          style={{ backgroundColor: "var(--color-brand-accent, #C9A66B)" }}
        >
          <span className="block font-serif font-black text-lg" style={{ color: "var(--color-brand-primary, #2C3E50)" }}>
            {sermon.num}
          </span>
          <span
            className="block font-bold text-[9px] tracking-widest uppercase mt-0.5"
            style={{ color: "var(--color-brand-primary, #2C3E50)" }}
          >
            {sermon.month}
          </span>
        </div>
        {/* Play button */}
        <a
          href="/sermons-single"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: "var(--color-brand-accent, #C9A66B)", color: "var(--color-brand-primary, #2C3E50)" }}
          aria-label="Play sermon"
        >
          <PlayIcon />
        </a>
        {/* Category chip */}
        <span
          className="absolute bottom-3 left-3 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          {sermon.category}
        </span>
      </div>

      {/* Card body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <h2
          className="font-serif font-bold text-base leading-snug capitalize mb-3"
          style={{ color: "var(--color-brand-primary, #2C3E50)" }}
        >
          {sermon.title}
        </h2>
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-site-muted, #6B7280)" }}>
            <UserIcon />
            <span>{sermon.preacher}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-site-muted, #6B7280)" }}>
            <CalIcon />
            <span>{sermon.time}</span>
          </div>
        </div>
        <a
          href="/sermons-single"
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:gap-2"
          style={{ color: "var(--color-brand-secondary, #8C6A4F)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-primary, #2C3E50)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand-secondary, #8C6A4F)")}
        >
          Watch Sermon <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

/* ── Pagination ─────────────────────────────────────────────── */
function Pagination() {
  const [active, setActive] = useState(1);
  const items: (number | string)[] = ["‹", 1, 2, 3, "›"];

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {items.map((n, i) => (
        <button
          key={i}
          onClick={() => typeof n === "number" && setActive(n)}
          className="w-9 h-9 rounded-full text-sm font-medium border transition-all duration-200"
          style={{
            backgroundColor: active === n ? "var(--color-brand-primary, #2C3E50)" : "transparent",
            color: active === n ? "#ffffff" : "var(--color-brand-primary, #2C3E50)",
            borderColor: active === n ? "var(--color-brand-primary, #2C3E50)" : "rgba(44,62,80,0.25)",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function SermonsPage() {
  const [sectionRef, sectionVisible] = useInView(0.05);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main style={{ backgroundColor: "var(--color-site-bg, #F7F6F3)" }}>
        {/* Hero Section */}
        <section
          className="relative px-6 pt-24 pb-20 overflow-hidden"
          style={{ backgroundColor: "var(--color-brand-primary, #2C3E50)" }}
        >
          {/* Radial glow */}
          <div
            className="absolute top-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,166,107,0.12) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <p
              className="text-[11px] tracking-[0.35em] uppercase font-bold mb-4"
              style={{ color: "var(--color-brand-accent, #C9A66B)", animation: "fadeUp 0.7s ease 0.1s both" }}
            >
              Messages of Faith
            </p>
            <h1
              className="text-white font-serif text-5xl md:text-6xl font-black leading-none tracking-tight mb-4"
              style={{ animation: "fadeUp 0.7s ease 0.22s both" }}
            >
              Words that{" "}
              <em className="italic" style={{ color: "var(--color-brand-accent, #C9A66B)" }}>move</em>
              <br />
              the heart
            </h1>
            <p
              className="text-white/55 text-sm leading-relaxed mb-7"
              style={{ animation: "fadeUp 0.7s ease 0.34s both" }}
            >
              Powerful messages that build your faith and encourage your walk with God.
            </p>
            <div className="flex gap-3 justify-center flex-wrap" style={{ animation: "fadeUp 0.7s ease 0.44s both" }}>
              <a
                href="/sermons-single"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all hover:shadow-brand"
                style={{ backgroundColor: "var(--color-brand-accent, #C9A66B)", color: "var(--color-brand-primary, #2C3E50)" }}
              >
                <PlayIcon /> Watch Latest
              </a>
              <a
                href="https://www.youtube.com/@lakesidebaptistchurchab1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all hover:border-brand-accent hover:bg-brand-accent/10"
              >
                Subscribe on YouTube
              </a>
            </div>
          </div>

          {/* Curved transition */}
          <div className="absolute bottom-[-1px] left-0 right-0 h-12 overflow-hidden">
            <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" fill="var(--color-site-bg, #F7F6F3)" />
            </svg>
          </div>
        </section>

        {/* Gold divider */}
        <div
          className="h-px mx-6"
          style={{
            background: "linear-gradient(to right, transparent, var(--color-brand-accent, #C9A66B), transparent)",
            opacity: 0.3,
          }}
        />

        {/* Sermons Grid Section */}
        <section ref={sectionRef} className="max-w-5xl mx-auto px-6 py-14">
          <div
            className="mb-8"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p className="text-[11px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: "var(--color-brand-secondary, #8C6A4F)" }}>
              Recent Sermons
            </p>
            <h2 className="font-serif text-3xl font-black tracking-tight" style={{ color: "var(--color-brand-primary, #2C3E50)" }}>
              Every word is{" "}
              <em className="italic not-italic font-black" style={{ color: "var(--color-brand-secondary, #8C6A4F)" }}>
                a seed planted
              </em>
            </h2>
          </div>

          {/* Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sermons.map((s, i) => (
              <SermonCard key={s.id} sermon={s} index={i} />
            ))}
          </div>

          <Pagination />
        </section>
      </main>
    </>
  );
}