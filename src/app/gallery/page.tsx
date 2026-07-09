"use client";

import { useState, useMemo } from "react";
import { BodyClass } from "@/components/BodyClass";
import Link from "next/link";
import { useEffect } from "react";

/* ─── Image data ─────────────────────────────────────────────────────────── */
const IMAGES = [
  { src: '/images/lol1 (1).jpg',      tag: 'Faith',       title: 'Hearts In Unity',       meta: 'Congregation · Hope',  size: 'wide' },
  { src: '/images/lol1 (4).jpg',      tag: 'Music',       title: 'Voices Of Hope',        meta: 'Choir · Harmony',      size: 'square' },
  { src: '/images/lol1 (5).jpg',      tag: 'Prayer',      title: 'Moments Of Prayer',     meta: 'Reflection · Peace',   size: 'tall' },
  { src: '/images/lol1 (6).jpg',      tag: 'Fellowship',  title: 'Family Fellowship',     meta: 'Community · Love',     size: 'wide' },
  { src: '/images/lem.jpg',           tag: 'Outreach',    title: 'Serving Together',      meta: 'Service · Impact',     size: 'square' },
  { src: '/images/Afia.jpg',          tag: 'Women',       title: 'Women Of Faith',        meta: 'Growth · Fellowship',  size: 'tall' },
  { src: '/images/Josh.jpg',          tag: 'Youth',       title: 'Rising Generation',     meta: 'Ministry · Purpose',   size: 'square' },
  { src: '/images/Paula.jpg',         tag: 'Events',      title: 'Community Moments',     meta: 'Connection · Joy',     size: 'wide' },
  { src: '/images/Media.jpg',         tag: 'Media',       title: 'Media Ministry',        meta: 'Creative · Service',   size: 'square' },
  { src: '/images/celebration.jpg',   tag: 'Celebration', title: 'Faith Celebrations',    meta: 'Joy · Worship',        size: 'tall' },
  { src: '/images/Blessing.jpg',      tag: 'Worship',     title: 'Blessed Together',      meta: 'Gratitude · Prayer',   size: 'square' },
  { src: '/images/choir.jpg',         tag: 'Music',       title: 'Choir Harmony',         meta: 'Music · Worship',      size: 'wide' },
  { src: '/images/191.jpg',           tag: 'Faith',       title: 'Grace In Action',       meta: 'Faith · Impact',       size: 'square' },
  { src: '/images/68.jpg',            tag: 'Fellowship',  title: 'Gathered In Love',      meta: 'Joy · Together',       size: 'tall' },
  { src: '/images/211.jpg',           tag: 'Worship',     title: 'Sanctuary Praise',      meta: 'Spirit · Joy',         size: 'square' },
  { src: '/images/192.jpg',           tag: 'Fellowship',  title: 'Warm Fellowship',       meta: 'Care · Unity',         size: 'wide' },
  { src: '/images/Music.jpg',         tag: 'Music',       title: 'Praise Team',           meta: 'Worship · Sound',      size: 'tall' },
  { src: '/images/pappoe.jpg',        tag: 'Events',      title: 'Leadership Moments',    meta: 'Vision · Guidance',    size: 'square' },
  { src: '/images/69.jpg',            tag: 'Events',      title: 'Program Highlights',    meta: 'Events · Worship',     size: 'wide' },
  { src: '/images/52.jpg',            tag: 'Fellowship',  title: 'Faithful Friends',      meta: 'Joy · Connection',     size: 'square' },
  { src: '/images/27.jpg',            tag: 'Outreach',    title: 'Gathering Of Grace',    meta: 'Faith · Community',    size: 'tall' },
  { src: '/images/dede mom.jpg',      tag: 'Celebration', title: 'Celebration Day',       meta: 'Joy · Fellowship',     size: 'wide' },
  { src: '/images/share.jpg',         tag: 'Outreach',    title: 'Serving With Love',     meta: 'Care · Giving',        size: 'square' },
  { src: '/images/congregation.JPG',  tag: 'Worship',     title: 'United In Worship',     meta: 'Praise · Together',    size: 'tall' },
  { src: '/images/camera.JPG',        tag: 'Media',       title: 'Captured Moments',      meta: 'Story · Memory',       size: 'square' },
  { src: '/images/ga.JPG',            tag: 'Outreach',    title: 'Outreach Love',         meta: 'Service · Hope',       size: 'wide' },
  { src: '/images/girls.JPG',         tag: 'Youth',       title: 'Youth Fellowship',      meta: 'Growth · Joy',         size: 'square' },
  { src: '/images/nabila.JPG',        tag: 'Fellowship',  title: 'Faithful Smiles',       meta: 'Care · Warmth',        size: 'tall' },
  { src: '/images/umm.JPG',           tag: 'Faith',       title: 'Church Family',         meta: 'Love · Together',      size: 'square' },
  { src: '/images/old.JPG',           tag: 'Faith',       title: 'Legacy Of Faith',       meta: 'Wisdom · Grace',       size: 'wide' },
  { src: '/images/mimi.JPG',          tag: 'Worship',     title: 'Joyful Hearts',         meta: 'Worship · Joy',        size: 'square' },
  { src: '/images/borga.JPG',         tag: 'Fellowship',  title: 'Together In Grace',     meta: 'Faith · Connection',   size: 'tall' },
];

