"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";

const slides = [
  {
    image: "/images/lbcimg5.jpeg",
    title: "Loving God",
    subtitle: "Loving Others",
    highlight: "Serving the World",
    description: "Experience God's love and grace in a welcoming community where faith grows, hope thrives, and everyone is cherished.",
  },
  {
    image: "/images/slide.jpg",
    title: "A Place Where",
    subtitle: "Faith Comes Alive",
    highlight: "Every Sunday",
    description: "Join a vibrant family of believers committed to worship, discipleship, and making a real difference in our community.",
  },
  {
    image: "/images/27.jpg",
    title: "Together We",
    subtitle: "Worship, Grow,",
    highlight: "and Serve",
    description: "Come as you are. Grow with us. Be part of something bigger than yourself — a community rooted in Christ.",
  },
];

export function HomeHero() {
  const [index, setIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-brand-primary">
      {/* Background Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Parallax Background Effect */}
          <motion.div
            initial={{ scale: 1.2, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[index].image})` }}
          />
          {/* Sophisticated Overlays */}
          <div className="absolute inset-0 bg-brand-primary/40 backdrop-brightness-[0.85]" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-brand-primary/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/50 via-transparent to-brand-primary/50" />
        </motion.div>
      </AnimatePresence>

      {/* CENTERED CONTENT BOX */}
      <div className="relative z-20 flex h-full items-center justify-center px-4 sm:px-6 text-center">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-xl"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.4em] text-white uppercase sm:text-xs">
                  Welcome to Lakeside
                </span>
              </motion.div>

              {/* Main Cinematic Title */}
              <motion.h1 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
                className="mb-4 text-5xl font-black leading-[0.95] tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl uppercase italic"
              >
                {slides[index].title} <br />
                <span className="text-brand-accent not-italic drop-shadow-2xl">{slides[index].subtitle}</span>
              </motion.h1>

              {/* High-Impact Highlight */}
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-8 text-xl font-medium tracking-[0.2em] text-white/90 sm:text-2xl md:text-3xl uppercase"
              >
                — {slides[index].highlight} —
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mx-auto mb-10 max-w-2xl text-base text-white/80 leading-relaxed sm:text-lg md:text-xl"
              >
                {slides[index].description}
              </motion.p>

              {/* Responsive Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col items-center justify-center gap-4 w-full sm:flex-row sm:gap-6"
              >
                <Link
                  href="/about"
                  className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-brand-accent px-10 py-5 text-xs font-black uppercase tracking-widest text-brand-primary transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(201,166,107,0.3)]"
                >
                  <span className="relative z-10">Discover Story</span>
                  <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-0" />
                </Link>
                
                <a
                  href="https://youtube.com"
                  className="flex items-center gap-4 group px-6 py-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-md transition-all group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:scale-110">
                    <FaPlay className="ml-1 text-[10px] text-white group-hover:text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-brand-accent">Watch Live</span>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ADAPTIVE CONTROLS (Bottom Bar for Mobile, Floating for Desktop) */}
      <div className="absolute bottom-10 left-0 z-30 w-full px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Visual Progress (Hidden on small mobile) */}
        <div className="hidden sm:flex flex-1 items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand-accent">0{index + 1}</span>
            <span className="h-px w-8 bg-brand-accent/50 my-1" />
            <span className="text-[10px] font-black text-white/30">0{slides.length}</span>
          </div>
          <div className="h-[2px] w-48 bg-white/10 relative rounded-full overflow-hidden">
             <motion.div 
               key={index}
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 8.5, ease: "linear" }}
               className="absolute inset-y-0 left-0 bg-brand-accent"
             />
          </div>
        </div>

        {/* Navigation Arrows */}
      
      </div>

      {/* Decorative Side Elements (Desktop only) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 items-center z-20">
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <p className="rotate-90 text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase whitespace-nowrap">
          Lakeside Baptist Church • 2026
        </p>
        <div className="h-24 w-px bg-gradient-to-t from-transparent via-white/20 to-transparent" />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20"
      >
        <div className="h-8 w-px bg-white/40" />
      </motion.div>
    </section>
  );
}