"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";

export default function PortfolioSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const ap = projects[active];

  return (
    <section id="munkak" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-[72px]">
          <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">Kiemelt munkák</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05]">
            Munkáink.
          </h2>
          <p className="text-[15px] text-[#6b7b9b] max-w-[480px] leading-[1.7] mt-4">
            Valódi projektek — azoknak a vállalkozásoknak, akikkel szívesen dolgozunk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Project list */}
          <div className="flex flex-col gap-1.5">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/munkak/${p.slug}`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between px-5 py-[22px] rounded-[10px] cursor-pointer border transition-[background,border-color] duration-250 ease-in-out ${
                  i === active
                    ? "bg-[rgba(76,124,248,0.06)] border-[rgba(76,124,248,0.35)]"
                    : "bg-transparent border-[rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`font-heading text-[11px] font-bold tracking-[0.05em] min-w-[22px] transition-colors duration-250 ease-in-out ${
                      i === active ? "text-[#4c7cf8]" : "text-[#3a4e68]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className={`font-heading text-lg font-bold tracking-[-0.025em] leading-[1.2] transition-colors duration-250 ease-in-out ${
                        i === active ? "text-[#e8eeff]" : "text-[#7080a8]"
                      }`}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs text-[#506480] mt-[3px]">{p.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[#4c7cf8] transition-opacity duration-250 ease-in-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>

          {/* Preview panel — hidden on mobile */}
          {ap && (
            <div className="hidden md:flex sticky top-24 flex-col gap-4">
              <div
                className="rounded-xl border border-[rgba(255,255,255,0.07)] overflow-hidden relative transition-[background] duration-500 ease-in-out"
                style={{ background: ap.previewBg }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-[13px] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.25)]">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-[9px] h-[9px] rounded-full bg-[rgba(255,255,255,0.1)] block flex-shrink-0" />
                  ))}
                  <div className="flex-1 bg-[rgba(255,255,255,0.06)] rounded h-5 ml-2 flex items-center pl-2.5">
                    <span className="text-[10.5px] text-[rgba(255,255,255,0.22)]">{ap.domain}</span>
                  </div>
                </div>

                {/* Preview content */}
                {ap.image ? (
                  <div className="min-h-[320px] relative overflow-hidden">
                    <img src={ap.image} alt={ap.title} className="w-full h-[320px] object-cover object-top block" />
                  </div>
                ) : (
                  <div className="px-5 py-6 flex flex-col gap-2.5 min-h-[320px]">
                    <div className="bg-[rgba(255,255,255,0.03)] rounded-lg px-[22px] py-7 flex flex-col gap-2.5 flex-[2]">
                      <div className="h-[7px] w-[32%] bg-[rgba(255,255,255,0.06)] rounded" />
                      <div className="h-[21px] w-[72%] bg-[rgba(255,255,255,0.1)] rounded" />
                      <div className="h-[17px] w-1/2 bg-[rgba(255,255,255,0.07)] rounded" />
                      <div className="flex gap-2 mt-2">
                        <div className="h-[30px] w-[94px] rounded-md opacity-75" style={{ background: ap.accentColor }} />
                        <div className="h-[30px] w-[78px] bg-[rgba(255,255,255,0.06)] rounded-md" />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-1">
                      {[0, 1, 2].map((k) => (
                        <div key={k} className="flex-1 bg-[rgba(255,255,255,0.03)] rounded-lg min-h-16" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Live badge */}
                <div className="absolute bottom-3.5 right-3.5 bg-[rgba(7,9,28,0.75)] border border-[rgba(255,255,255,0.1)] rounded-full px-[13px] py-[5px] flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full block flex-shrink-0 animate-[dot-blink_2.5s_ease-in-out_infinite]" />
                  <span className="text-[10.5px] text-[rgba(255,255,255,0.6)]">{ap.title}</span>
                </div>
              </div>

              {ap.url && ap.url !== "#" && (
                <a
                  href={ap.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#4c7cf8] font-medium"
                >
                  Megnézem <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
