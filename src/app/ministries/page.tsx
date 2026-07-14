export default function MinistriesPage() {
  const ministries = [
    {
      title: "Men's Ministry",
      subtitle: "Strength & Brotherhood",
      description:
        "Our Men's Ministry is dedicated to developing men of character through biblical teaching and authentic fellowship. We believe that strong men build strong families and vibrant communities.",
      highlights: [
        "Every Tuesday",
        "7:00 PM – 8:00 PM",
        "at the church premises",
      ],
      meeting: "The Men's Ministry meets",
      image: "/images/lol1 (1).jpg",
      reverse: false,
    },
    {
      title: "Women's Ministry",
      subtitle: "Grace & Connection",
      description:
        "A supportive space for women of all ages to grow spiritually and connect deeply. We offer a sanctuary for prayer, mentorship, and shared life experiences.",
      highlights: [
        "Every Tuesday",
        "6:00 PM – 8:00 PM",
        "at the church premises",
      ],
      image: "/images/umm.jpg",
      meeting: "The Women's Ministry meets",
      reverse: true,
    },
    {
      title: "Youth Ministry",
      subtitle: "Purpose & Identity",
      description:
        "Empowering the next generation to explore their faith in a high-energy, safe environment. We tackle real-world issues through the lens of timeless values.",
      highlights: [
        "Every Tuesday",
        "6:00 PM – 8:00 PM",
        "at the church premises",
      ],
      image: "/images/serviceyouth.png",
      meeting: "The Youth Ministry meets",
      reverse: false,
    },
    {
      title: "Children & Teens",
      subtitle: "Foundations of Faith",
      description:
        "Providing a creative and engaging environment where our youngest members learn about love and kindness through age-appropriate activities and leadership workshops.",
      image: "/images/childministries.png",
      reverse: true,
    },
  ];

  return (
    <div className="bg-site-bg min-h-screen font-sans">
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#1a2530] px-6 py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/carouselimg2.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-(--color-brand-primary)/75 via-(--color-brand-primary)/55 to-(--color-brand-primary)/85" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Our Community
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Our Ministries
          </h1>
          <p className="max-w-2xl mx-auto text-blue-50 text-xl font-bold leading-relaxed opacity-90">
            A place for everyone to belong. Discover how you can connect, grow,
            and serve within our various ministry groups.
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

      {/* MINISTRIES CONTENT */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {ministries.map((m, index) => (
            <div
              key={index}
              className={`flex flex-col lg:items-center gap-12 lg:gap-20 mb-32 last:mb-0 ${
                m.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-brand-accent/10 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                  <img
                    src={m.image}
                    alt={m.title}
                    className="relative rounded-2xl shadow-card w-full h-112 object-cover transition-transform duration-500 group-hover:-translate-y-2"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-brand-primary">
                      {m.title}
                    </h2>
                    <h4 className="text-brand-secondary font-bold text-sm uppercase tracking-widest mb-2">
                      {m.subtitle}
                    </h4>
                  </div>

                  <p className="text-site-muted text-lg leading-relaxed">
                    {m.description}
                  </p>

                  <div className="mt-6">
                    <h5 className="text-brand-accent font-semibold mb-2">
                      {m.meeting}
                    </h5>

                    {/* Highlights - Only render if highlights exist */}
                    {m.highlights && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {m.highlights.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-brand-primary font-medium"
                          >
                            <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
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
