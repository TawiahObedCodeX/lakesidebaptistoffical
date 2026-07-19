// src/app/layout.tsx
import type { Metadata } from "next";
import { Fira_Sans_Condensed } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Preloader } from "@/components/Preloader";
import { Providers } from "./providers";

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
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${fira.variable} antialiased bg-site-bg text-site-text overflow-x-hidden`}
      >
        <Providers>
          {/* Preloader MUST be first so it renders before SiteHeader */}
          <Preloader />
          {/* ✅ Only show header/footer if NOT on admin routes */}
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}

// ✅ NEW COMPONENT: Conditionally show/hide header/footer
function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdminRoute = pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <SiteHeader />}
      {children}
      {!isAdminRoute && <SiteFooter />}
    </>
  );
}