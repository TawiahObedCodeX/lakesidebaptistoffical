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
    image: "/images/khady.jpg",
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
    <main className="bg-site-bg">

      {/* NAVBAR */}
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/church-hero.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-blue-900" />
        </div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white leading-tight">
            Inspiring Stories & Sermons
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto text-xl">
            Dive into our latest sermons, church events, and faith-building insights. Explore, reflect, and grow with us.
          </p>
        </div>
        {/* Section Divider Curve */}
        <div className="absolute bottom-0 left-0 w-full leading-0 fill-[#FDFCFB]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-15">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* EVENTS SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {[
          {
            title: "Past Events",
            description: "A look back at the inspiring gatherings, services, and moments we have already shared.",
            badge: "Past Event",
            accent: "bg-brand-accent/15 text-brand-primary",
          },
          {
            title: "Upcoming Events",
            description: "The next opportunities to gather, worship, and grow together with the church family.",
            badge: "Upcoming Event",
            accent: "bg-brand-secondary/15 text-brand-secondary",
          },
        ].map((group, groupIndex) => (
          <div key={group.title} className="space-y-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">
                  Events
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-primary">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-2xl text-site-text">
                  {group.description}
                </p>
              </div>
              <div className="rounded-full border border-brand-primary/10 bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm">
                {groupIndex === 0 ? "Recent Highlights" : "Coming Soon"}
              </div>
            </div>

            <div className="grid gap-8">
              {blogSections.map((section) => (
                <motion.article
                  key={`${group.title}-${section.id}`}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-card md:flex-row"
                >
                  <div className="relative h-[260px] w-full md:h-auto md:w-[38%]">
                    <Image src={section.image} alt={section.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 p-8 md:p-10">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] ${group.accent}`}>
                      {group.badge}
                    </span>
                    <h3 className="mt-4 text-2xl md:text-3xl font-bold text-brand-primary">
                      {section.title}
                    </h3>
                    <h4 className="mt-2 text-lg font-medium text-brand-secondary">
                      {section.subtitle}
                    </h4>
                    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-site-muted">
                      <span className="flex items-center gap-1"><HiCalendar /> {section.date}</span>
                      <span className="flex items-center gap-1"><HiClock /> {section.readTime}</span>
                    </div>
                    <p className="mt-5 text-site-text leading-relaxed">
                      {section.content[0]}
                    </p>
                    <Link
                      href={`/blog/${section.id}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 font-bold text-brand-primary transition hover:scale-105"
                    >
                      View Event <HiArrowRight />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}