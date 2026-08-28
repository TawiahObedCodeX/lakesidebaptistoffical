"use client";

import { useEffect, useRef, useState } from "react";

// --- Custom Hook for Section Reveals ---
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}

const team = [
  {
    name: "Rev. Edgar Nashief",
    role: "Head Pastor",
    img: "/images/pastorimg.jpg",
    bio: "Leading our community with over 20 years of theological expertise and a heart for restorative grace. Rev. Nashief brings a wealth of experience in building vibrant, inclusive faith communities.",
    focus: "Spiritual Formation & Global Outreach",
    education: "Doctor of Ministry (D.Min)",
    featured: true,
  },
  {
    name: "Pastor Lawal",
    role: "Associate Pastor",
    img: "/images/MRLAWAL.JPG",
    bio: "Dedicated to spiritual nurturing and pastoral care for our church community. Pastor Lawal focuses on empowering the next generation and building strong community bonds.",
    focus: "Discipleship & Community Care",
    education: "Bachelor of Theology (B.Th)",
    featured: true,
  },
];

const deacons = [
  {
    name: "Deacon Edward Annan",
    role: "Chairman of the Body of Deacons",
    focus:
      "Leads the deacon board in managing the church's physical and administrative needs, coordinating benevolent care for the congregation, and supporting pastoral leadership.",
    img: "images/dcnannan.JPG",
  },
  {
    name: "Deacon Joseph Tei-Muno",
    role: "Estate Committee",
    focus:
      "Oversees the management, maintenance, development, and security of church property and land assets.",
    img: "/images/dcntei.jpg",
  },
  {
    name: "Deacon Charles Ashitey",
    role: "Head of Music and Media",
    focus:
      "Directs the musical vision by managing rehearsals, selecting repertoire, and guiding performers for cohesive worship experiences.",
    img: "/images/ashitey.jpg",
  },
  {
    name: "Deacon Joseph Yendork",
    role: "Youth Patron",
    focus:
      "Empowers young people through mentorship, sponsorship, and leadership development.",
    img: "/images/yendork.JPG",
  },
  {
    name: "Deacon Bincent Amuh",
    role: "Leadership Team",
    focus:
      "Supports the deacon board with administration, communications, and care coordination.",
    img: "/images/dncamuh.jpg",
  },
  {
    name: "Deacon Kwame Ntim Gyakari",
    role: "Finance Committee",
    focus:
      "Managing the organization's financial health by overseeing budgets, tracking income and expenditures, and ensuring strict accountability to responsibly support its mission and strategic goals.",
    img: "/images/kntim.jpg",
  },
  {
    name: "Deaconess Comfort Manu-Marfo",
    role: "HR Committee",
    focus:
      "Managing the organization's personnel and volunteers by overseeing recruitment, developing employment policies, and supporting staff welfare to ensure a productive and harmonious working environment.",
    img: "/images/antyc.jpg",
  },
  {
    name: "Deacon Albert Tsibu",
    role: "Sheepfold Coordinator",
    focus:
      "Overseeing the church's small-group pastoral care network by organizing members into designated FOLDs, tracking their spiritual and physical well-being, and ensuring effective communication between group leaders and pastoral staff.",
    img: "/images/dcnalbert.jpg",
  },
  {
    name: "Deaconess Linda Adams-Ashun",
    role: "Secretary",
    focus:
      "Maintaining administrative order by documenting meetings, managing official correspondence, and organizing institutional records to ensure seamless communication and continuity within the organization.",
    img: "/images/linda.JPG",
  },
];

