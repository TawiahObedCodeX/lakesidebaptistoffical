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
    img: "/images/pastorimg.jpg",
    bio: "Leading our community with over 20 years of theological expertise and a heart for restorative grace.",
    featured: true,
  },
  {
    name: "Pastor Lawal",
    role: "Associate Pastor",
    img: "/images/MRLAWAL.JPG",
    bio: "Dedicated to spiritual nurturing and pastoral care for our church community.",
    featured: true,
  },
];

const deacons = [
  {
    name: "Deacon Edward Annan",
    role: "Chairman of the Body of Deacons",
    focus: "Leads the deacon board in managing the church's physical and administrative needs, coordinating benevolent care for the congregation, and supporting pastoral leadership.",
    img: "images/dcnannan.JPG",
  },
  {
    name: "Deacon Joseph Tei-Muno",
    role: "Estate Committee",
    focus: "Oversees the management, maintenance, development, and security of church property and land assets.",
    img: "/images/dcntei.jpg",
  },
  {
    name: "Deacon Charles Ashitey",
    role: "Head of Music and Media",
    focus: "Directs the musical vision by managing rehearsals, selecting repertoire, and guiding performers for cohesive worship experiences.",
    img: "/images/ashitey.jpg",
  },
  {
    name: "Deacon Joseph Yendork",
    role: "Youth Patron",
    focus: "Empowers young people through mentorship, sponsorship, and leadership development.",
    img: "/images/yendork.JPG",
  },
  {
    name: "Deacon Bincent Amuh",
    role: "come to that later",
    focus: "Supports the deacon board with administration, communications, and care coordination.",
    img: "/images/dncamuh.jpg",
  },
  {
    name: "Deacon Kwadwo Anim",
    role: "Christian Education",
    focus: "Designing and delivering educational curricula, training instructors, and coordinating study programs to deepen the congregation's spiritual growth and doctrinal understanding.",
    img: "/images/team-5.jpg",
  },
  {
    name: "Deacon Kwame Ntim Gyakari",
    role: "Finance Committee",
    focus: "Managing the organization's financial health by overseeing budgets, tracking income and expenditures, and ensuring strict accountability to responsibly support its mission and strategic goals.",
    img: "/images/kntim.jpg",
  },
  {
    name: "Deaconess Comfort Manu-Marfo",
    role: "HR Committee",
    focus: "Managing the organization's personnel and volunteers by overseeing recruitment, developing employment policies, and supporting staff welfare to ensure a productive and harmonious working environment.",
    img: "/images/antyc.jpg",
  },
  {
    name: "Deacon Albert Tsibu",
    role: "Sheepfold Coordinator",
    focus: "Overseeing the church's small-group pastoral care network by organizing members into designated FOLD's tracking their spiritual and physical well-being, and ensuring effective communication between group leaders and pastoral staff.",
    img: "/images/dcnalbert.jpg",
  },
  {
    name: "Deacon Williams Andrews",
    role: "Nominating Committee",
    focus: "Identifying, vetting, and recommending qualified candidates to fill open leadership roles and committee vacancies within the organization.",
    img: "/images/Paula.jpg",
  },
  // {
  //   name: "Deacon Kingsly Asante",
  //   img: "/images/choir.jpg",
  // },
  {
    name: "Deaconess Linda Adams-Ashun",
    role: "Secretary",
    focus: "Maintaining administrative order by documenting meetings, managing official correspondence, and organizing institutional records to ensure seamless communication and continuity within the organization.",
    img: "/images/linda.JPG",
  },
  // {
  //   name: "Deaconess Anita Lawal",
  //   img: "images/antyanita.jpg",
  // },
  // {
  //   name: "Deaconess Elinda Agyei",
  //   img: "/images/elinda.jpg",
  // },
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
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-brand-primary-mute">
        <img
          src={member.img}
          alt={member.name}
          className="h-full w-full object-cover grayscale-30 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-primary/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

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
      <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center  bg-blue-900 pt-32 pb-48 text-center px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary blur-[100px]" />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto">
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
              Head Pastor
            </h4>
            <h2 className="text-brand-primary font-serif text-4xl md:text-5xl font-bold mb-6">
              {team[0].name}
            </h2>
            <div className="h-1 w-20 bg-brand-accent mb-8" />
            <p className="text-site-text text-lg leading-loose mb-8 italic">
             {team[0].bio}
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

      {/* --- SECOND FEATURED LEADER --- */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-accent/10 rounded-[2rem] scale-95 group-hover:scale-100 transition-transform duration-700" />
              <img
                src={team[1]?.img}
                className="relative rounded-2xl w-full aspect-[4/5] object-cover shadow-brand"
                alt={team[1]?.name}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h4 className="text-brand-secondary text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Associate Pastor
            </h4>
            <h2 className="text-brand-primary font-serif text-4xl md:text-5xl font-bold mb-6">
              {team[1]?.name}
            </h2>
            <div className="h-1 w-20 bg-brand-accent mb-8" />
            <p className="text-site-text text-lg leading-loose mb-8 italic">
              {team[1]?.bio}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-divider-dark pt-8">
              <div>
                <h5 className="text-[11px] font-black uppercase text-brand-primary mb-1">
                  Focus
                </h5>
                <p className="text-site-muted text-sm">
                  Discipleship & Community Care
                </p>
              </div>
              <div>
                <h5 className="text-[11px] font-black uppercase text-brand-primary mb-1">
                  Education
                </h5>
                <p className="text-site-muted text-sm">
                  Bachelor of Theology (B.Th)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEACONS --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-brand-primary font-serif text-4xl font-bold mb-4">
            Our Deacons
          </h2>
          <p className="text-site-muted max-w-2xl mx-auto">
            Our deacons serve faithfully behind the scenes, supporting the church family with humility, care, and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {deacons.map((deacon, index) => (
            <div
              key={index}
              className="rounded-3xl border border-divider-dark bg-white overflow-hidden shadow-sm hover:shadow-brand transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-primary-muted">
                <img
                  src={deacon.img}
                  alt={deacon.name}
                  className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 hover:scale-105 hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60 hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 p-5 text-white w-full">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent-light">
                    {deacon.role}
                  </p>
                  <h3 className="font-serif text-lg font-bold leading-tight mt-1">
                    {deacon.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-site-muted text-sm leading-relaxed">
                  {deacon.focus}
                </p>
              </div>
            </div>
          ))}
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
