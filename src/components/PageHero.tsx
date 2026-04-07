"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
}

export function PageHero({ eyebrow, title, subtitle, imageSrc }: PageHeroProps) {
  return (
    <section className="relative h-[85vh] min-h-[620px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with gentle continuous zoom */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.02 }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={imageSrc}
          alt="Church worship atmosphere"
          fill
          priority
          className="object-cover"
        />
        {/* Strong gradient overlay for excellent text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80" />
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl px-6 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-brand-accent font-bold tracking-[0.25em] uppercase text-sm mb-6"
          >
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-[5.2rem] font-serif font-black text-white leading-[1.05] mb-8 drop-shadow-sm"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-neutral-100 max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center"
        >
        </motion.div>
      </div>
    </section>
  );
}