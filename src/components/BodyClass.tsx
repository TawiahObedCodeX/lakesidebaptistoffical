"use client";

import { useEffect } from "react";

interface BodyClassProps {
  className: string;
}

export function BodyClass({ className }: BodyClassProps) {
  useEffect(() => {
    if (!className) return;
    const classes = className.trim().split(/\s+/).filter(Boolean);
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [className]);

  return null;
}