export default function LeadershipPage() {
  const [introRef, introVisible] = useInView(0.15);
  const [pastor1Ref, pastor1Visible] = useInView(0.12);
  const [focusRef, focusVisible] = useInView(0.15);
  const [pastor2Ref, pastor2Visible] = useInView(0.12);
  const [deaconsRef, deaconsVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.15);

  return (
    <main className="bg-site-bg min-h-screen selection:bg-brand-accent-muted">
      {/* --- HERO SECTION (UNTOUCHED) --- */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center bg-blue-900 pt-32 pb-48 text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
            The Hearts Behind <br />
            <em className="text-[#B85C38] italic font-normal">the Mission.</em>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Our leadership team is dedicated to fostering a community of faith,
            resilience, and radical hospitality in the heart of the city.
          </p>
        </div>

        {/* CURVY DIVIDER - FIXED */}
        <div className="absolute bottom-0 left-0 w-full -mb-1 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-20 sm:h-24 md:h-28 lg:h-32 fill-white"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* --- INTRO / PHILOSOPHY --- */}
      <section className="bg-white pt-20 pb-16 md:pt-28 md:pb-20">
        <div
          ref={introRef}
          className="max-w-4xl mx-auto px-6 text-center"
          style={{
            opacity: introVisible ? 1 : 0,
            transform: introVisible ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <p className="text-lg md:text-xl font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-6">
            Our Leadership
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-primary leading-[1.1] tracking-tight mb-8">
            People who serve
            <br />
            <span className="italic font-normal">before they lead.</span>
          </h2>
          <p className="text-site-muted text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto font-light">
            Leadership at Lakeside is rooted in the model of Christ: service,
            faith, and a deep commitment to shepherding our community through
            every season of life.
          </p>
        </div>
      </section>

      {/* --- HEAD PASTOR --- */}
      <section className="bg-white pb-20 md:pb-28">
        <div
          ref={pastor1Ref}
          className="max-w-6xl mx-auto px-6"
          style={{
            opacity: pastor1Visible ? 1 : 0,
            transform: pastor1Visible ? "translateY(0)" : "translateY(50px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 100ms",
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Photo */}
            <div className="w-full lg:w-[48%] relative">
              <div className="relative rounded-sm overflow-hidden shadow-lg">
                <img
                  src={team[0].img}
                  alt={team[0].name}
                  className="w-full aspect-4/5 object-cover"
                />
                {/* Education badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 shadow-md">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-primary/60 mb-0.5">
                    Education
                  </p>
                  <p className="font-serif text-sm text-brand-primary">
                    {team[0].education}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-[52%] lg:pl-4">
              <p className="text-lg font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-3">
                Head Pastor
              </p>
              <h3 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] text-brand-primary leading-tight mb-6">
                {team[0].name}
              </h3>
              <p className="text-site-muted text-xl leading-relaxed mb-8 max-w-lg">
                {team[0].bio}
              </p>

              <div className="border-t border-divider-dark pt-6">
                <p className="text-lg font-semibold tracking-[0.2em] uppercase text-[#B85C38] mb-2">
                  Leadership Focus
                </p>
                <p className="font-serif text-xl md:text-2xl text-brand-primary italic">
                  {team[0].focus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP FOCUS BANNER --- */}
      <section className="bg-white border-y border-divider-dark/40">
        <div
          ref={focusRef}
          className="max-w-6xl mx-auto px-6 py-16 md:py-24"
          style={{
            opacity: focusVisible ? 1 : 0,
            transform: focusVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <div className="md:w-1/2">
              <p className="text-lg font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-4">
                Leadership Focus
              </p>
              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-primary leading-[1.1]">
                Spiritual
                <br />
                Formation
                <br />
                <span className="text-[#B85C38] italic">& Global Outreach</span>
              </h3>
            </div>
            <div className="md:w-1/2 md:border-l md:border-divider-dark md:pl-12">
              <p className="font-serif text-xl md:text-xl lg:text-2xl text-site-muted italic leading-relaxed">
                Our mission is to create spaces where every person feels seen,
                known, and loved by God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ASSOCIATE PASTOR --- */}
      <section className="bg-white py-20 md:py-28">
        <div
          ref={pastor2Ref}
          className="max-w-6xl mx-auto px-6"
          style={{
            opacity: pastor2Visible ? 1 : 0,
            transform: pastor2Visible ? "translateY(0)" : "translateY(50px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 100ms",
          }}
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
            {/* Photo */}
            <div className="w-full lg:w-[48%] relative">
              <div className="relative rounded-sm overflow-hidden shadow-lg">
                <img
                  src={team[1].img}
                  alt={team[1].name}
                  className="w-full aspect-4/5 object-cover"
                />
                {/* Education badge */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-3 shadow-md">
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase text-brand-primary/60 mb-0.5">
                    Education
                  </p>
                  <p className="font-serif text-lg text-brand-primary">
                    {team[1].education}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-[52%] lg:pr-4">
              <p className="text-lg font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-3">
                Associate Pastor
              </p>
              <h3 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] text-brand-primary leading-tight mb-6">
                {team[1].name}
              </h3>
              <p className="text-site-muted text-xl leading-relaxed mb-8 max-w-lg">
                {team[1].bio}
              </p>

              <div className="border-t border-divider-dark pt-6">
                <p className="text-lg font-semibold tracking-[0.2em] uppercase text-[#B85C38] mb-2">
                  Leadership Focus
                </p>
                <p className="font-serif text-xl md:text-2xl text-brand-primary italic">
                  {team[1].focus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEACONS --- */}
      <section className="bg-site-bg py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={deaconsRef}
            className="mb-14 md:mb-16"
            style={{
              opacity: deaconsVisible ? 1 : 0,
              transform: deaconsVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-lg font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-3">
                  Support Team
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-black mb-3">
                  Our Deacons
                </h2>
                <p className="text-site-muted text-xl max-w-xl">
                  Our deacons serve faithfully behind the scenes, supporting the
                  church family with humility, care, and dedication.
                </p>
              </div>

              {/* Simple filter tabs (visual only for now) */}
              
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {deacons.map((deacon, index) => {
              const [cardRef, cardVisible] = useInView(0.08);
              const delay = (index % 3) * 80;

              return (
                <div
                  key={index}
                  ref={cardRef}
                  className="group shadow-sm hover:shadow-md transition-all duration-500"
                  style={{
                    opacity: cardVisible ? 1 : 0,
                    transform: cardVisible
                      ? "translateY(0)"
                      : "translateY(40px)",
                    transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                  }}
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-brand-primary-mute">
                    <img
                      src={deacon.img}
                      alt={deacon.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6 bg-white">
                    <p className="text-lg font-semibold tracking-[0.2em] uppercase text-[#B85C38] mb-1.5">
                      {deacon.role}
                    </p>
                    <h3 className="font-serif text-xl text-brand-primary leading-snug">
                      {deacon.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CONNECT CTA --- */}
      <section className="bg-white py-24 md:py-32">
        <div
          ref={ctaRef}
          className="max-w-3xl mx-auto px-6 text-center"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <p className="text-lg font-semibold tracking-[0.25em] uppercase text-[#B85C38] mb-6">
            Connect With Us
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-black leading-tight mb-6">
            Leadership is always
            <br />
            about people.
          </h2>
          <p className="text-site-muted text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            We invite you to connect with our team, ask questions, and learn more
            about how you can participate in our mission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-5 text-xl font-semibold tracking-wide  transition-colors rounded-lg"
            >
              CONTACT US
              <span>✉</span>
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-black text-brand-primary px-8 py-5 text-xl font-semibold tracking-wide hover:bg-blue-900 hover:text-white transition-colors rounded-lg"
            >
              OUR HISTORY
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}