const CATEGORIES = ['All', ...Array.from(new Set(IMAGES.map(i => i.tag))).sort()];

const TAG_COLORS: Record<string, string> = {
  Worship: '#C9A66B', Faith: '#2C3E50', Music: '#8C6A4F', Prayer: '#6B7280',
  Fellowship: '#4B5563', Outreach: '#10B981', Women: '#D4A853', Youth: '#3B82F6',
  Events: '#8B5CF6', Media: '#EC4899', Celebration: '#F59E0B',
};

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof IMAGES[0] | null>(null);
  const filtered = useMemo(() => active === 'All' ? IMAGES : IMAGES.filter(i => i.tag === active), [active]);

  const openImage = (image: typeof IMAGES[0]) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <>
      <BodyClass className="gallery-ui-pro" />
      <GalleryStyles />

      {/* ── Hero with Requested Gradient ─────────────────────────────── */}
      <section className="gl-hero bg-gradient-to-b from-[var(--color-brand-primary)]/75 via-[var(--color-brand-primary)]/55 to-[var(--color-brand-primary)]/85">
        <div className="gl-hero-bg" aria-hidden="true">
          <div className="gl-orb gl-orb-a opacity-20" />
          <div className="gl-orb gl-orb-b opacity-10" />
        </div>

        <div className="gl-hero-inner">
          <div className="gl-hero-text gl-anim-1">
            <span className="gl-eyebrow text-brand-accent">✦ Our Collection ✦</span>
            <h1 className="gl-hero-title text-white">
              Moments of<br />
              <em className="text-brand-accent italic font-normal">Faith & Grace</em>
            </h1>
            <p className="gl-hero-desc text-white/70">
              Explore the visual journey of our church family. From powerful worship 
              gatherings to quiet moments of prayer and joyful community service.
            </p>

            <div className="gl-stats">
              <div className="gl-stat"><strong className="text-white">150+</strong><span className="text-white/50">Moments</span></div>
              <div className="gl-stat"><strong className="text-white">20+</strong><span className="text-white/50">Ministries</span></div>
            </div>

            <div className="gl-hero-actions">
              <Link href="/contact" className="gl-btn bg-brand-accent text-brand-primary hover:bg-white hover:text-brand-primary transition-all shadow-lg">
                Be Part of the Story
              </Link>
              <Link href="#collection" className="gl-btn border border-white/20 text-white hover:bg-white/10 transition-all">
                Browse All
              </Link>
            </div>
          </div>

          <div className="gl-hero-mosaic gl-anim-2">
            <div className="gl-mosaic-main">
              <img src="/images/congregation.JPG" alt="Worship" />
            </div>
            <div className="gl-mosaic-stack">
              <div className="gl-mosaic-sm"><img src="/images/choir.jpg" alt="Choir" /></div>
              <div className="gl-mosaic-sm"><img src="/images/celebration.jpg" alt="Celebration" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection ───────────────────────────────────────────────── */}
      <section id="collection" className="gl-masonry-section bg-site-bg">
        <div className="gl-section-head">
          <span className="gl-eyebrow text-brand-secondary">The Archive</span>
          <h2 className="text-brand-primary font-serif">Full Gallery</h2>
        </div>

        <div className="gl-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`gl-filter-chip${active === cat ? ' gl-filter-active bg-brand-primary text-white border-brand-primary' : ' bg-white text-site-muted border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gl-masonry" key={active}>
          {filtered.map((img, i) => (
            <div key={`${img.src}-${i}`} className={`gl-card gl-card-${img.size} shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer`} onClick={() => openImage(img)}>
              <figure className="gl-card-fig">
                <img src={img.src} alt={img.title} loading="lazy" />
              </figure>
              <div className="gl-card-overlay">
                <span className="gl-card-tag" style={{ background: `${TAG_COLORS[img.tag]}22`, color: TAG_COLORS[img.tag] }}>{img.tag}</span>
                <h3 className="gl-card-title text-white">{img.title}</h3>
                <p className="gl-card-meta text-white/80 text-sm mt-2">Click to view · Download available</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Image Viewer Modal ─────────────────────────────────────────────── */}
      {selectedImage && (
        <div className="gl-modal-overlay" onClick={closeModal}>
          <div className="gl-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={closeModal} className="gl-modal-close" aria-label="Close">
              ✕
            </button>

            {/* Main Image */}
            <div className="gl-modal-image-container">
              <img src={selectedImage.src} alt={selectedImage.title} />
            </div>

            {/* Actions */}
            <div className="gl-modal-actions gl-modal-actions-center">
              <a
                href={selectedImage.src}
                download={`${selectedImage.title.replace(/\s+/g, '-')}.jpg`}
                className="gl-modal-btn gl-modal-btn-primary"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;700&display=swap');

      .gl-hero, .gl-masonry-section {
        --pri: #2C3E50;
        --sec: #8C6A4F;
        --acc: #C9A66B;
        --bg:  #F7F6F3;
        font-family: 'DM Sans', sans-serif;
      }

      .gl-hero { position: relative; padding: 120px 24px; overflow: hidden; }
      .gl-hero-bg { position: absolute; inset: 0; pointer-events: none; }
      .gl-orb { position: absolute; border-radius: 50%; filter: blur(120px); }
      .gl-orb-a { width: 500px; height: 500px; top: -150px; left: -100px; background: var(--acc); }
      .gl-orb-b { width: 400px; height: 400px; bottom: -100px; right: -50px; background: white; }

      .gl-hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
      @media(max-width: 900px) { .gl-hero-inner { grid-template-columns: 1fr; } }

      .gl-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 700; line-height: 1.1; margin: 1rem 0; }
      .gl-hero-desc { font-size: 1.1rem; line-height: 1.7; max-width: 480px; margin-bottom: 2rem; }
      
      .gl-eyebrow { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; }
      .gl-stats { display: flex; gap: 40px; margin-bottom: 40px; }
      .gl-stat strong { display: block; font-size: 2.2rem; font-family: 'Cormorant Garamond', serif; line-height: 1; }
      .gl-stat span { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }

      .gl-btn { padding: 16px 36px; border-radius: 50px; font-weight: 700; text-decoration: none; font-size: 0.85rem; display: inline-block; }

      .gl-hero-mosaic { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
      .gl-mosaic-main { aspect-ratio: 4/5; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      .gl-mosaic-main img, .gl-mosaic-sm img { width: 100%; height: 100%; object-fit: cover; }
      .gl-mosaic-stack { display: flex; flex-direction: column; gap: 16px; }
      .gl-mosaic-sm { aspect-ratio: 1/1; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 30px -10px rgba(0,0,0,0.4); }

      .gl-masonry-section { padding: 100px 24px; max-width: 1300px; margin: 0 auto; }
      .gl-section-head { text-align: center; margin-bottom: 50px; }
      .gl-section-head h2 { font-size: 3.5rem; font-weight: 700; margin-top: 10px; }

      .gl-filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 60px; }
      .gl-filter-chip { padding: 10px 24px; border: 1px solid; border-radius: 50px; cursor: pointer; transition: all 0.4s ease; font-weight: 600; font-size: 0.9rem; }

      .gl-masonry { columns: 4 250px; column-gap: 24px; }
      .gl-card { break-inside: avoid; margin-bottom: 24px; border-radius: 24px; overflow: hidden; position: relative; cursor: pointer; }
      .gl-card img { width: 100%; display: block; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
      .gl-card:hover img { transform: scale(1.1); }
      .gl-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent 70%); padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; opacity: 0; transition: all 0.4s ease; }
      .gl-card:hover .gl-card-overlay { opacity: 1; }
      .gl-card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; }
      .gl-card-tag { font-size: 0.6rem; text-transform: uppercase; font-weight: 800; padding: 5px 12px; border-radius: 6px; align-self: flex-start; margin-bottom: 10px; letter-spacing: 0.1em; }
      .gl-card-meta { display: none; }
      .gl-card:hover .gl-card-meta { display: block; }
      
      /* ── Modal Styles ────────────────────────────────────────────────── */
      .gl-modal-overlay { 
        position: fixed; inset: 0; background: rgba(0,0,0,0.9); 
        display: flex; align-items: center; justify-content: center; 
        z-index: 1000; padding: 20px; 
        animation: gl-fade-in 0.3s ease;
      }

      .gl-modal-content {
        background: white; border-radius: 20px; max-width: 900px; 
        width: 100%; max-height: 90vh; overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        position: relative;
        animation: gl-slide-up 0.4s ease;
      }

      .gl-modal-close {
        position: absolute; top: 20px; right: 20px; 
        background: rgba(0,0,0,0.7); color: white; 
        border: none; width: 40px; height: 40px; 
        border-radius: 50%; font-size: 24px; 
        cursor: pointer; display: flex; align-items: center; 
        justify-content: center; transition: all 0.3s ease;
        z-index: 10;
      }
      .gl-modal-close:hover { background: rgba(0,0,0,0.9); }

      .gl-modal-image-container {
        width: 100%; max-height: 500px; overflow: hidden;
        border-radius: 20px 20px 0 0;
      }
      .gl-modal-image-container img {
        width: 100%; height: 100%; object-fit: contain;
      }

      .gl-modal-info {
        padding: 40px; display: flex; 
        justify-content: space-between; align-items: flex-start; 
        gap: 40px; flex-wrap: wrap;
      }

      .gl-modal-text { flex: 1; min-width: 250px; }
      .gl-modal-tag {
        font-size: 0.7rem; font-weight: 800; 
        text-transform: uppercase; letter-spacing: 0.1em;
      }
      .gl-modal-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.5rem; font-weight: 700; 
        margin: 12px 0; color: #2C3E50;
      }
      .gl-modal-meta { 
        color: #6B7280; font-size: 1rem; margin-top: 10px;
      }

      .gl-modal-actions {
        display: flex; gap: 12px; flex-wrap: wrap;
      }
      .gl-modal-btn {
        padding: 12px 28px; border: none; 
        border-radius: 50px; font-weight: 700; 
        cursor: pointer; font-size: 0.9rem;
        transition: all 0.3s ease;
      }
      .gl-modal-btn-primary {
        background: #C9A66B; color: white;
      }
      .gl-modal-btn-primary:hover { background: #A88B5C; transform: translateY(-2px); }
      .gl-modal-btn-secondary {
        background: #F3F4F6; color: #374151; 
        border: 1px solid #E5E7EB;
      }
      .gl-modal-btn-secondary:hover { background: #E5E7EB; }

      .gl-modal-nav {
        padding: 20px 40px; display: flex; 
        align-items: center; justify-content: center; 
        gap: 30px; border-top: 1px solid #E5E7EB;
        background: #F9FAFB;
        border-radius: 0 0 20px 20px;
      }
      .gl-nav-btn {
        background: #2C3E50; color: white; 
        border: none; width: 45px; height: 45px; 
        border-radius: 50%; font-size: 24px; 
        cursor: pointer; transition: all 0.3s ease;
        display: flex; align-items: center; justify-content: center;
      }
      .gl-nav-btn:hover:not(:disabled) { background: #C9A66B; transform: scale(1.1); }
      .gl-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .gl-nav-counter {
        font-weight: 700; color: #6B7280; 
        font-size: 0.95rem; min-width: 80px; text-align: center;
      }

      @keyframes gl-fade-in { from{opacity:0} to{opacity:1} }
      @keyframes gl-slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes gl-fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      .gl-anim-1 { animation: gl-fade-up 1s ease forwards; }
      .gl-anim-2 { animation: gl-fade-up 1s ease 0.2s forwards; opacity: 0; }

      /* Responsive adjustments */
      @media(max-width: 768px) {
        .gl-modal-info { padding: 24px; gap: 20px; }
        .gl-modal-title { font-size: 1.8rem; }
        .gl-modal-nav { padding: 16px 24px; gap: 16px; }
        .gl-nav-btn { width: 40px; height: 40px; font-size: 20px; }
      }
      
    `}</style>
  );
}