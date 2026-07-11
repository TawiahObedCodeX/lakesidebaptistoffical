"use client";

import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { motion } from "framer-motion";
import {
  FaChurch,
  FaPray,
  FaBroadcastTower,
  FaChild,
  FaFire,
  FaHeart,
  FaMusic,
  FaGlobe,
  FaBook,
  FaGraduationCap,
  FaUserFriends,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
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
    day: "28",
    month: "Dec ",
    title: "A THANKFUL HEART",
    preacher: `REV. EDGAR NASHIEF`,
    category: "Transformation",
    time: "9:50 AM",
    img: "/images/pastorimg.jpg",
  },
  {
    id: 2,
    day: "12",
    month: "Apr ",
    title: `THE SACRIFICE OF THANKSGIVING`,
    preacher: " REV OLUWATOYIN LAWAL",
    category: "Resilience",
    time: "9:50 AM",
    img: "/images/pastorimg.jpg",
  },
  {
    id: 3,
    day: "25",
    month: "MAR",
    title: "THE POWER OF THE SEED",
    preacher: "REV Edgar Nashief",
    category: "Vision",
    time: "9:50 AM",
    img: "/images/pastorimg.jpg",
    url:"https://www.youtube.com/live/_4PKOR7v5x0?si=920YtIOJJrO4itEx"
  },

];


/* ── Sermon Card Component ── */
function SermonCard({ sermon, index }: { sermon: typeof sermons[0]; index: number }) {
  const [ref, visible] = useIntersection();
  
  return (
    <div
      ref={ref}
      className={`group relative flex flex-col bg-white rounded-4xl overflow-hidden transition-all duration-[1000s] cubic-bezier(0.2, 1, 0.2, 1) 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDuration: "0.8s", transitionDelay: `${index * 150}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-70 overflow-hidden">
        <img
          src={sermon.img}
          alt={sermon.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60" />
        
        {/* Date Badge: Glassmorphism */}
        <div className="absolute top-5 left-5 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 text-white text-center min-w-15">
          <span className="block text-2xl font-bold leading-none">{sermon.day}</span>
          <span className="block text-[10px] tracking-widest uppercase font-medium opacity-80">{sermon.month}</span>
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

export default function ServicesPage() {
  const [headerRef, headerVisible] = useIntersection();
  const serviceTimes = [
    { day: "Sunday", time: "8:00 – 11:00 AM", label: "Main Worship Service", icon: <FaChurch /> },
    { day: "Wednesday", time: "7:00 - 8:30 AM", label: "Midweek Prayer", icon: <FaPray /> },
    { day: "Online", time: "Every Sunday", label: "Live Stream Available", icon: <FaBroadcastTower /> },
  ];

  const ministries = [
    { icon: <FaChild />, title: "Children's Ministry", desc: "Fun and faith-building for kids" },
    { icon: <FaFire />, title: "Youth Ministry", desc: "Empowering young leaders" },
    { icon: <FaHeart />, title: "Marriage & Family life", desc: "Strong families in Christ" },
    { icon: <FaMusic />, title: "Worship Team", desc: "Leading spirit-filled worship" },
    { icon: <FaGlobe />, title: "Outreach & Missions", desc: "Impacting communities" },
    { icon: <FaBook />, title: "Bible Study", desc: "Grow deeper in the Word" },
    { icon: <FaUserFriends />, title: "Women's Ministry", desc: "Sisterhood & growth" },
    { icon: <FaUserFriends />, title: "Men's Ministry", desc: "Brotherhood & growth" },
  ];

  return (
    <main className="bg-site-bg min-h-screen overflow-hidden">
      {/* 1. Hero Section - Now Fixed */}
      <PageHero
        eyebrow="Our Services"
        title="Experience God Like Never Before"
        subtitle="Join us for powerful worship, life-changing messages, and a loving community"
        imageSrc="/images/lbcimg3.jpeg"
      />

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

      </section>

      {/* 2. Image & Text Section */}
      

      {/* 3. Service Times */}
      <section className="py-24  bg-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">Service Times</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceTimes.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl text-center group hover:bg-white/15 transition-all duration-500"
              >
                <div className="text-brand-accent text-5xl mb-8 flex justify-center group-hover:rotate-12 transition-transform duration-300">
                  {s.icon}
                </div>
                <h3 className="text-3xl font-bold mb-3">{s.day}</h3>
                <p className="text-brand-accent text-2xl font-semibold mb-2">{s.time}</p>
                <p className="text-white/70 text-sm tracking-widest uppercase font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ministries Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-secondary font-bold tracking-widest uppercase text-sm mb-4">What we offer</h2>
          <h3 className="text-4xl font-serif font-bold text-brand-primary">Our Ministries</h3>
          <div className="w-24 h-1 bg-brand-accent mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ministries.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -12 }}
              className="group p-5  rounded-3xl bg-white border border-neutral-100 shadow hover:border-brand-accent/30 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="text-brand-secondary text-4xl mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
              <h3 className="text-2xl font-bold text-brand-primary mb-4">{m.title}</h3>
              <p className="text-site-muted text-[15px] leading-relaxed grow">{m.desc}</p>
              <Link
                href="/ministries"
                className="mt-8 text-brand-accent font-bold text-xs uppercase tracking-widest hover:text-brand-primary inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Learn More <span className="text-lg">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>      
    </main>
  );
}