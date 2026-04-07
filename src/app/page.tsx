"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";   // ← Import the new hero

export default function HomePage() {
  return (
    <>
      {/* === CATCHY HERO CAROUSEL === */}
      <HomeHero />

      {/* Scrolling Ticker */}
      <div className="bg-[var(--color-brand-primary)] py-4 overflow-hidden border-b border-[var(--color-brand-primary-dark)]">
        <div className="flex whitespace-nowrap animate-marquee text-white/90 text-sm font-medium">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-16 flex items-center gap-4">
              <img 
                src="/images/church_logo_blue-removebg-preview (1).png" 
                alt="" 
                className="h-6 opacity-80" 
              />
              LOVE YOUR NEIGHBOR AS YOURSELF • 
            </span>
          ))}
        </div>
      </div>

      {/* About Us Section - Enhanced */}
      <section id="home-about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img src="/images/lem.jpg" alt="Church community" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl mt-12"
                >
                  <img src="/images/use.jpg" alt="Worship moment" className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>

            <div>
              <div className="uppercase tracking-[3px] text-sm text-[var(--color-brand-secondary)] font-medium mb-4">WELCOME TO LAKESIDE</div>
              
              <h2 className="text-5xl md:text-6xl leading-tight font-bold text-[var(--color-brand-primary)] mb-8">
                Faith, hope, and love in <span className="text-[var(--color-brand-accent)]">action every day</span>
              </h2>

              <div className="space-y-6 text-[var(--color-site-text)] text-[17px] leading-relaxed">
                <p>We are a vibrant community of believers dedicated to worship, fellowship, and service. Our mission is to share God&apos;s love, grow in faith, and make a positive impact in the world through compassionate outreach and meaningful connections.</p>
                <p>Our church is a welcoming place where everyone can find support, inspiration, and a sense of belonging. Together, we strive to live out our faith and make a difference.</p>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  "Share God’s Love",
                  "Foster Spiritual Growth",
                  "Serve Our Community",
                  "Build Strong Relationships"
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5"
                  >
                    <div className="mt-1 w-9 h-9 rounded-2xl bg-[var(--color-brand-accent-muted)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--color-brand-accent)] text-xl">✦</span>
                    </div>
                    <h4 className="font-semibold text-xl text-[var(--color-brand-primary)]">{text}</h4>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-14 inline-block px-10 py-4 border-2 border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white rounded-full font-semibold text-lg transition-all duration-300"
              >
                Read More About Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your sections (Join Worship, Mission, Services, etc.) remain as before or follow the same enhanced pattern with more spacing, better shadows, and motion. */}

      {/* You can continue adding the other sections from previous responses with the same quality level. */}
    </>
  );
}