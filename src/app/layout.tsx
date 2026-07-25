// src/app/layout.tsx - WITHOUT AUTHENTICATION
import type { Metadata } from "next";
import { Fira_Sans_Condensed } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Preloader } from "@/components/Preloader";

const fira = Fira_Sans_Condensed({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lakeside Baptist Church",
  description: "Lakeside Baptist Church — Giving, community, and worship.",
  icons: {
    icon: "/images/LBC%20LOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Added suppressHydrationWarning to prevent hydration errors from browser extensions
    // Browser extensions like ColorZilla add attributes (cz-shortcut-listen) that cause mismatches
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${fira.variable} antialiased bg-site-bg text-site-text overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Preloader />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}