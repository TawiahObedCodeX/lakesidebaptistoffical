"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Clock,
  CalendarDays,
  MapPin,
  Users,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

export default function MinistrySinglePage() {
  // Embla Carousel setup with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Staggered animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const cardHover = {
    hover: {
      y: -12,
      boxShadow: "0 28px 70px rgba(15, 23, 42, 0.15)",
    },
  };

  return (
    <div className="min-h-screen bg-site-bg text-site-text font-sans">
      {/* Page Header */}
      <div className="bg-[var(--brand-primary)] text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-6">
              <div className="w-3 h-3 bg-[var(--brand-accent)] rounded-full animate-pulse" />
              <span className="text-sm font-medium tracking-widest uppercase">
                Children&apos;s Ministry
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-semibold leading-none tracking-tighter mb-6">
              Nurturing Young Hearts
              <br />
              in Faith
            </h1>

            <p className="text-xl text-white/80 max-w-md">
              A safe, joyful space where children discover the love of Jesus
              through play, worship, and biblical truth.
            </p>
          </motion.div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[var(--brand-accent)] to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-20">
            {/* Hero Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-card-lg)]">
              <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                  {[
                    "/images/ministries-img-1.jpg",
                    "/images/ministries-img-2.jpg",
                    "/images/ministries-img-3.jpg",
                  ].map((src, i) => (
                    <div key={i} className="embla__slide flex-[0_0_100%]">
                      <div className="relative h-[520px]">
                        <Image
                          src={src}
                          alt={`Children's Ministry ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute bottom-10 left-10 text-white">
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-sm uppercase tracking-widest mb-2"
                          >
                            Joyful Moments
                          </motion.p>
                          <h3 className="text-4xl font-semibold">
                            Growing in God&apos;s Love
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Navigation Buttons */}
              <button
                onClick={scrollPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[var(--brand-primary)] p-4 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[var(--brand-primary)] p-4 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next slide"
              >
                →
              </button>
            </div>

            {/* Welcome Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-semibold tracking-tight text-[var(--brand-primary)]">
                Welcome to Children&apos;s Ministry
              </h2>

              <div className="prose prose-lg max-w-none text-site-muted">
                <p>
                  At our Children&apos;s Ministry, we create a vibrant, safe,
                  and loving environment where kids ages 3–12 can grow in their
                  faith, build meaningful friendships, and experience the joy of
                  knowing Jesus.
                </p>
                <p>
                  Through interactive Bible stories, energetic worship, creative
                  crafts, and exciting games, children learn that God&apos;s
                  love is real, personal, and transformative.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: Heart,
                    title: "Christ-Centered",
                    desc: "Every activity points children to Jesus and His Word.",
                  },
                  {
                    icon: Users,
                    title: "Safe & Secure",
                    desc: "Background-checked volunteers and secure check-in/out system.",
                  },
                  {
                    icon: Star,
                    title: "Fun & Engaging",
                    desc: "Age-appropriate lessons that make learning the Bible exciting.",
                  },
                  {
                    icon: Users,
                    title: "Community Focused",
                    desc: "Building friendships that last beyond Sunday morning.",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover={cardHover.hover}
                    className="bg-white p-8 rounded-2xl shadow-[var(--shadow-card)] border border-gray-200 flex gap-5 group"
                  >
                    <div className="w-14 h-14 shrink-0 bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl mb-2 text-[var(--brand-primary)]">
                        {feature.title}
                      </h4>
                      <p className="text-site-muted">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Core Values Accordion */}
              <div className="space-y-10">
                <h2 className="text-4xl font-semibold tracking-tight text-[var(--brand-primary)]">
                  Our Core Values
                </h2>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {[
                    {
                      q: "Why is faith development our foundation?",
                      a: "We believe every child is created in God's image and has a unique purpose. Our programs help them build a strong biblical foundation that will last a lifetime.",
                    },
                    {
                      q: "How do we demonstrate God's love?",
                      a: "Through compassionate volunteers, inclusive activities, and a warm atmosphere where every child feels valued, seen, and celebrated.",
                    },
                    {
                      q: "How is community built here?",
                      a: "Small group settings, buddy systems, and family events help children form lasting friendships rooted in shared faith.",
                    },
                    {
                      q: "What makes our teaching effective?",
                      a: "We use age-appropriate, interactive methods including storytelling, drama, music, and hands-on activities that make Scripture come alive.",
                    },
                  ].map((item, i) => (
                    <details
                      key={i}
                      className="group bg-white border border-gray-200 rounded-2xl shadow-[var(--shadow-card)] transition-all"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-lg">
                        {item.q}
                        <ArrowRight className="group-open:rotate-90 transition-transform text-[var(--brand-accent)]" />
                      </summary>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        className="mt-6 text-site-muted leading-relaxed"
                      >
                        {item.a}
                      </motion.div>
                    </details>
                  ))}
                </motion.div>
              </div>

              {/* Additional Ministry Features */}
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-[var(--brand-primary)] mb-10">
                  What We Offer
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Sunday Kids Church",
                      desc: "Dynamic large group worship followed by age-specific small groups.",
                      time: "Every Sunday 10:00 AM",
                    },
                    {
                      title: "Midweek Adventures",
                      desc: "Fun after-school program with Bible lessons, crafts, and snacks.",
                      time: "Tuesdays & Thursdays",
                    },
                    {
                      title: "Special Events",
                      desc: "Vacation Bible School, Easter Eggstravaganza, Christmas Celebration, and more!",
                      time: "Seasonal",
                    },
                  ].map((prog, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-3xl p-8 shadow-[var(--shadow-card)] border border-transparent hover:border-[var(--brand-accent)]/30 transition-all h-full flex flex-col"
                    >
                      <div className="text-[var(--brand-accent)] mb-6">
                        <CalendarDays size={42} />
                      </div>
                      <h3 className="font-semibold text-2xl mb-3">
                        {prog.title}
                      </h3>
                      <p className="text-site-muted flex-1">{prog.desc}</p>
                      <p className="mt-6 text-sm font-medium text-[var(--brand-secondary)] flex items-center gap-2">
                        <Clock size={18} /> {prog.time}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-8 space-y-10"
            >
              {/* Meeting Times */}
              <div className="bg-white rounded-3xl p-9 shadow-[var(--shadow-card)] border border-divider-dark">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-2xl flex items-center justify-center">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl tracking-tight">
                      Meeting Times
                    </h3>
                    <p className="text-sm text-site-muted">Join us regularly</p>
                  </div>
                </div>

                <ul className="space-y-6 text-site-muted">
                  <li className="flex justify-between border-b pb-6">
                    <span>Thursdays</span>
                    <span className="font-medium text-[var(--brand-primary)]">
                      9:00 AM – 11:00 AM
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sundays (Main Service)</span>
                    <span className="font-medium text-[var(--brand-primary)]">
                      8:30 AM
                    </span>
                  </li>
                </ul>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-white rounded-3xl p-9 shadow-[var(--shadow-card)] border border-divider-dark">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] rounded-2xl flex items-center justify-center">
                    <CalendarDays size={28} />
                  </div>
                  <h3 className="font-semibold text-2xl tracking-tight">
                    Typical Sunday Schedule
                  </h3>
                </div>

                <ul className="space-y-5 text-sm">
                  {[
                    ["8:00 AM", "Welcome & Free Play"],
                    ["8:30 AM", "Energetic Worship"],
                    ["10:20 AM", "Large Group Bible Lesson"],
                    ["10:50 AM", "Small Group Activities & Crafts"],
                    ["11:00 AM", "Closing Prayer & Dismissal"],
                  ].map(([time, activity], i) => (
                    <li key={i} className="flex gap-6">
                      <span className="font-mono text-[var(--brand-secondary)] font-medium w-20 shrink-0">
                        {time}
                      </span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location */}
              <div className="bg-white rounded-3xl p-9 shadow-[var(--shadow-card)] border border-divider-dark">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-2xl flex items-center justify-center">
                    <MapPin size={28} />
                  </div>
                  <h3 className="font-semibold text-2xl tracking-tight">
                    Location
                  </h3>
                </div>
                <p className="text-site-muted leading-relaxed">
                  Lakeside Estate, PV9H+7R7
                  <br />
                  Accra, Ghana
                </p>
              </div>

              {/* Call to Action */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white rounded-3xl p-10 text-center"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  Ready to bring your child?
                </h3>
                <p className="mb-8 opacity-90">
                  First visit is always free. We can&apos;t wait to meet your
                  family!
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-white text-[var(--brand-primary)] font-semibold px-10 py-4 rounded-2xl hover:bg-[var(--brand-accent)] hover:text-white transition-all"
                >
                  Register Today
                  <ArrowRight />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}