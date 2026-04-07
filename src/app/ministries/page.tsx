export default function MinistriesPage() {
  const ministries = [
    {
      title: "Men's Ministry",
      subtitle: "Strength & Brotherhood",
      description: "Our Men's Ministry is dedicated to developing men of character through biblical teaching and authentic fellowship. We believe that strong men build strong families and vibrant communities.",
      highlights: ["Weekly Men's Breakfast", "Annual Wilderness Retreat", "Community Work Projects"],
      image: "/images/lol1 (1).jpg",
      reverse: false
    },
    {
      title: "Women's Ministry",
      subtitle: "Grace & Connection",
      description: "A supportive space for women of all ages to grow spiritually and connect deeply. We offer a sanctuary for prayer, mentorship, and shared life experiences.",
      highlights: ["Morning Prayer Circles", "Bi-Monthly Book Club", "Fall Women's Conference"],
      image: "/images/umm.jpg",
      reverse: true
    },
    {
      title: "Youth Ministry",
      subtitle: "Purpose & Identity",
      description: "Empowering the next generation to explore their faith in a high-energy, safe environment. We tackle real-world issues through the lens of timeless values.",
      highlights: ["Friday Night Live Events", "Summer Mission Trips", "Academic Mentorship"],
      image: "/images/serviceyouth.png",
      reverse: false
    },
    {
      title: "Children & Teens",
      subtitle: "Foundations of Faith",
      description: "Providing a creative and engaging environment where our youngest members learn about love and kindness through age-appropriate activities and leadership workshops.",
      highlights: ["Creative Bible Classes", "Teen Leadership Prep", "Holiday Musical Pageants"],
      image: "/images/childministries.png",
      reverse: true
    }
  ];

  return (
    <div className="bg-site-bg min-h-screen font-sans">
      {/* HERO SECTION with requested gradient */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image Placeholder (Replace src with your main banner image) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/carouselimg2.jpeg" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          {/* Your Custom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-primary)]/75 via-[var(--color-brand-primary)]/55 to-[var(--color-brand-primary)]/85" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Our Community
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Our Ministries
          </h1>
          <div className="h-1.5 w-24 bg-brand-secondary mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-blue-50 text-xl leading-relaxed opacity-90">
            A place for everyone to belong. Discover how you can connect, grow, and serve 
            within our various ministry groups.
          </p>
        </div>
      </section>

      {/* MINISTRIES CONTENT */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {ministries.map((m, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:items-center gap-12 lg:gap-20 mb-32 last:mb-0 ${
                m.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              {/* Image with Professional Shadow */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-brand-accent/10 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                  <img 
                    src={m.image} 
                    alt={m.title} 
                    className="relative rounded-2xl shadow-card w-full h-[400px] object-cover transition-transform duration-500 group-hover:-translate-y-2"
                  />
                </div>
              </div>

              {/* Text Information */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-brand-secondary font-bold text-sm uppercase tracking-widest mb-2">
                      {m.subtitle}
                    </h4>
                    <h2 className="text-4xl font-bold text-brand-primary">
                      {m.title}
                    </h2>
                  </div>
                  
                  <p className="text-site-muted text-lg leading-relaxed">
                    {m.description}
                  </p>

                  {/* Program Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {m.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-brand-primary font-medium">
                        <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <a 
                      href="/ministry-single" 
                      className="inline-flex items-center justify-center px-10 py-4 bg-brand-primary text-white font-bold rounded-pill shadow-brand hover:bg-brand-primary-dark transition-all transform hover:scale-105"
                    >
                      Learn More & Join
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    
    </div>
  );
}