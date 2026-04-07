"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";

export function ConditionalHeader() {
  const pathname = usePathname();

  const hideOnExact = ["/signup", "/login", "/forgot-password", "/reset-password"];
  const hideOnPrefix = ["/donation","/payment","/thank-you"]; // hide navbar and logo on donation pages

  const shouldHide = hideOnExact.includes(pathname) || hideOnPrefix.some((p) => pathname.startsWith(p));
  if (shouldHide) {
    return null;
  }

  return <SiteHeader />;
}

