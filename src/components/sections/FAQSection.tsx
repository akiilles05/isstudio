"use client";

import { useState } from "react";
import type { FAQ } from "@/types";

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[860px] mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">Gyakori kérdések</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05]">
            Kérdésed van?
          </h2>
        </div>

        <div className="flex flex-col border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
          {faqs.map((f, i) => {
            const open = openId === f.id;
            return (
              <div key={f.id} className={i === 0 ? "" : "border-t border-[rgba(255,255,255,0.07)]"}>
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-[22px] bg-transparent border-none cursor-pointer text-left"
                >
                  <span
                    className={`font-heading text-[15.5px] font-bold tracking-[-0.01em] ${
                      open ? "text-[#eef2ff]" : "text-[#c0ccea]"
                    }`}
                  >
                    {f.question}
                  </span>
                  <span
                    className={`text-lg text-[#4c7cf8] flex-shrink-0 transition-transform duration-200 ease-in-out ${
                      open ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                {open && <p className="px-6 pb-6 text-sm text-[#6b7b9b] leading-[1.72]">{f.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
