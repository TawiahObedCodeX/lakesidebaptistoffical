"use client";

import Link from "next/link";
import { motion, Variants, easeOut } from "framer-motion";
import Image from "next/image";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";

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

  const socialLinks = [
    { name: "facebook", url: "https://web.facebook.com/lbcghana", icon: "/images/facebook.svg" },
    { name: "youtube", url: "http://www.youtube.com/@lakesidebaptistchurchab1", icon: "/images/youtube.svg" },
    { name: "tiktok", url: "https://www.tiktok.com/@lakeside.baptist", icon: "/images/tiktok.svg" },
    { name: "instagram", url: "https://www.instagram.com/lakesidebaptistchurchab", icon: "/images/instagram.svg" },
    {name:"spotify", url:"https://open.spotify.com/show/4g0k1r6Z3y5J7v8F9G2H3K", icon:"/images/spotify.svg"}
  ];

  return (
    <footer className="relative bg-blue-900 border-white/5 overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent opacity-[0.04] rounded-full blur-[120px] -translate-y-1/2" />

      <motion.div
        className="px-6 md:px-10 lg:px-16 xl:px-24 pt-16 pb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* 1. Brand Identity */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 space-y-8"
          >
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
                <span className="text-sm font-medium tracking-[0.2em] text-white uppercase mt-1">
                  Baptist Church
                </span>
              </div>
            </Link>

            <p className="text-white/60 leading-relaxed text-[15px] max-w-md">
              A community rooted in faith, reaching out in love. Join our family
              as we worship, grow, and impact lives through the word of God.
            </p>

            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </a>
              ))}
            </div>
          </motion.div>

          {/* 2. Quick Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-8">
            {/* Navigation */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">
                Navigation
              </h3>
              <ul className="space-y-3">
                {["Home", "Ministries", "Our Church", "Events", "News"].map((link) => (
                  <li key={link}>
                    <Link
                      href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "")}`}
                      className="text-white/70 hover:text-brand-accent hover:scale-110 transition-all duration-300 inline-block text-[18px]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="space-y-3">
                {["Sermons", "Giving", "Prayer Request", "Media", "Contact"].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/70 hover:text-brand-accent hover:scale-125 transition-all duration-300 inline-block text-[18px]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 3. Contact & Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-white text-sm font-bold mb-6 tracking-wider uppercase">
              Connect With Us
            </h3>
            <div className="space-y-8">
              {/* Visit Us */}
              <div className="flex items-start gap-4">
                <span className="text-brand-accent text-xl mt-0.5">✦</span>
                <div>
                  <p className="text-white/50 text-xs uppercase font-bold tracking-widest mb-1">
                    Visit Us
                  </p>
                  <p className="text-white/70 text-[15px] leading-relaxed">
                    Lakeside Estate, PV9H+7R7 <br /> Accra, Ghana
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4">
                <span className="text-brand-accent text-xl mt-0.5">✦</span>
                <div>
                  <p className="text-white/50 text-xs uppercase font-bold tracking-widest mb-1">
                    Contact
                  </p>
                  <a
                    href="tel:+233248383745"
                    className="text-white/70 hover:text-white text-[15px] block mb-1 transition-colors"
                  >
                    (+233) 24 838 3745
                  </a>
                  <a
                    href="mailto:lakesidebaptistchurch1@gmail.com"
                    className="text-white/70 hover:text-white text-[15px] transition-colors"
                  >
                    lakesidebaptistchurch1@gmail.com
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-white text-sm font-bold mb-3 tracking-wider uppercase">
                  Newsletter
                </h4>
                <p className="text-white/50 text-sm mb-4">
                  Get weekly updates and announcements delivered to your inbox.
                </p>
                <NewsletterSubscribe variant="inline" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm"
        >
          <p className="text-white/50 text-center md:text-left">
            © 2026 <span className="text-white/70">Lakeside Baptist Church</span>. 
            Excellence in Discipleship.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/50">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white hover:scale-105 transition-all duration-300 text-xs uppercase tracking-widest"
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