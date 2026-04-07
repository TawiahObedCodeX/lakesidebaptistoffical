"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";

const mainNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
];

const pagesDropdownItems = [
  { href: "/blog", label: "Blog" },
  { href: "/sermons", label: "Sermons" },
  // { href: "/event", label: "Event" },
  { href: "/donation", label: "Donation" },
  { href: "/ministries", label: "Ministries" },
  { href: "/pastor", label: "Pastor" },
  { href: "/gallery", label: "Gallery" },
  {href:"/contact", label:"contact"}
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
        scrolled 
        ? "py-3 bg-brand-primary/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
        : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group relative z-[110]">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/10 p-1 backdrop-blur-md transition-transform group-hover:scale-110">
            <img
              src="/images/church_logo_blue-removebg-preview (1).png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">
              Lakeside
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-brand-accent uppercase">
              Baptist Church
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm font-semibold tracking-wide transition-all duration-300 hover:text-brand-accent ${
                pathname === item.href ? "text-brand-accent" : "text-white"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-accent" />
              )}
            </Link>
          ))}

          {/* Enhanced Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold text-white hover:text-brand-accent transition-colors">
              Resources <HiChevronDown className={`transition-transform duration-300 ${pagesOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {pagesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 rounded-2xl bg-brand-primary border border-white/10 p-2 shadow-2xl"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {pagesDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-brand-accent transition-all"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/donation"
            className="group relative overflow-hidden rounded-full bg-brand-accent px-8 py-2.5 text-sm font-bold text-brand-primary transition-all hover:pr-10"
          >
            <span className="relative z-10">GIVE ONLINE</span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">→</div>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="lg:hidden relative z-[110] p-2 text-white"
        >
          {mobileOpen ? <HiX size={32} /> : <HiMenuAlt3 size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] flex flex-col  bg-brand-primary p-8 lg:hidden"
          >
            <div className="mt-20 flex flex-col items-center gap-6">
              {[...mainNavItems, ...pagesDropdownItems].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.href}
                >
                  <Link 
                    href={item.href} 
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-bold text-white active:text-brand-accent"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}