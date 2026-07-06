"use client";

import Image from "next/image";
import type { ContentMap } from "@/types";
import { openCookieSettings } from "@/lib/cookie-consent";

const linkClasses = "text-[13px] text-[#506480] transition-colors duration-200 hover:text-[#d0daf5]";
const colLabelClasses = "text-[10.5px] text-[#4c7cf8] tracking-[0.09em] uppercase font-medium mb-4";

export default function FooterSection({ content }: { content: ContentMap }) {
  const email = content.hero_email ?? "illes.akos@illesinnovate.hu";
  const desc = content.footer_desc ?? "Skálázható digitális rendszerek tervezése és fejlesztése.";
  const linkedin = content.social_linkedin ?? "#";
  const github = content.social_github ?? "#";
  const instagram = content.social_instagram ?? "#";

  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] pt-16 pb-12 px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-start flex-wrap gap-12 mb-14">
          <div className="max-w-[280px]">
            <p className="flex items-center gap-2.5 font-heading text-[17px] font-extrabold tracking-[-0.03em] mb-3 text-[#eef2ff]">
              <Image src="/logo-mark.png" alt="" width={294} height={686} className="h-[20px] w-auto" />
              I&S Studio<span className="text-[#4c7cf8]">.</span>
            </p>
            <p className="text-[13px] text-[#506480] leading-[1.65]">{desc}</p>
          </div>
          <div className="flex gap-14 flex-wrap">
            <div>
              <p className={colLabelClasses}>Navigáció</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "/#munkak", label: "Munkáink" },
                  { href: "/#folyamat", label: "Folyamat" },
                  { href: "/#rolam", label: "Rólunk" },
                  { href: "/#kapcsolat", label: "Kapcsolat" },
                ].map((l) => (
                  <a key={l.href} href={l.href} className={linkClasses}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className={colLabelClasses}>Elérhetőség</p>
              <div className="flex flex-col gap-2.5">
                <a href={`mailto:${email}`} className={`${linkClasses} hover:text-[#4c7cf8]`}>
                  {email}
                </a>
                <a href="https://illesinnovate.hu" className={linkClasses}>
                  illesinnovate.hu
                </a>
                <p className="text-[13px] text-[#506480]">Győr &amp; Budapest</p>
              </div>
            </div>
            <div>
              <p className={colLabelClasses}>Social</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: linkedin, label: "LinkedIn" },
                  { href: github, label: "GitHub" },
                  { href: instagram, label: "Instagram" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-[rgba(255,255,255,0.04)] flex-wrap gap-4">
          <p className="text-xs text-[#506480]">© 2026 I&S Studio. Minden jog fenntartva.</p>
          <div className="flex gap-6 flex-wrap">
            {[
              { href: "/adatvedelem", label: "Adatvédelem" },
              { href: "/aszf", label: "ÁSZF" },
              { href: "/impresszum", label: "Impresszum" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-xs text-[#506480] transition-colors duration-200 hover:text-[#5e7090]">
                {l.label}
              </a>
            ))}
            <button
              onClick={openCookieSettings}
              className="text-xs text-[#506480] transition-colors duration-200 hover:text-[#5e7090] cursor-pointer bg-transparent border-none p-0"
            >
              Cookie beállítások
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
