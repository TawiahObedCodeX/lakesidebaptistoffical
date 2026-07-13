"use client";

import { useState, useMemo } from "react";
import { BodyClass } from "@/components/BodyClass";
import { useEffect } from "react";

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

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [selectedImage, setSelectedImage] = useState<(typeof IMAGES)[0] | null>(
    null,
  );
  const filtered = useMemo(
    () => (active === "All" ? IMAGES : IMAGES.filter((i) => i.tag === active)),
    [active],
  );

  const openImage = (image: (typeof IMAGES)[0]) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <>
      <BodyClass className="gallery-ui-pro" />

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative bg-blue-900 overflow-hidden px-6 py-24 lg:py-32">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-brand-accent" />
                <span className="text-brand-accent text-xl font-bold tracking-[0.25em] uppercase">
                  Our Collection
                </span>
                <div className="h-px w-12 bg-brand-accent" />
              </div>

              <h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Moments of{" "}
                <em className="text-brand-accent italic font-normal">
                  Faith & Grace
                </em>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-lg">
                Explore the visual journey of our church family. From powerful
                worship gatherings to quiet moments of prayer and joyful
                community service.
              </p>
            </div>

            {/* Hero Mosaic */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-4 animate-fadeInUp">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/congregation.JPG"
                  alt="Worship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/choir.jpg"
                    alt="Choir"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/celebration.jpg"
                    alt="Celebration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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

      {/* ── Gallery Section ───────────────────────────────────────────── */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-stone-600 font-bold text-xs tracking-[0.25em] uppercase">
              The Archive
            </span>
            <h2 className="font-serif text-slate-800 text-4xl sm:text-5xl font-bold mt-3">
              Full Gallery
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                  active === cat
                    ? "bg-slate-800 text-white border-slate-800 shadow-lg"
                    : "bg-white text-gray-600 border-gray-200 hover:border-slate-400 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                onClick={() => openImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Viewer Modal ─────────────────────────────────────────────── */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 lg:p-12 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Actions Bar */}
            <div className="absolute lg:top-4 top-16 left-0 right-0 flex items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 z-20">
              {/* Download Button */}
              <a
                href={selectedImage.src}
                download={`${selectedImage.title.replace(/\s+/g, "-")}.jpg`}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
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
                <span className="text-sm sm:text-base font-medium">
                  Download
                </span>
              </a>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300"
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

            {/* Centered Image */}
            <div className="flex-1 flex items-center justify-center w-full mt-16 sm:mt-20">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl animate-slideUp"
              />
            </div>

            {/* Bottom Image Info */}
            {/* <div className="absolute bottom-8 left-0 right-0 p-4 sm:p-6 text-center">
              <span className="text-white/50 text-xs sm:text-sm tracking-wider uppercase">
                {selectedImage.tag}
              </span>
              <h3 className="text-white text-lg sm:text-xl font-serif font-semibold mt-1">
                {selectedImage.title}
              </h3>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
