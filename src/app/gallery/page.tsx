"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { BodyClass } from "@/components/BodyClass";

/* ─── Image data ─────────────────────────────────────────────────────────── */
const IMAGES = [
  {
    src: "/images/lol1 (1).jpg",
    tag: "Faith",
    title: "Hearts In Unity",
    meta: "Congregation · Hope",
    size: "wide",
  },
  {
    src: "/images/lol1 (4).jpg",
    tag: "Music",
    title: "Voices Of Hope",
    meta: "Choir · Harmony",
    size: "square",
  },
  {
    src: "/images/lol1 (5).jpg",
    tag: "Prayer",
    title: "Moments Of Prayer",
    meta: "Reflection · Peace",
    size: "tall",
  },
  {
    src: "/images/lol1 (6).jpg",
    tag: "Fellowship",
    title: "Family Fellowship",
    meta: "Community · Love",
    size: "wide",
  },
  {
    src: "/images/lem.jpg",
    tag: "Outreach",
    title: "Serving Together",
    meta: "Service · Impact",
    size: "square",
  },
  {
    src: "/images/Afia.jpg",
    tag: "Women",
    title: "Women Of Faith",
    meta: "Growth · Fellowship",
    size: "tall",
  },
  {
    src: "/images/Josh.jpg",
    tag: "Youth",
    title: "Rising Generation",
    meta: "Ministry · Purpose",
    size: "square",
  },
  {
    src: "/images/Paula.jpg",
    tag: "Events",
    title: "Community Moments",
    meta: "Connection · Joy",
    size: "wide",
  },
  {
    src: "/images/Media.jpg",
    tag: "Media",
    title: "Media Ministry",
    meta: "Creative · Service",
    size: "square",
  },
  {
    src: "/images/celebration.jpg",
    tag: "Celebration",
    title: "Faith Celebrations",
    meta: "Joy · Worship",
    size: "tall",
  },
  {
    src: "/images/Blessing.jpg",
    tag: "Worship",
    title: "Blessed Together",
    meta: "Gratitude · Prayer",
    size: "square",
  },
  {
    src: "/images/choir.jpg",
    tag: "Music",
    title: "Choir Harmony",
    meta: "Music · Worship",
    size: "wide",
  },
  {
    src: "/images/191.jpg",
    tag: "Faith",
    title: "Grace In Action",
    meta: "Faith · Impact",
    size: "square",
  },
  {
    src: "/images/68.jpg",
    tag: "Fellowship",
    title: "Gathered In Love",
    meta: "Joy · Together",
    size: "tall",
  },
  {
    src: "/images/211.jpg",
    tag: "Worship",
    title: "Sanctuary Praise",
    meta: "Spirit · Joy",
    size: "square",
  },
  {
    src: "/images/192.jpg",
    tag: "Fellowship",
    title: "Warm Fellowship",
    meta: "Care · Unity",
    size: "wide",
  },
  {
    src: "/images/Music.jpg",
    tag: "Music",
    title: "Praise Team",
    meta: "Worship · Sound",
    size: "tall",
  },
  {
    src: "/images/pappoe.jpg",
    tag: "Events",
    title: "Leadership Moments",
    meta: "Vision · Guidance",
    size: "square",
  },
  {
    src: "/images/69.jpg",
    tag: "Events",
    title: "Program Highlights",
    meta: "Events · Worship",
    size: "wide",
  },
  {
    src: "/images/52.jpg",
    tag: "Fellowship",
    title: "Faithful Friends",
    meta: "Joy · Connection",
    size: "square",
  },
  {
    src: "/images/27.jpg",
    tag: "Outreach",
    title: "Gathering Of Grace",
    meta: "Faith · Community",
    size: "tall",
  },
  {
    src: "/images/dede mom.jpg",
    tag: "Celebration",
    title: "Celebration Day",
    meta: "Joy · Fellowship",
    size: "wide",
  },
  {
    src: "/images/share.jpg",
    tag: "Outreach",
    title: "Serving With Love",
    meta: "Care · Giving",
    size: "square",
  },
  {
    src: "/images/congregation.JPG",
    tag: "Worship",
    title: "United In Worship",
    meta: "Praise · Together",
    size: "tall",
  },
  {
    src: "/images/camera.JPG",
    tag: "Media",
    title: "Captured Moments",
    meta: "Story · Memory",
    size: "square",
  },
  {
    src: "/images/ga.JPG",
    tag: "Outreach",
    title: "Outreach Love",
    meta: "Service · Hope",
    size: "wide",
  },
  {
    src: "/images/girls.JPG",
    tag: "Youth",
    title: "Youth Fellowship",
    meta: "Growth · Joy",
    size: "square",
  },
  {
    src: "/images/nabila.JPG",
    tag: "Fellowship",
    title: "Faithful Smiles",
    meta: "Care · Warmth",
    size: "tall",
  },
  {
    src: "/images/umm.JPG",
    tag: "Faith",
    title: "Church Family",
    meta: "Love · Together",
    size: "square",
  },
  {
    src: "/images/old.JPG",
    tag: "Faith",
    title: "Legacy Of Faith",
    meta: "Wisdom · Grace",
    size: "wide",
  },
  {
    src: "/images/mimi.JPG",
    tag: "Worship",
    title: "Joyful Hearts",
    meta: "Worship · Joy",
    size: "square",
  },
  {
    src: "/images/borga.JPG",
    tag: "Fellowship",
    title: "Together In Grace",
    meta: "Faith · Connection",
    size: "tall",
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(IMAGES.map((i) => i.tag))).sort(),
];

