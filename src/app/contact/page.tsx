import Link from "next/link";
import { ContactForm } from "./contact-form";
import { IoCall } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

export default function ContactPage() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-blue-900 px-6 py-20">
        <div className="absolute inset-0 " />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-white" />
            <span className="text-[#B85C38] uppercase tracking-[3px] text-lg font-semibold">Get In Touch</span>
            <div className="h-px w-8 bg-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
            We&apos;d Love to <span className="text-[#B85C38]">Hear From You</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-md mx-auto">
            Whether you have a question, need prayer, or want to connect — we are here for you.
          </p>
        </div>

        {/* Curvy Divider */}
        <div className="absolute bottom-0 left-0 w-full -mb-1 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20 sm:h-24 md:h-28 lg:h-32 fill-[#F8F5F0]"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,34.2,224.43,74.52,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* CONTACT INFO */}
          <div className="space-y-10">
            <div>
              <span className="text-[#B85C38] uppercase tracking-widest text-2xl font-semibold">Contact Information</span>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mt-3 mb-4">
                Let&apos;s Start a Conversation
              </h2>
              <p className="text-slate-600 text-lg">
                Our team is ready to walk with you. Reach out anytime.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <IoCall className="text-2xl" />,
                  title: "Call Us",
                  detail: "+233 24 123 4567",
                  sub: "Monday – Saturday, 9am – 5pm",
                },
                {
                  icon: <FaEnvelope className="text-2xl" />,
                  title: "Email Us",
                  detail: "info@lakesidebaptistgh.org",
                  sub: "We reply within 24 hours",
                },
                {
                  icon: <FaLocationDot className="text-2xl" />,
                  title: "Visit Us",
                  detail: "Lakeside Estate, Community 6",
                  sub: "Tema, Ghana",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 "
                >
                  <div className="w-12 h-12 shrink-0 bg-amber-50 text-3xl rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xl font-medium text-slate-800 mt-1">{item.detail}</p>
                    <p className="text-slate-500 text-sm mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 rounded-full font-medium transition"
              >
                View Our Ministries
              </Link>
              <Link
                href="/donation"
                className="px-6 py-3.5 bg-black hover:bg-blue-700 text-white rounded-full font-medium transition"
              >
                Support Our Ministry
              </Link>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-slate-100">
            <div className="mb-8">
              <span className="uppercase text-[#B85C38] text-xl font-semibold tracking-widest">Send a Message</span>
              <h3 className="text-3xl font-serif font-semibold text-slate-900 mt-2">We&apos;re Here For You</h3>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <section className=" py-16 lg:py-20 text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#B85C38] font-bold uppercase tracking-widest text-2xl ">Our Location</span>
              <h2 className="text-4xl font-serif font-bold mt-4 mb-6 leading-tight">
                Come Experience<br />Community With Us
              </h2>
              <p className="text-xl text-black max-w-md">
                We are a warm and welcoming church family located in the heart of Lakeside Estate. 
                Whether you&apos;re local or visiting, you will be received with open arms and love.
              </p>
            </div>

            {/* Google Map */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700 h-105">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.1234567890123!2d-0.123456789!3d5.678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNXPDoM6xMOW4s0M!5e0!3m2!1sen!2sgh!4v1720000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lakeside Baptist Church Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}