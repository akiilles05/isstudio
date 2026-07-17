"use client";

import Image from "next/image";
import type { ContentMap } from "@/types";
import { openCookieSettings } from "@/lib/cookie-consent";
import ThemeToggle from "@/components/ThemeToggle";
import { trackEvent } from "@/lib/analytics";

const linkClasses = "text-[13px] text-muted transition-colors duration-200 hover:text-ink";
const colLabelClasses = "text-[10.5px] text-accent tracking-[0.09em] uppercase font-medium mb-4";

export default function FooterSection({ content }: { content: ContentMap }) {
  const email = content.hero_email ?? "hello@isstudio.hu";
  const desc = content.footer_desc ?? "Skálázható digitális rendszerek tervezése és fejlesztése.";
  const linkedin = content.social_linkedin ?? "https://www.linkedin.com/company/is-studio-hu";
  const facebook = content.social_facebook ?? "https://www.facebook.com/isstudiohu";
  const instagram = content.social_instagram ?? "https://www.instagram.com/i_s_studio";

  return (
    <footer className="border-t border-navy/8 pt-16 pb-12 px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-start flex-wrap gap-12 mb-14">
          <div className="max-w-[280px]">
            <p className="flex items-center gap-2.5 font-heading text-[17px] font-extrabold tracking-[-0.03em] mb-3 text-navy">
              <Image src="/logo-mark-navy.png" alt="" width={294} height={686} className="h-[20px] w-auto block dark:hidden" />
              <Image src="/logo-mark-white.png" alt="" width={1364} height={765} className="h-[20px] w-auto hidden dark:block" />
              I&S Studio<span className="text-accent">.</span>
            </p>
            <p className="text-[13px] text-muted leading-[1.65]">{desc}</p>
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
                  { href: "/videohivas", label: "Videóhívás" },
                ].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() =>
                      l.href === "/#kapcsolat" && trackEvent("cta_click", { cta_location: "footer_nav" })
                    }
                    className={linkClasses}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className={colLabelClasses}>Elérhetőség</p>
              <div className="flex flex-col gap-2.5">
                <a href={`mailto:${email}`} className={`${linkClasses} hover:text-accent`}>
                  {email}
                </a>
                <a
                  href="https://isstudio.hu"
                  onClick={() => trackEvent("outbound_click", { link_domain: "isstudio.hu", link_url: "https://isstudio.hu" })}
                  className={linkClasses}
                >
                  isstudio.hu
                </a>
                <p className="text-[13px] text-muted">Győr &amp; Budapest</p>
              </div>
            </div>
            <div>
              <p className={colLabelClasses}>Social</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: linkedin, label: "LinkedIn" },
                  { href: facebook, label: "Facebook" },
                  { href: instagram, label: "Instagram" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("outbound_click", { link_domain: s.label, link_url: s.href })}
                    className={linkClasses}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className={colLabelClasses}>Jogi</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "/adatvedelem", label: "Adatvédelem" },
                  { href: "/aszf", label: "ÁSZF", rel: "terms-of-service" },
                  { href: "/impresszum", label: "Impresszum" },
                ].map((l) => (
                  <a key={l.href} href={l.href} rel={l.rel} className={linkClasses}>
                    {l.label}
                  </a>
                ))}
                <button
                  onClick={openCookieSettings}
                  className={`${linkClasses} cursor-pointer bg-transparent border-none p-0 text-left`}
                >
                  Cookie beállítások
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-navy/8">
          <p className="text-xs text-muted text-center md:text-left">
            © 2026 I&amp;S Studio. Minden jog fenntartva.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
