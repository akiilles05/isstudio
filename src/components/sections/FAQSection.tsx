"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FAQ } from "@/types";

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[860px] mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Gyakori kérdések</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05]">
            Kérdésed van?
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col border border-navy/10 rounded-xl overflow-hidden"
        >
          {faqs.map((f, i) => {
            const open = openId === f.id;
            return (
              <div key={f.id} className={i === 0 ? "" : "border-t border-navy/10"}>
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-[22px] bg-transparent border-none cursor-pointer text-left"
                >
                  <span
                    className={`font-heading text-[15.5px] font-bold tracking-[-0.01em] ${
                      open ? "text-navy" : "text-ink"
                    }`}
                  >
                    {f.question}
                  </span>
                  <span
                    className={`text-lg text-accent flex-shrink-0 transition-transform duration-200 ease-in-out ${
                      open ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm text-muted leading-[1.72]">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
