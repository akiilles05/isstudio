"use client";

import type { ContentMap } from "@/types";
import { useInView } from "@/hooks/useInView";

const skills = ["Webfejlesztés", "Webdesign", "SEO", "Automatizálás", "Pénzügy"];

export default function AboutSection({ content }: { content: ContentMap }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const title = content.about_title ?? "Két fejlesztő, egy cél.";
  const p1 = content.about_p1 ?? "";
  const p2 = content.about_p2 ?? "";
  const s1v = content.about_stat1_val ?? "5+";
  const s1l = content.about_stat1_label ?? "Év tapasztalat";
  const s2v = content.about_stat2_val ?? "20+";
  const s2l = content.about_stat2_label ?? "Elkészült projekt";
  const s3v = content.about_stat3_val ?? "2 in 1";
  const s3l = content.about_stat3_label ?? "Kettős szakértelem";

  return (
    <section
      id="rolam"
      className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)] bg-navy/3 border-t border-b border-navy/8"
    >
      <div className="max-w-[1280px] mx-auto" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Photos — staggered duo */}
          <div className="flex gap-5 items-start max-w-[440px] mx-auto">
            <div
              className={`w-[52%] rounded-2xl overflow-hidden aspect-[3/4] relative border border-navy/10 shadow-[0_20px_50px_-24px_rgba(13,59,102,0.3)] transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <img
                src="/profile.png"
                alt="Illés Ákos — alapító &amp; fejlesztő"
                className="w-full h-full object-cover object-top block [filter:grayscale(12%)_contrast(1.04)] transition-transform duration-700 ease-out hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(from var(--color-navy-dark) r g b / 0.65) 0%, transparent 50%)" }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-navy-dark/78 border border-navy/15 rounded-[10px] px-3 py-2.5 backdrop-blur-md">
                <p className="font-heading text-xs font-bold text-navy tracking-[-0.01em]">Illés Ákos</p>
                <p className="text-[10px] text-muted mt-[3px]">Alapító &amp; fejlesztő</p>
              </div>
            </div>
            <div
              className={`w-[48%] mt-10 rounded-2xl overflow-hidden aspect-[3/4] relative border border-navy/10 shadow-[0_20px_50px_-24px_rgba(13,59,102,0.3)] transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <img
                src="/nandor.jpg"
                alt="Stecenkó Nándor — alapító &amp; fejlesztő"
                className="w-full h-full object-cover object-top block [filter:grayscale(12%)_contrast(1.04)] transition-transform duration-700 ease-out hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(from var(--color-navy-dark) r g b / 0.65) 0%, transparent 50%)" }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-navy-dark/78 border border-navy/15 rounded-[10px] px-3 py-2.5 backdrop-blur-md">
                <p className="font-heading text-xs font-bold text-navy tracking-[-0.01em]">Stecenkó Nándor</p>
                <p className="text-[10px] text-muted mt-[3px]">Alapító &amp; fejlesztő</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div
            className={`transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Rólunk</p>
            <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.08] mb-7">
              {title}
            </h2>
            <p className="text-[15px] font-light text-muted leading-[1.78] mb-4">{p1}</p>
            <p className="text-[15px] font-light text-muted leading-[1.78] mb-10">{p2}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 border border-navy/10 rounded-xl overflow-hidden mb-9">
              {[
                { val: s1v, label: s1l, border: false },
                { val: s2v, label: s2l, border: true },
                { val: s3v, label: s3l, border: false },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`px-4 py-6 text-center transition-all duration-500 ease-out ${
                    s.border ? "border-l border-r border-navy/10" : ""
                  } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <p className="font-heading text-[2.5rem] font-extrabold text-accent tracking-[-0.04em] leading-none">
                    {s.val}
                  </p>
                  <p className="text-[11px] text-muted mt-1.5 tracking-[0.02em]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Skill tags */}
            <div className="flex gap-2 flex-wrap">
              {skills.map((sk, i) => (
                <span
                  key={sk}
                  className={`px-[15px] py-[7px] border border-accent/22 rounded-full text-xs text-muted bg-accent/4 transition-all duration-500 ease-out ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{ transitionDelay: `${700 + i * 60}ms` }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
