"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "@/types";

export default function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="folyamat" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-[72px]"
        >
          <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Munkafolyamat</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05]">
            Az első üdvözléstől
            <br />
            az élő weboldalig
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
