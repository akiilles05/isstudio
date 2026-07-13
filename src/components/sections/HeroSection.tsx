"use client";

import type { ContentMap } from "@/types";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function HeroSection({ content }: { content: ContentMap }) {
  const email = content.hero_email ?? "illes.akos@isstudio.hu";
  const tag = content.hero_tag ?? "Webfejlesztés · Győr & Budapest";
  const desc = content.hero_desc ?? "Modern, eredményorientált webfejlesztés magyar KKV-knak.";

  return (
    <section
      id="top"
      className="min-h-screen flex flex-col justify-end relative overflow-hidden pb-20 px-[clamp(24px,6vw,80px)]"
    >
      {/* Radial gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 15% -5%, rgba(from var(--color-accent) r g b / 0.18) 0%, transparent 65%)" }}
      />
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(from var(--color-accent) r g b / 0.13) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
      />

      {/* Top left info */}
      <div className="absolute top-24 left-[clamp(24px,6vw,80px)] flex flex-col gap-2">
        <a href={`mailto:${email}`} className="text-[13px] text-muted transition-colors duration-200">
          {email}
        </a>
        <div className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] bg-[#22c55e] rounded-full block flex-shrink-0 animate-[dot-blink_2.5s_ease-in-out_infinite]" />
          <span className="text-xs text-muted tracking-[0.02em]">Új projektekre nyitva.</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-[1] max-w-[1200px]">
        <p className="text-[11.5px] font-medium text-accent tracking-[0.11em] uppercase mb-7">{tag}</p>
        <h1 className="font-heading text-[clamp(2.7rem,5.5vw,5.8rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-navy mb-9">
          Weboldal, ami
          <br />
          dolgozik <span className="text-accent">helyetted.</span>
        </h1>
        <p className="text-base font-light text-muted max-w-[430px] leading-[1.75] mb-12">{desc}</p>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="#munkak"
            className="inline-flex items-center gap-2 border border-navy/16 text-ink px-6 py-[13px] rounded-lg text-sm font-medium transition-colors duration-200 hover:border-navy/35 hover:text-navy"
          >
            Korábbi munkák <ArrowRight size={15} />
          </a>
          <a
            href="#kapcsolat"
            onClick={() => trackEvent("cta_click", { cta_location: "hero" })}
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-[13px] rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-accent-dark"
          >
            Beszéljünk
          </a>
        </div>
      </div>
    </section>
  );
}
