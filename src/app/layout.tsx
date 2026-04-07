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
    <html lang="en">
      <body
        className={`${fira.variable} antialiased bg-[var(--color-site-bg)] text-[var(--color-site-text)]`}
      >
        {/* Preloader MUST be first so it renders before SiteHeader */}
        <Preloader />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}