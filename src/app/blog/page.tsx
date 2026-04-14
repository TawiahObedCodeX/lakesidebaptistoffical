"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiArrowRight, HiCalendar, HiClock } from "react-icons/hi";
import { SiteHeader } from "@/components/SiteHeader";

// DATA: Extended content with multiple sections
const blogSections = [
  {
    id: 1,
    title: "This Week's Sermon: Embracing Forgiveness",
    subtitle: "Learning to forgive is the first step to freedom",
    content: [
      "Forgiveness is a cornerstone of Christian living. It allows us to let go of resentment, restore relationships, and experience peace.",
      "In today's sermon, we explore practical steps to forgive others and ourselves, drawing from biblical teachings and modern insights.",
      "Remember: forgiving does not mean forgetting, it means releasing the hold of anger."
    ],
    image: "/images/Blessing.jpg",
    date: "Feb 2, 2026",
    readTime: "6 min read"
  },
  {
    id: 2,
    title: "Christmas Eve Candlelight Service",
    subtitle: "An Evening of Peace, Hope, and Worship",
    content: [
      "Join us for our annual Christmas Eve Candlelight Service with carols, prayers, and fellowship.",
      "Experience a serene evening filled with the glow of candlelight and the warmth of community.",
      "Bring your family and friends to celebrate the birth of Christ together."
    ],
    image: "/images/choir.jpg",
    date: "Dec 24, 2025",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Walking in Faith Daily",
    subtitle: "Simple Daily Practices to Strengthen Your Relationship with God",
    content: [
      "Daily devotionals, prayer, and gratitude journaling are small practices that build a strong spiritual foundation.",
      "Even 10 minutes a day can transform your perspective, helping you approach challenges with faith and confidence.",
      "We provide easy steps to integrate these practices into your busy life."
    ],
    image: "/images/aboutimg3.jpg",
    date: "Jan 10, 2026",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "Community Outreach: Helping Hands Program",
    subtitle: "Making a Difference, One Step at a Time",
    content: [
      "Our church is committed to serving the local community. The Helping Hands program brings volunteers to support underprivileged families.",
      "From food drives to tutoring sessions, every act of kindness matters. Join us to be part of a movement of hope.",
      "Together, we can transform lives and embody the love of Christ."
    ],
    image: "/images/aboutimg4.jpeg",
    date: "Mar 5, 2026",
    readTime: "7 min read"
  },
  {
    id: 5,
    title: "Bible Study: The Parables of Jesus",
    subtitle: "Understanding His Messages in Daily Life",
    content: [
      "Parables are stories Jesus used to teach lessons about life, faith, and morality.",
      "In this study, we break down each parable, its historical context, and how it applies to modern living.",
      "Deepen your understanding and share insights with your family and church group."
    ],
    image: "/images/biblestudies.jpg",
    date: "Apr 1, 2026",
    readTime: "8 min read"
  }
];

// ANIMATION
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

export default function BlogPage() {
  return (
    <main className="bg-[var(--color-site-bg)]">

      {/* NAVBAR */}
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[55vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/church-hero.jpg"
            alt="Blog Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-overlay-primary)]" />
        </div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Inspiring Stories & Sermons
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Dive into our latest sermons, church events, and faith-building insights. Explore, reflect, and grow with us.
          </p>
        </div>
      </section>

      {/* BLOG SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-32">
        {blogSections.map((section, idx) => (
          <motion.div
            key={section.id}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* IMAGE */}
            <div className="relative w-full md:w-1/2 h-64 md:h-96 rounded-3xl  b overflow-hidden shadow-[var(--shadow-card)]">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
              />
            </div>

            {/* TEXT */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-primary)] mb-3">
                {section.title}
              </h2>
              <h3 className="text-lg md:text-xl font-medium text-[var(--color-brand-secondary)] mb-6">
                {section.subtitle}
              </h3>
              {section.content.map((paragraph, i) => (
                <p key={i} className="mb-4 text-[var(--color-site-text)] text-base md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <div className="flex items-center gap-4 mt-4 text-[var(--color-site-muted)] text-sm">
                <span className="flex items-center gap-1"><HiCalendar /> {section.date}</span>
                <span className="flex items-center gap-1"><HiClock /> {section.readTime}</span>
              </div>
              <Link
                href={`/blog/${section.id}`}
                className="mt-6 inline-block bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] px-6 py-3 rounded-full font-bold hover:scale-105 transition"
              >
                Read Full Story
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="bg-[var(--color-brand-secondary)] py-20 text-center">
  <h2 className="text-3xl font-bold mb-4 text-white">
    Stay Connected & Inspired
  </h2>
  <p className="text-white/80 mb-6 max-w-xl mx-auto">
    Join our church family, attend events, and explore sermons to strengthen your faith.
  </p>
  <Link
    href="/sermons"
    className="inline-block bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] px-8 py-3 rounded-full font-bold hover:scale-105 transition"
  >
    Explore Sermons
  </Link>
</section>
    </main>
  );
}