const TAG_COLORS: Record<string, string> = {
  Worship: "bg-amber-100 text-amber-800",
  Faith: "bg-slate-100 text-slate-800",
  Music: "bg-stone-100 text-stone-800",
  Prayer: "bg-gray-100 text-gray-800",
  Fellowship: "bg-gray-100 text-gray-800",
  Outreach: "bg-emerald-100 text-emerald-800",
  Women: "bg-amber-100 text-amber-800",
  Youth: "bg-blue-100 text-blue-800",
  Events: "bg-purple-100 text-purple-800",
  Media: "bg-pink-100 text-pink-800",
  Celebration: "bg-yellow-100 text-yellow-800",
};

/* ─── Scroll Reveal Hook ─────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          // Optional: unobserve after first reveal for performance
          // observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [selectedImage, setSelectedImage] = useState<(typeof IMAGES)[0] | null>(
    null
  );
  const [isClosing, setIsClosing] = useState(false);
  const [filterKey, setFilterKey] = useState(0); // forces re-animation on filter change

  const filtered = useMemo(
    () => (active === "All" ? IMAGES : IMAGES.filter((i) => i.tag === active)),
    [active]
  );

  const openImage = (image: (typeof IMAGES)[0]) => {
    setSelectedImage(image);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 280);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // Handle category change with animation reset
  const handleCategoryChange = (cat: string) => {
    if (cat === active) return;
    setActive(cat);
    setFilterKey((k) => k + 1);
  };

  // Scroll reveal refs
  const heroTextRef = useScrollReveal(0.15);
  const heroImagesRef = useScrollReveal(0.1);
  const filterRef = useScrollReveal(0.2);
  const galleryHeaderRef = useScrollReveal(0.15);
  const albumsHeaderRef = useScrollReveal(0.15);
  const scriptureRef = useScrollReveal(0.2);
  const voicesHeaderRef = useScrollReveal(0.15);

  return (
    <>
      <BodyClass className="gallery-ui-pro" />

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes softFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease both;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-scaleIn {
          animation: scaleIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Scroll reveal base */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Stagger children */
        .stagger-children > * {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .stagger-children.is-visible > *:nth-child(1) {
          transition-delay: 0.05s;
        }
        .stagger-children.is-visible > *:nth-child(2) {
          transition-delay: 0.12s;
        }
        .stagger-children.is-visible > *:nth-child(3) {
          transition-delay: 0.19s;
        }
        .stagger-children.is-visible > *:nth-child(4) {
          transition-delay: 0.26s;
        }
        .stagger-children.is-visible > *:nth-child(5) {
          transition-delay: 0.33s;
        }
        .stagger-children.is-visible > *:nth-child(6) {
          transition-delay: 0.4s;
        }
        .stagger-children.is-visible > * {
          opacity: 1;
          transform: translateY(0);
        }

        /* Gallery card entrance */
        .gallery-card {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          animation: galleryCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes galleryCardIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Modal backdrop */
        .modal-backdrop {
          animation: fadeIn 0.3s ease both;
        }
        .modal-backdrop.closing {
          animation: fadeOut 0.28s ease both;
        }
        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }

        /* Soft float for hero images (desktop only) */
        @media (min-width: 1024px) {
          .hero-float {
            animation: softFloat 6s ease-in-out infinite;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp,
          .animate-fadeIn,
          .animate-slideUp,
          .animate-scaleIn,
          .gallery-card,
          .hero-float {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .reveal,
          .stagger-children > * {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative bg-[#0f1c3f] overflow-hidden px-6 pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* soft ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div ref={heroTextRef} className="lg:col-span-6 reveal">
              <div className="inline-flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-white/40" />
                <span className="text-amber-400/90 text-sm font-semibold tracking-[0.28em] uppercase">
                  Our Collection
                </span>
                <div className="h-px w-10 bg-white/40" />
              </div>

              <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
                Capturing God&apos;s{" "}
                <span className="text-amber-300 italic font-normal">
                  Faithfulness
                </span>{" "}
                Through Every Moment
              </h1>

              <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
                Every photograph tells a story of grace, a moment of connection,
                and the vibrant life of our church family. We invite you to stay
                and explore these memories.
              </p>

              {/* Verse */}
              <div className="relative pl-6 border-l-2 border-amber-400/60 mb-10">
                <p className="text-white/90 text-lg sm:text-xl italic font-serif leading-relaxed">
                  &ldquo;One generation commends your works to another; they
                  tell of your mighty acts.&rdquo;
                </p>
                <p className="mt-2 text-amber-300/90 text-sm font-medium tracking-wide">
                  — PSALM 145:4
                </p>
              </div>
            </div>

            {/* Hero Image Cluster */}
            <div ref={heroImagesRef} className="lg:col-span-6 reveal">
              <div className="grid grid-cols-12 gap-3 sm:gap-4">
                {/* Large left image */}
                <div className="col-span-7 row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 hero-float">
                  <img
                    src="/images/congregation.JPG"
                    alt="Sunday Worship"
                    className="w-full h-full object-cover aspect-[3/4] sm:aspect-[4/5] hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Top right */}
                <div
                  className="col-span-5 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 hero-float"
                  style={{ animationDelay: "0.8s" }}
                >
                  <img
                    src="/images/choir.jpg"
                    alt="Choir"
                    className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Bottom right */}
                <div
                  className="col-span-5 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 hero-float"
                  style={{ animationDelay: "1.4s" }}
                >
                  <img
                    src="/images/celebration.jpg"
                    alt="Celebration"
                    className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURVY DIVIDER - UNCHANGED */}
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

      {/* ── Filter Bar ───────────────────────────────────────────────── */}
      <section className="bg-white -mt-6 relative z-20 px-4 sm:px-6">
        <div ref={filterRef} className="max-w-5xl mx-auto reveal">
          <div className="bg-white rounded-full shadow-xl shadow-slate-200/60 border border-slate-100 px-2 py-2 flex flex-wrap justify-center gap-1 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out active:scale-95 ${
                  active === cat
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-[1.03]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Gallery ─────────────────────────────────────────────── */}
      <section className="bg-stone-50 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={galleryHeaderRef} className="text-center mb-12 reveal">
            <span className="text-amber-700/80 font-bold text-xs tracking-[0.28em] uppercase">
              The Archive
            </span>
            <h2 className="font-serif text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
              Full Gallery
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Click any photo to view it larger. Hover to feel the moment.
            </p>
          </div>

          {/* Masonry Grid */}
          <div
            key={filterKey}
            className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            {filtered.map((img, i) => (
              <div
                key={`${img.src}-${i}-${filterKey}`}
                className="gallery-card break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ease-out bg-white"
                style={{ animationDelay: `${Math.min(i * 0.045, 0.45)}s` }}
                onClick={() => openImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />

                {/* Elegant hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out flex flex-col justify-end p-4">
                  <span
                    className={`inline-block self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 ${
                      TAG_COLORS[img.tag] || "bg-white/20 text-white"
                    }`}
                  >
                    {img.tag}
                  </span>
                  <h3 className="text-white font-serif text-lg font-semibold leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    {img.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 delay-75">
                    {img.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400 animate-fadeIn">
              No photos in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ── Visual Albums ────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            ref={albumsHeaderRef}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 reveal"
          >
            <div>
              <span className="text-amber-700/80 font-bold text-xs tracking-[0.28em] uppercase">
                Our Ministry
              </span>
              <h2 className="font-serif text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
                Visual Albums
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm sm:text-base">
              Browse through our specialized ministry collections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              {
                title: "Sunday Worship",
                count: "24 Photos",
                img: "/images/congregation.JPG",
              },
              {
                title: "Choir Ministry",
                count: "12 Photos",
                img: "/images/choir.jpg",
              },
              {
                title: "Youth Ministry",
                count: "15 Photos",
                img: "/images/Josh.jpg",
              },
              {
                title: "Outreach Ministry",
                count: "18 Photos",
                img: "/images/ga.JPG",
              },
            ].map((album, idx) => (
              <div
                key={album.title}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  animation: `galleryCardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.1
                  }s both`,
                }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={album.img}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <span className="inline-block bg-amber-400/90 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full mb-2">
                    {album.count}
                  </span>
                  <h3 className="text-white font-serif text-xl font-semibold">
                    {album.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scripture Banner ─────────────────────────────────────────── */}
      <section
        ref={scriptureRef}
        className="relative py-24 sm:py-28 overflow-hidden reveal"
      >
        <div className="absolute inset-0">
          <img
            src="/images/congregation.JPG"
            alt=""
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-[#0b1428]/88" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="text-6xl text-white/20 font-serif leading-none mb-4">
            “
          </div>
          <p className="font-serif text-white text-2xl sm:text-3xl lg:text-4xl leading-relaxed italic">
            We will remember the works of the Lord; yes, we will remember your
            wonders of old.
          </p>
          <p className="mt-6 text-amber-300/90 text-sm font-medium tracking-[0.2em]">
            — PSALM 77:11
          </p>
        </div>
      </section>

      {/* ── Community Voices ─────────────────────────────────────────── */}
      <section className="bg-stone-50 py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={voicesHeaderRef} className="text-center mb-14 reveal">
            <span className="text-amber-700/80 font-bold text-xs tracking-[0.28em] uppercase">
              Shared Stories
            </span>
            <h2 className="font-serif text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
              Community Voices
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Member since 2018",
                quote:
                  "Seeing these photos reminds me of the first time I stepped into Lakeside. The warmth of this community is captured in every frame. It’s not just a church; it’s a family.",
                img: "/images/Afia.jpg",
              },
              {
                name: "David Chen",
                role: "Volunteer Leader",
                quote:
                  "The outreach gallery shows our heart for this city. Being part of those moments changed my perspective on faith and service. Truly blessed to be here.",
                img: "/images/Josh.jpg",
              },
              {
                name: "Elena Rodriguez",
                role: "Youth Leader",
                quote:
                  "The youth ministry photos bring back so many memories of camp. Those were the defining moments of my spiritual journey. I’m so glad we have these captures.",
                img: "/images/nabila.JPG",
              },
            ].map((voice, idx) => (
              <div
                key={voice.name}
                className="bg-white rounded-2xl p-7 sm:p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out border border-slate-100/80"
                style={{
                  animation: `galleryCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.12
                  }s both`,
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-amber-100 shadow-sm">
                    <img
                      src={voice.img}
                      alt={voice.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {voice.name}
                    </h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">
                      {voice.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  “{voice.quote}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Viewer Modal ───────────────────────────────────────── */}
      {selectedImage && (
        <div
          className={`fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 lg:p-12 modal-backdrop ${
            isClosing ? "closing" : ""
          }`}
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Actions */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-3 z-20">
              <a
                href={selectedImage.src}
                download={`${selectedImage.title.replace(/\s+/g, "-")}.jpg`}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm active:scale-95"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="text-sm font-medium hidden sm:inline">
                  Download
                </span>
              </a>

              <button
                onClick={closeModal}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-white/30 text-white hover:border-white/60 hover:bg-red-500/60 transition-all duration-300 backdrop-blur-sm active:scale-95"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center w-full mt-16 sm:mt-12">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className={`max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl ${
                  isClosing ? "" : "animate-slideUp"
                }`}
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center px-4 animate-fadeIn">
              <span className="text-white/50 text-xs tracking-widest uppercase">
                {selectedImage.tag}
              </span>
              <h3 className="text-white text-lg sm:text-xl font-serif font-semibold mt-1">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}