"use client";

import { useEffect, useRef, useState } from "react";

// --- Custom Hook for Section Reveals ---
function useInView(threshold = 0.1) {
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
      { threshold },
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
    img: "/images/lol1 (2).jpg",
    bio: "Leading our community with over 20 years of theological expertise and a heart for restorative grace.",
    featured: true,
  },
  {
    name: "Dede Simmons",
    role: "Associate Pastor",
    img: "/images/lol1 (6).jpg",
  },
  {
    name: "Ashitey Nguyen",
    role: "Director of Worship",
    img: "/images/lol1 (4).jpg",
  },
  {
    name: "Jayden Wilson",
    role: "Worship Leader",
    img: "/images/lol1 (5).jpg",
  },
  { name: "Lemuella Hawkins", role: "Youth Ministry", img: "/images/lem.jpg" },
];

function MemberCard({
  member,
  index,
}: {
  member: (typeof team)[0];
  index: number;
}) {
  const [ref, visible] = useInView(0.15);
  const delay = (index % 4) * 100;

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-primary-muted">
        <img
          src={member.img}
          alt={member.name}
          className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

        <div className="absolute bottom-0 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent-light">
            {member.role}
          </p>
          <h3 className="font-serif text-xl font-bold leading-tight mt-1">
            {member.name}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function LeadershipPage() {
  const [heroRef, heroVisible] = useInView(0.1);

  return (
    <main className="bg-site-bg min-h-screen selection:bg-brand-accent-muted">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-brand-primary pt-32 pb-48 text-center px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary blur-[100px]" />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-brand-accent border border-brand-accent/30 rounded-full">
            Est. 2004 — Our Leadership
          </span>
          <h1 className="font-serif text-5xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
            The Hearts Behind <br />
            <em className="text-brand-accent italic font-normal">
              the Mission.
            </em>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Our leadership team is dedicated to fostering a community of faith,
            resilience, and radical hospitality in the heart of the city.
          </p>
        </div>
      </section>

      {/* --- STATS OVERLAP --- */}
      {/* <section className="relative z-20 -mt-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 backdrop-blur-md border border-glass-border rounded-3xl overflow-hidden shadow-card-lg">
          {[
            { label: "Ministry Years", value: "20+" },
            { label: "Community Partners", value: "14" },
            { label: "Global Missions", value: "06" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-10 text-center">
              <p className="text-brand-secondary font-serif text-4xl font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-site-muted text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* --- FEATURED LEADER --- */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-accent/10 rounded-[2rem] scale-95 group-hover:scale-100 transition-transform duration-700" />
              <img
                src={team[0].img}
                className="relative rounded-2xl w-full aspect-[4/5] object-cover shadow-brand"
                alt="Head Pastor"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h4 className="text-brand-secondary text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Visionary Leadership
            </h4>
            <h2 className="text-brand-primary font-serif text-4xl md:text-5xl font-bold mb-6">
              {team[0].name}
            </h2>
            <div className="h-1 w-20 bg-brand-accent mb-8" />
            <p className="text-site-text text-lg leading-loose mb-8 italic">
              "{team[0].bio}"
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-divider-dark pt-8">
              <div>
                <h5 className="text-[11px] font-black uppercase text-brand-primary mb-1">
                  Focus
                </h5>
                <p className="text-site-muted text-sm">
                  Spiritual Formation & Global Outreach
                </p>
              </div>
              <div>
                <h5 className="text-[11px] font-black uppercase text-brand-primary mb-1">
                  Education
                </h5>
                <p className="text-site-muted text-sm">
                  Doctor of Ministry (D.Min)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TEAM GRID --- */}
      <section className="bg-white py-24 px-6 border-y border-divider-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-md">
              <h2 className="text-brand-primary font-serif text-4xl font-bold mb-4">
                Our Pastoral Team
              </h2>
              <p className="text-site-muted">
                A diverse team of leaders equipped to serve our congregation
                across all generations.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-px bg-brand-accent self-center" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
                Core Leadership
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {team.slice(1).map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CALLOUT --- */}
      {/* <section className="py-24 text-center px-6">
        <div className="max-w-2xl mx-auto bg-brand-primary-muted p-12 rounded-[3rem]">
          <h3 className="font-serif text-2xl text-brand-primary font-bold mb-4">
            Connect with our team
          </h3>
          <p className="text-brand-primary/70 mb-8">
            Have questions about our ministry or want to grab a coffee with a
            pastor?
          </p>
          <button className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-brand-primary-dark transition-colors">
            Contact Leadership
          </button>
        </div>
      </section> */}
    </main>
  );
}
