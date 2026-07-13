"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const THRESHOLDS = [25, 50, 75, 90];

export default function ScrollDepthTracker() {
  useEffect(() => {
    const reached = new Set<number>();

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = (scrollTop / docHeight) * 100;

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackEvent("scroll_depth", { percent_scrolled: threshold });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
