"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { gsap } from "gsap";

export default function PortfolioSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const ap = projects[active];
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateX: py * -6,
        rotateY: px * 8,
        transformPerspective: 900,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    function onLeave() {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="munkak" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-[72px]"
        >
          <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Kiemelt munkák</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05]">
            Munkáink
          </h2>
          <p className="text-[15px] text-muted max-w-[480px] leading-[1.7] mt-4">
            Válogatás azokból a projektekből, amikre büszkék vagyunk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
        >
          {/* Project list */}
          <div className="flex flex-col gap-1.5">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/munkak/${p.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between px-5 py-[22px] rounded-[10px] cursor-pointer border transition-[background,border-color] duration-250 ease-in-out ${
                  i === active
                    ? "bg-accent/6 border-accent/35"
                    : "bg-transparent border-navy/10"
                }`}
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`font-heading text-[11px] font-bold tracking-[0.05em] min-w-[22px] transition-colors duration-250 ease-in-out ${
                      i === active ? "text-accent" : "text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className={`font-heading text-lg font-bold tracking-[-0.025em] leading-[1.2] transition-colors duration-250 ease-in-out ${
                        i === active ? "text-navy" : "text-muted"
                      }`}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs text-muted mt-[3px]">{p.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-accent transition-opacity duration-250 ease-in-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>

          {/* Preview panel - hidden on mobile */}
          {ap && (
            <div className="hidden md:flex sticky top-24 flex-col gap-4">
              <div
                ref={previewRef}
                className="rounded-xl border border-navy/10 overflow-hidden relative transition-[background] duration-500 ease-in-out will-change-transform"
                style={{ background: ap.previewBg, transformStyle: "preserve-3d" }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-[13px] border-b border-navy/10 bg-navy/6">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-[9px] h-[9px] rounded-full bg-navy/15 block flex-shrink-0" />
                  ))}
                  <div className="flex-1 bg-navy/10 rounded h-5 ml-2 flex items-center pl-2.5">
                    <span className="text-[10.5px] text-navy/45">{ap.domain}</span>
                  </div>
                </div>

                {/* Preview content */}
                {ap.image ? (
                  <div className="min-h-[320px] relative overflow-hidden">
                    <img
                      key={ap.id}
                      src={ap.image}
                      alt={ap.title}
                      className="w-full h-[320px] object-cover object-top block animate-[clip-reveal_0.6s_ease-out]"
                    />
                  </div>
                ) : (
                  <div className="px-5 py-6 flex flex-col gap-2.5 min-h-[320px]">
                    <div className="bg-navy/4 rounded-lg px-[22px] py-7 flex flex-col gap-2.5 flex-[2]">
                      <div className="h-[7px] w-[32%] bg-navy/10 rounded" />
                      <div className="h-[21px] w-[72%] bg-navy/15 rounded" />
                      <div className="h-[17px] w-1/2 bg-navy/10 rounded" />
                      <div className="flex gap-2 mt-2">
                        <div className="h-[30px] w-[94px] rounded-md opacity-75" style={{ background: ap.accentColor }} />
                        <div className="h-[30px] w-[78px] bg-navy/10 rounded-md" />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-1">
                      {[0, 1, 2].map((k) => (
                        <div key={k} className="flex-1 bg-navy/4 rounded-lg min-h-16" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Live badge */}
                <div className="absolute bottom-3.5 right-3.5 bg-navy-dark/75 border border-navy/15 rounded-full px-[13px] py-[5px] flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full block flex-shrink-0 animate-[dot-blink_2.5s_ease-in-out_infinite]" />
                  <span className="text-[10.5px] text-white/60">{ap.title}</span>
                </div>
              </div>

              {ap.url && ap.url !== "#" && (
                <a
                  href={ap.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-accent font-medium"
                >
                  Megnézem <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
