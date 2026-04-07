"use client";

import Link from "next/link";
import { motion, Variants, easeOut } from "framer-motion";

export function SiteFooter() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <footer className="relative bg-[var(--color-brand-primary)] text-white overflow-hidden border-t border-white/5">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[var(--color-brand-accent)] opacity-[0.04] rounded-full blur-[120px] -translate-y-1/2" />

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* 1. Brand Identity */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/church_logo_blue-removebg-preview (1).png"
                alt="Lakeside Baptist Church"
                className="h-14 w-auto brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none text-white">
                  Lakeside
                </span>
                <span className="text-sm font-medium tracking-[0.2em] text-[var(--color-brand-accent)] uppercase mt-1">
                  Baptist Church
                </span>
              </div>
            </Link>

            <p className="text-white/50 leading-relaxed font-light text-sm max-w-sm">
              A community rooted in faith, reaching out in love. Join our family as we 
              worship, grow, and impact lives through the word of God.
            </p>

            <div className="flex gap-3">
              {[
                { name: "FaceBook", url: "https://web.facebook.com/lbcghana" },
                { name: "Youtube", url: "http://www.youtube.com/@lakesidebaptistchurchab1" },
                { name: "Tiktok", url: "https://www.tiktok.com/@lakeside.baptist" },
                { name: "Instagram", url: "https://www.instagram.com/lakesidebaptistchurchab" }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 flex items-center justify-center rounded-md transition-all duration-300 text-[12px] font-bold"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* 2. Quick Links Section */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">Navigation</h3>
              <ul className="space-y-3">
                {['Home', 'Ministries', 'Our Church', 'Events', 'News'].map((link) => (
                  <li key={link}>
                    <Link 
                      href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`}
                      className="text-white/40 hover:text-[var(--color-brand-accent)] transition-colors text-sm font-medium inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">Resources</h3>
              <ul className="space-y-3">
                {['Sermons', 'Giving', 'Prayer Request', 'Media', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link 
                      href="#" 
                      className="text-white/40 hover:text-[var(--color-brand-accent)] transition-colors text-sm font-medium inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 3. Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">Connect</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="text-[var(--color-brand-accent)] text-lg">✦</span>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Visit Us</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Lakeside Estate, PV9H+7R7 <br /> Accra, Ghana
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[var(--color-brand-accent)] text-lg">✦</span>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Contact</p>
                  <a href="tel:+233248383745" className="text-white/70 hover:text-[var(--color-brand-accent)] transition-colors text-sm block mb-1">
                    (+233) 24 838 3745
                  </a>
                  <a href="mailto:lakesidebaptistchurch1@gmail.com" className="text-white/70 hover:text-[var(--color-brand-accent)] transition-colors text-sm truncate block max-w-[240px]">
                    lakesidebaptistchurch1@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-[11px] text-white/30 font-medium tracking-wide">
            © 2026 <span className="text-white/50">Lakeside Baptist Church</span>. Excellence in Discipleship.
          </p>
          
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-[var(--color-brand-accent)] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}