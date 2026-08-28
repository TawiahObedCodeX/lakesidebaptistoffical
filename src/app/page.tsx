"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HomeHero } from "@/components/HomeHero";

// Icons (inline SVGs for zero dependency)
const CrossIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const PeopleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const HandIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.3 }}
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </motion.svg>
);

const values = [
  {
    icon: <CrossIcon />,
    title: "Faith",
    description: "Rooted in the eternal Word of God.",
  },
  {
    icon: <HeartIcon />,
    title: "Love",
    description: "Loving God and our neighbors as ourselves.",
  },
  {
    icon: <PeopleIcon />,
    title: "Fellowship",
    description: "Building authentic community together.",
  },
  {
    icon: <HandIcon />,
    title: "Service",
    description: "Serving our city with humble hearts.",
  },
];

const impactItems = [
  {
    title: "Local Donation Drives",
    description:
      "We believe in being the hands and feet of Jesus. Our outreach programs are designed to meet the practical and spiritual needs of our neighbors, bringing hope and help to those who need it most.",
    image: "/images/pappoe.jpg",
    alt: "Community members distributing food and supplies",
    reverse: false,
  },
  {
    title: "Hospital Visitation",
    description:
      "We believe in being the hands and feet of Jesus. Our outreach programs are designed to meet the practical and spiritual needs of our neighbors, bringing hope and help to those who need it most.",
    image: "/images/191.jpg",
    alt: "Nurse visiting with elderly patient",
    reverse: true,
  },
  {
    title: "School Support Programs",
    description:
      "We believe in being the hands and feet of Jesus. Our outreach programs are designed to meet the practical and spiritual needs of our neighbors, bringing hope and help to those who need it most.",
    image: "/images/191.jpg",
    alt: "Volunteers helping children with schoolwork",
    reverse: false,
  },
];

const schedule = [
  {
    time: "9:00 AM",
    title: "Sunday Worship",
    description: "Main sanctuary service with full choir.",
  },
  {
    time: "8:00 AM",
    title: "Bible Study",
    description: "Deep dive into the Word in the fellowship hall.",
  },
  {
    time: "6:00 PM",
    title: "Prayer Meeting",
    description: "Mid-week corporate prayer and intercession.",
  },
  {
    time: "First Sunday",
    title: "Communion",
    description: "Sacred time of remembrance and grace.",
  },
  {
    time: "6:00 PM",
    title: "Youth Service",
    description: "High energy worship and relevant teaching. friday evening",
  },
  {
    time: "Seasonal",
    title: "Special Programs",
    description: "Conferences, outreach, and holiday services.",
  },
];

const faqs = [
  {
    question: "What should I wear?",
    answer:
      "Come as you are! Most people dress casually — jeans, shirts, and comfortable clothes are perfectly fine. We care more about your heart than your outfit.",
  },
  {
    question: "Is there childcare available?",
    answer:
      "Yes! We offer safe, loving childcare and age-appropriate classes for infants through elementary during both Sunday services. Check-in is available 15 minutes before service starts.",
  },
  {
    question: "Where do I park?",
    answer:
      "Free parking is available in the main lot on the east side of the building, with additional overflow parking across the street. Volunteers are happy to help direct you on Sunday mornings.",
  },
  {
    question: "How long is the service?",
    answer:
      "Our Sunday worship services typically last about 75–90 minutes, including worship, prayer, and the message. You’re welcome to arrive a few minutes early to find a seat and connect with others.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* === HERO (already present) === */}
      <HomeHero />

      {/* ========== WHO WE ARE ========== */}
      <section id="who-we-are" className="scroll-mt-28 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Image with quote */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/pastorimg.jpg"
                  alt="Lakeside Baptist Church community family"
                  width={700}
                  height={850}
                  className="w-full h-auto object-cover aspect-4/5"
                  priority
                />
                {/* Quote overlay */}
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xs">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/50">
                    <div className="text-4xl text-gray-300 leading-none mb-2 font-serif">”</div>
                    <p className="text-gray-800 text-lg leading-relaxed font-medium">
                      &quot;A place where everyone belongs and grace overflows.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-5"
              >
                Who We Are
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Discover a community dedicated to Christ, connection, and compassion.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-gray-700 text-lg leading-relaxed mb-10"
              >
                Lakeside Baptist Church is more than just a building. We are a family of believers committed to living out the gospel in every aspect of our lives.
              </motion.p>

              {/* Values Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {values.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="text-gray-800 mb-3">{item.icon}</div>
                    <h3 className="font-bold text-[#B85C38] text-xl mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY IMPACT ========== */}
      <section id="community-impact" className="scroll-mt-28 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-4"
            >
              Community Impact
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Making a difference in our city and beyond.
            </motion.p>
          </div>

          <div className="space-y-20 md:space-y-28">
            {impactItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  item.reverse ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className={`${item.reverse ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-3xl overflow-hidden shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={700}
                      height={480}
                      className="w-full h-auto object-cover aspect-16/11"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className={`${item.reverse ? "lg:order-1" : ""}`}>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-5">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-xl leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WEEKLY SCHEDULE ========== */}
      <section id="schedule" className="scroll-mt-28 py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-4"
            >
              Our Weekly Schedule
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Join us throughout the week for fellowship and growth.
            </motion.p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden sm:block" />

            <div className="space-y-12 sm:space-y-16">
              {schedule.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    className={`relative flex flex-col sm:flex-row items-center gap-6 sm:gap-0 ${
                      isLeft ? "sm:justify-start" : "sm:justify-end"
                    }`}
                  >
                    {/* Content card */}
                    <div
                      className={`w-full sm:w-[42%] ${
                        isLeft ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12 sm:order-2"
                      }`}
                    >
                      <p className="text-lg font-medium text-black mb-1">{item.time}</p>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#B85C38] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-gray-300 shadow-sm z-10 hidden sm:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="scroll-mt-28 py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-4"
            >
              Frequently Asked <span className="text-[#B85C38]">Questions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Everything you need to know about visiting Lakeside.
            </motion.p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-gray-900 text-xl pr-4">
                      {faq.question}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed text-lg">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}