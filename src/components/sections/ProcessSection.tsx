"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ProcessStep } from "@/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = pathRef.current;
    if (!path || reduceMotion) return;

    const ctx = gsap.context(() => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(path, { strokeDashoffset: length * (1 - self.progress) });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="folyamat"
      className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-[72px]"
        >
          <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Hogyan dolgozunk</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05]">
            Az első üdvözléstől
            <br />
            az élő weboldalig.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 25 8 L 75 8 L 75 50 L 25 50 L 25 92 L 75 92"
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
            {steps.map((step, i) => {
              const col = i % 2;
              return (
                <div
                  key={step.id}
                  className={`px-9 py-10 border-t border-navy/10 flex flex-col gap-4 ${
                    col === 0 ? "border-r" : ""
                  }`}
                >
                  <span className="font-heading text-[44px] font-extrabold text-accent/12 tracking-[-0.05em] leading-none block">
                    {step.num}
                  </span>
                  <h3 className="font-heading text-[19px] font-bold text-navy tracking-[-0.025em]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-[1.72]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
