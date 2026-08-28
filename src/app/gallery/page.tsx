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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
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
  const [filterKey, setFilterKey] = useState(0);

  const filtered = useMemo(
    () => (active === "All" ? IMAGES : IMAGES.filter((i) => i.tag === active)),
    [active]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: IMAGES.length };
    IMAGES.forEach((img) => {
      counts[img.tag] = (counts[img.tag] || 0) + 1;
    });
    return counts;
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

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

  const handleCategoryChange = (cat: string) => {
    if (cat === active) return;
    setActive(cat);
    setFilterKey((k) => k + 1);
  };

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

      {/* Minimal custom keyframes */}
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
        @keyframes galleryCardIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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
        @keyframes fadeOut {
          to {
            opacity: 0;
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
        .gallery-card {
          animation: galleryCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .modal-backdrop {
          animation: fadeIn 0.3s ease both;
        }
        .modal-backdrop.closing {
          animation: fadeOut 0.28s ease both;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 1024px) {
          .hero-float {
            animation: softFloat 6s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp,
          .animate-fadeIn,
          .animate-slideUp,
          .gallery-card,
          .hero-float,
          .modal-backdrop {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-blue-900 px-6 pb-32 pt-24 lg:pb-40 lg:pt-32">
        <div className="pointer-events-none absolute inset-0">
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div ref={heroTextRef} className="reveal lg:col-span-6">
              <div className="mb-7 inline-flex items-center gap-3">
                <div className="h-px w-10 bg-white/40" />
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400/90">
                  Our Collection
                </span>
                <div className="h-px w-10 bg-white/40" />
              </div>

              <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Capturing God&apos;s{" "}
                <span className="font-normal italic text-red-400/90">
                  Faithfulness
                </span>{" "}
                Through Every Moment
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Every photograph tells a story of grace, a moment of connection,
                and the vibrant life of our church family. We invite you to stay
                and explore these memories.
              </p>

              <div className="relative mb-10 border-l-2 border-red-500/60 pl-6">
                <p className="font-serif text-lg italic leading-relaxed text-white/90 sm:text-xl">
                  &ldquo;One generation commends your works to another; they
                  tell of your mighty acts.&rdquo;
                </p>
                <p className="mt-2 text-lg font-medium tracking-wide text-red-400/90">
                  — PSALM 145:4
                </p>
              </div>
            </div>

            <div ref={heroImagesRef} className="reveal lg:col-span-6">
              <div className="grid grid-cols-12 gap-3 sm:gap-4">
                <div className="hero-float col-span-7 row-span-2 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 sm:rounded-3xl">
                  <img
                    src="/images/congregation.JPG"
                    alt="Sunday Worship"
                    className="aspect-3/4 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105 sm:aspect-4/5"
                  />
                </div>
                <div
                  className="hero-float col-span-5 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10"
                  style={{ animationDelay: "0.8s" }}
                >
                  <img
                    src="/images/choir.jpg"
                    alt="Choir"
                    className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
                <div
                  className="hero-float col-span-5 overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10"
                  style={{ animationDelay: "1.4s" }}
                >
                  <img
                    src="/images/celebration.jpg"
                    alt="Celebration"
                    className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curvy divider */}
        <div className="absolute bottom-0 left-0 -mb-1 w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block h-20 w-full fill-white sm:h-24 md:h-28 lg:h-32"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* ── Category Filters ─────────────────────────────────────────── */}
      <section className="relative z-20 -mt-6 px-4 sm:px-6">
        <div ref={filterRef} className="reveal mx-auto max-w-5xl">

          {/* ========== MOBILE / SMALL SCREENS: Show ALL categories ========== */}
          <div className="block md:hidden">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-lg shadow-slate-200/40">
              <div className="grid grid-cols-3 gap-2 xs:grid-cols-4">
                {CATEGORIES.map((cat) => {
                  const isActive = active === cat;
                  const count = categoryCounts[cat] ?? 0;

                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center transition-all duration-300 active:scale-95 ${
                        isActive
                          ? "bg-lime-300 text-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">
                        {cat}
                      </span>
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                          isActive
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 text-center text-xs font-medium text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "photo" : "photos"}
              {active !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-lime-700">{active}</span>
                </>
              )}
            </p>
          </div>

          {/* ========== TABLET & DESKTOP: Capsule Tab Navigation ========== */}
          <div className="hidden md:block">
            <div className="mx-auto max-w-fit">
              <div className="relative overflow-hidden rounded-full border border-slate-200/60 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-1.5 px-2.5 py-2">
                  {CATEGORIES.map((cat) => {
                    const isActive = active === cat;
                    const count = categoryCounts[cat] ?? 0;

                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out active:scale-95 ${
                          isActive
                            ? "bg-black text-white shadow-sm"
                            : "text-slate-500 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        <span>{cat}</span>

                        {/* Dark circular badge only on active item */}
                        {isActive && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-bold tabular-nums text-white">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-3 text-center text-xs font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "photo" : "photos"}
                {active !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-semibold text-lime-700">{active}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Gallery ─────────────────────────────────────────────── */}
      <section className="bg-stone-50 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div ref={galleryHeaderRef} className="reveal mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700/80">
              The Archive
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
              Full Gallery
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Click any photo to view it larger. Hover to feel the moment.
            </p>
          </div>

          <div
            key={filterKey}
            className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4"
          >
            {filtered.map((img, i) => (
              <div
                key={`${img.src}-${i}-${filterKey}`}
                className="gallery-card group relative cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
                style={{
                  animationDelay: `${Math.min(i * 0.045, 0.45)}s`,
                }}
                onClick={() => openImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />

                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/75 via-black/25 to-transparent p-4 opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100">
                  <span
                    className={`mb-2 inline-block self-start rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      TAG_COLORS[img.tag] || "bg-white/20 text-white"
                    }`}
                  >
                    {img.tag}
                  </span>
                  <h3 className="translate-y-2 font-serif text-lg font-semibold leading-tight text-white transition-transform duration-400 group-hover:translate-y-0">
                    {img.title}
                  </h3>
                  <p className="mt-0.5 translate-y-2 text-xs text-white/70 transition-transform delay-75 duration-400 group-hover:translate-y-0">
                    {img.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="animate-fadeIn py-20 text-center text-slate-400">
              No photos in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ── Visual Albums ────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            ref={albumsHeaderRef}
            className="reveal mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700/80">
                Our Ministry
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
                Visual Albums
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500 sm:text-base">
              Browse through our specialized ministry collections.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  animation: `galleryCardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.1
                  }s both`,
                }}
              >
                <div className="aspect-4/5 overflow-hidden">
                  <img
                    src={album.img}
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-5 transition-transform duration-400 group-hover:translate-y-0">
                  <span className="mb-2 inline-block rounded-full bg-amber-400/90 px-2.5 py-1 text-[11px] font-bold text-slate-900">
                    {album.count}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-white">
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
        className="reveal relative overflow-hidden py-24 sm:py-28"
      >
        <div className="absolute inset-0">
          <img
            src="/images/congregation.JPG"
            alt=""
            className="h-full w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1428]/88" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 font-serif text-6xl leading-none text-white/20">
            “
          </div>
          <p className="font-serif text-2xl italic leading-relaxed text-white sm:text-3xl lg:text-4xl">
            We will remember the works of the Lord; yes, we will remember your
            wonders of old.
          </p>
          <p className="mt-6 text-sm font-medium tracking-[0.2em] text-amber-300/90">
            — PSALM 77:11
          </p>
        </div>
      </section>

      {/* ── Community Voices ─────────────────────────────────────────── */}
      <section className="bg-stone-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div ref={voicesHeaderRef} className="reveal mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700/80">
              Shared Stories
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
              Community Voices
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
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
                className="rounded-2xl border border-slate-100/80 bg-white p-7 shadow-md transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl sm:p-8"
                style={{
                  animation: `galleryCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.12
                  }s both`,
                }}
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full shadow-sm ring-2 ring-amber-100">
                    <img
                      src={voice.img}
                      alt={voice.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {voice.name}
                    </h4>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">
                      {voice.role}
                    </p>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-slate-600">
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
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-8 lg:p-12 ${
            isClosing ? "closing" : ""
          }`}
          onClick={closeModal}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-4 top-4 z-20 flex items-center gap-3 sm:right-6 sm:top-6">
              <a
                href={selectedImage.src}
                download={`${selectedImage.title.replace(/\s+/g, "-")}.jpg`}
                className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 active:scale-95 sm:px-5"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <span className="hidden text-sm font-medium sm:inline">
                  Download
                </span>
              </a>
              <button
                onClick={closeModal}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-red-500/60 active:scale-95"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
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

            <div className="mt-16 flex w-full flex-1 items-center justify-center sm:mt-12">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className={`max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl ${
                  isClosing ? "" : "animate-slideUp"
                }`}
              />
            </div>

            <div className="absolute bottom-6 left-0 right-0 animate-fadeIn px-4 text-center">
              <span className="text-xs uppercase tracking-widest text-white/50">
                {selectedImage.tag}
              </span>
              <h3 className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}