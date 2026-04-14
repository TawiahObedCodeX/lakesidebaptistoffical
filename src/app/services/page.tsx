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

export default function ServicesPage() {
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

      {/* 2. Image & Text Section */}
      <section className="relative py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[420px] md:h-[560px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
            >
              <Image
                src="/images/Paula.jpg"
                alt="Vibrant worship service in progress"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-brand-secondary font-bold tracking-widest uppercase text-sm">Welcome Home</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary leading-tight">Worship with Excellence</h3>
              <p className="text-site-muted text-lg italic font-medium leading-relaxed">
                "Join us for powerful worship, life-changing messages, and a loving community."
              </p>
              <p className="text-site-muted leading-relaxed text-lg">
                Experience an atmosphere where faith comes alive. We are committed
                to creating space where everyone can encounter the grace and truth
                of Jesus Christ through Spirit-led worship and biblical teaching.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Service Times */}
      <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
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

      {/* 5. Worship Atmosphere Gallery - Makes the page catchy */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-brand-secondary font-bold tracking-widest uppercase text-sm mb-3">In the House</h2>
            <h3 className="text-4xl font-serif font-bold text-brand-primary">Moments of Worship</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "/images/aboutimg3.jpg",
              "/images/umm.jpg",
              "/images/use.jpg",
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl group"
              >
                <Image
                  src={src}
                  alt={`Worship moment ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm uppercase tracking-widest">Encounter • Community • Spirit</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      {/* <section className="py-24 bg-brand-accent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-10">Ready to Visit Us?</h2>
          <Link
            href="/event"
            className="inline-block bg-brand-primary text-white px-16 py-5 rounded-full font-bold text-lg hover:bg-brand-primary-dark transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            View Upcoming Events
          </Link>
        </div>
      </section> */}
    </main>
  );
}