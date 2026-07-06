"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@/types";

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) return null;

  const t = testimonials[active];

  function prev() {
    setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  }

  function next() {
    setActive((a) => (a + 1) % testimonials.length);
  }

  return (
    <section className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)] bg-[rgba(255,255,255,0.012)] border-t border-b border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-16">
          <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">Ügyfélvélemények</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05]">
            Amit rólam mondanak.
          </h2>
        </div>

        <div className="max-w-[720px] mx-auto text-center">
          <span className="font-heading text-[48px] font-extrabold text-[rgba(76,124,248,0.25)] leading-none">
            &ldquo;
          </span>
          <p className="text-[19px] font-light italic text-[#c0ccea] leading-[1.7] mt-4 mb-8">{t.content}</p>
          <div className="mb-10">
            <p className="font-heading text-sm font-bold text-[#eef2ff]">{t.author}</p>
            {t.role && <p className="text-xs text-[#5e7090] mt-0.5">{t.role}</p>}
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prev}
                aria-label="Előző vélemény"
                className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#7080a8] transition-colors duration-200 hover:text-[#eef2ff] hover:border-[rgba(76,124,248,0.4)] cursor-pointer bg-transparent"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((tt, i) => (
                  <button
                    key={tt.id}
                    onClick={() => setActive(i)}
                    aria-label={`Vélemény ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer bg-transparent p-0 ${
                      i === active ? "w-6 bg-[#4c7cf8]" : "w-1.5 bg-[rgba(255,255,255,0.15)]"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Következő vélemény"
                className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#7080a8] transition-colors duration-200 hover:text-[#eef2ff] hover:border-[rgba(76,124,248,0.4)] cursor-pointer bg-transparent"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
