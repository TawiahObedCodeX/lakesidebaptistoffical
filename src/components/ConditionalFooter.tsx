"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";

export function ConditionalFooter() {
  const pathname = usePathname();

  const hideOn = ["/donation", "/signup", "/login", "/forgot-password", "/reset-password","/payment","/thank-you"];
  if (hideOn.includes(pathname)) {
    return null;
  }

  return <SiteFooter />;
}
