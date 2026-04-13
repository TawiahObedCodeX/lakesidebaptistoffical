"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CUSTOM HOOK: useIntersection
 * Optimized for 2026 performance standards.
 */
function useIntersection(options = { threshold: 0.15 }) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting] as const;
}

/* ── UI Components: Icons ── */
const PlayCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ── Data ── */
const sermons = [
  {
    id: 1,
    day: "01",
    month: "AUG",
    title: "Start a New Way of Living",
    preacher: "Dr. John Doe",
    category: "Transformation",
    time: "7:00 AM",
    img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    day: "03",
    month: "AUG",
    title: "Overcoming Life's Challenges",
    preacher: "Pastor Jane Smith",
    category: "Resilience",
    time: "9:30 AM",
    img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    day: "08",
    month: "AUG",
    title: "The Architecture of Hope",
    preacher: "John Doe",
    category: "Vision",
    time: "11:00 AM",
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    day: "03",
    month: "AUG",
    title: "Overcoming Life's Challenges",
    preacher: "Pastor Jane Smith",
    category: "Resilience",
    time: "9:30 AM",
    img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    day: "08",
    month: "AUG",
    title: "The Architecture of Hope",
    preacher: "John Doe",
    category: "Vision",
    time: "11:00 AM",
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    day: "03",
    month: "AUG",
    title: "Overcoming Life's Challenges",
    preacher: "Pastor Jane Smith",
    category: "Resilience",
    time: "9:30 AM",
    img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop",
  },
];

/* ── Sermon Card Component ── */
function SermonCard({ sermon, index }: { sermon: typeof sermons[0]; index: number }) {
  const [ref, visible] = useIntersection();
  
  return (
    <div
      ref={ref}
      className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-[1000s] cubic-bezier(0.2, 1, 0.2, 1) 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDuration: "0.8s", transitionDelay: `${index * 150}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-[280px] overflow-hidden">
        <img
          src={sermon.img}
          alt={sermon.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
        
        {/* Date Badge: Glassmorphism */}
        <div className="absolute top-5 left-5 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 text-white text-center min-w-[60px]">
          <span className="block text-2xl font-bold leading-none">{sermon.day}</span>
          <span className="block text-[10px] tracking-widest uppercase font-medium opacity-80">{sermon.month}</span>
        </div>

        {/* Category: Floating pill */}
        <div className="absolute bottom-5 left-5 bg-amber-400 text-[#1a2530] text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full">
          {sermon.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 bg-white group-hover:bg-slate-50 transition-colors duration-500">
        <div className="flex items-center gap-2 text-slate-400 mb-3 text-xs font-semibold">
          <CalendarIcon />
          <span>{sermon.time}</span>
          <span className="mx-1">•</span>
          <span>{sermon.preacher}</span>
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-6 group-hover:text-amber-600 transition-colors">
          {sermon.title}
        </h3>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <button className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-amber-600 transition-all">
            Watch Now
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              <PlayCircle />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SermonsPage() {
  const [headerRef, headerVisible] = useIntersection();

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-amber-200">
      
      {/* Cinematic Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#1a2530] px-6 py-20">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block py-2 px-6 rounded-full border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-[0.3em] mb-8 animate-fade-in">
            Lakeside Ministry Archive
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 tracking-tight leading-[0.9]">
            Spirit-led <br />
            <span className="italic text-amber-400 font-light">Transforming</span> Truths
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Explore our collection of weekly messages designed to challenge your perspective and deepen your walk with the Creator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-amber-500 text-[#1a2530] rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
              Watch Latest Sermon
            </button>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Browse Categories
            </button>
          </div>
        </div>

        {/* Section Divider Curve */}
        <div className="absolute bottom-0 left-0 w-full leading-[0] fill-[#FDFCFB]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z"></path>
            </svg>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div 
          ref={headerRef} 
          className={`flex flex-col md:flex-row md:items-end justify-between mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Teachings
            </h2>
            <div className="h-1 w-20 bg-amber-500 mb-6" />
            <p className="text-slate-500">
              Filtering through our most impactful series. Select a topic that resonates with your current season of life.
            </p>
          </div>
          
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sermons.map((s, i) => (
            <SermonCard key={s.id} sermon={s} index={i} />
          ))}
        </div>

        {/* Modern Pagination */}
        {/* <div className="mt-24 flex items-center justify-center gap-4">
          <button className="p-4 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          {[1, 2, 3].map(page => (
            <button key={page} className={`w-12 h-12 rounded-full font-bold transition-all ${page === 1 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'hover:bg-slate-100'}`}>
              {page}
            </button>
          ))}
          <button className="p-4 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div> */}
      </section>

      {/* Footer Teaser */}
      {/* <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-bold mb-4 text-slate-400">Never Miss a Message</h3>
            <p className="mb-8 text-slate-500">Join our digital congregation and receive new sermons directly in your inbox.</p>
            <div className="flex max-w-md mx-auto bg-white p-2 rounded-full border border-slate-200 shadow-sm focus-within:border-amber-500 transition-all">
                <input type="email" placeholder="email@address.com" className="flex-1 bg-transparent px-6 outline-none text-sm" />
                <button className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors">
                    Join
                </button>
            </div>
        </div>
      </section> */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@400;600;700;900&display=swap');
        
        :root {
          font-family: 'Inter', sans-serif;
        }

        h1, h2, h3, .font-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
      `}</style>
    </div>
  );
}