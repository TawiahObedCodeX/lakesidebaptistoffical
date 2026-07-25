"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HomeHero } from "@/components/HomeHero";

export default function HomePage() {
  return (
    <>
      {/* === CATCHY HERO CAROUSEL === */}
      <HomeHero />

      {/* About Us Section - Enhanced */}
      <section id="home-about" className="scroll-mt-28 py-24 bg-white">
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
                  <Image 
                    src="/images/lem.jpg" 
                    alt="Church community gathering" 
                    width={600}
                    height={450}
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl mt-12"
                >
                  <Image 
                    src="/images/use.jpg" 
                    alt="Worship moment at church" 
                    width={600}
                    height={450}
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl leading-tight font-bold text-red-600 mb-8">
                Faith, hope, and love in <span className="text-red-600">action every day</span>
              </h2>

              <div className="space-y-6 text-site-text text-[17px] leading-relaxed">
                <p>
                  We are a vibrant community of believers dedicated to worship, 
                  fellowship, and service. Our mission is to share God&apos;s love, 
                  grow in faith, and make a positive impact in the world through 
                  compassionate outreach and meaningful connections.
                </p>
                <p>
                  Our church is a welcoming place where everyone can find support, 
                  inspiration, and a sense of belonging. Together, we strive to 
                  live out our faith and make a difference.
                </p>
              </div>

              <Link
                href="/about"
                className="mt-14 inline-block px-10 py-4 border-2 border-brand-primary hover:bg-brand-primary hover:text-white rounded-full font-semibold text-lg transition-all duration-300"
              >
                Read More About Us →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}