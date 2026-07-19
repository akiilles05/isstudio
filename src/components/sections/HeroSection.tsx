"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { ContentMap } from "@/types";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export default function HeroSection({ content }: { content: ContentMap }) {
  const email = content.hero_email ?? "illes.akos@isstudio.hu";
  const tag = content.hero_tag ?? "Webfejlesztés · Győr & Budapest";
  const desc = content.hero_desc ?? "Modern, eredményorientált webfejlesztés magyar KKV-knak.";

  const rootRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            ".hero-status",
            ".hero-tag",
            ".hero-line",
            ".hero-desc",
            ".hero-cta",
            ".hero-scroll-cue",
          ],
          { opacity: 1, y: 0, clearProps: "all" }
        );
        return;
      }

      [line1Ref.current, line2Ref.current].forEach((el) => {
        if (!el) return;
        const text = el.textContent ?? "";
        el.innerHTML = text
          .split(/(\s+)/)
          .map((word) =>
            word.trim() === ""
              ? word
              : `<span class="hero-word inline-block overflow-hidden align-top"><span class="hero-word-inner inline-block will-change-transform">${word}</span></span>`
          )
          .join("");
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-status", { opacity: 0, y: -8, duration: 0.6 })
        .from(".hero-tag", { opacity: 0, y: 10, duration: 0.6 }, "-=0.35")
        .from(
          ".hero-word-inner",
          {
            yPercent: 115,
            opacity: 0,
            duration: 1,
            stagger: 0.045,
          },
          "-=0.25"
        )
        .from(".hero-desc", { opacity: 0, y: 14, duration: 0.7 }, "-=0.55")
        .from(".hero-cta", { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, "-=0.45")
        .from(".hero-scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.2")
        .add(() => {
          gsap.to(".hero-status-dot", {
            scale: 1.4,
            duration: 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

      // Scroll-linked parallax: content drifts up and fades as the hero
      // scrolls out, echoing the three.js scene's own scroll response.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(".hero-content", { y: self.progress * -80, opacity: 1 - self.progress * 1.1 });
          gsap.set(".hero-topbar", { y: self.progress * -30, opacity: 1 - self.progress * 1.4 });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const buttons = rootRef.current?.querySelectorAll<HTMLElement>("[data-magnetic]");
    if (!buttons || buttons.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.28, y: y * 0.4, duration: 0.4, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="min-h-screen flex flex-col justify-end relative overflow-hidden pb-20 px-[clamp(24px,6vw,80px)]"
    >
      {/* three.js node network */}
      <HeroScene />

      {/* Radial gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 55% at 15% -5%, rgba(from var(--color-accent) r g b / 0.18) 0%, transparent 65%)" }}
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[220px] pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
      />

      {/* Top left info */}
      <div className="hero-topbar absolute top-24 left-[clamp(24px,6vw,80px)] flex flex-col gap-2">
        <a href={`mailto:${email}`} className="text-[13px] text-muted transition-colors duration-200">
          {email}
        </a>
        <div className="hero-status flex items-center gap-2">
          <span className="hero-status-dot w-[7px] h-[7px] bg-[#22c55e] rounded-full block flex-shrink-0" />
          <span className="text-xs text-muted tracking-[0.02em]">Új projektekre nyitva.</span>
        </div>
      </div>

      {/* Main content */}
      <div className="hero-content relative z-[1] max-w-[1200px]">
        <p className="hero-tag text-[11.5px] font-medium text-accent tracking-[0.11em] uppercase mb-7">{tag}</p>
        <h1 className="font-heading text-[clamp(2.7rem,5.5vw,5.8rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-navy mb-9">
          <span className="hero-line block">
            <span ref={line1Ref}>Weboldal, ami</span>
          </span>
          <span className="hero-line block">
            <span ref={line2Ref}>
              dolgozik <span className="text-accent">helyetted.</span>
            </span>
          </span>
        </h1>
        <p className="hero-desc text-base font-light text-muted max-w-[430px] leading-[1.75] mb-12">{desc}</p>
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="#munkak"
            data-magnetic
            className="hero-cta inline-flex items-center gap-2 border border-navy/16 text-ink px-6 py-[13px] rounded-lg text-sm font-medium transition-colors duration-200 hover:border-navy/35 hover:text-navy"
          >
            Korábbi munkák <ArrowRight size={15} />
          </a>
          <a
            href="#kapcsolat"
            data-magnetic
            onClick={() => trackEvent("cta_click", { cta_location: "hero" })}
            className="hero-cta inline-flex items-center gap-2 bg-accent text-white px-6 py-[13px] rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-accent-dark"
          >
            Beszéljünk
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue absolute bottom-8 right-[clamp(24px,6vw,80px)] hidden sm:flex items-center gap-3 text-muted">
        <span className="text-[11px] tracking-[0.14em] uppercase [writing-mode:vertical-rl]">Görgess</span>
        <span className="w-px h-10 bg-navy/15 relative overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
