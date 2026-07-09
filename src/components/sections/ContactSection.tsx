"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { ContentMap } from "@/types";

const inputClasses =
  "w-full bg-navy/3 border border-navy/12 rounded-lg px-4 py-3.5 text-ink text-sm outline-none transition-[border-color,background] duration-200 focus:border-accent/50 focus:bg-accent/4";

export default function ContactSection({ content }: { content: ContentMap }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = content.hero_email ?? "hello@isstudio.hu";
  const title = content.contact_title ?? "Kezdjük el a projekted.";
  const desc = content.contact_desc ?? "Mesélj a vállalkozásodról.";
  const info = content.contact_info ?? "";
  const linkedin = content.social_linkedin ?? "https://www.linkedin.com/company/is-studio-hu";
  const facebook = content.social_facebook ?? "https://www.facebook.com/isstudiohu";
  const instagram = content.social_instagram ?? "https://www.instagram.com/i_s_studio";


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Hiba");
      setSent(true);
    } catch {
      setError("Valami hiba történt, kérlek próbáld újra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="kapcsolat" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-[72px]">
          <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Kapcsolat</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05] max-w-[680px]">
            {title}
          </h2>
          <p className="text-[15px] text-muted max-w-[460px] leading-[1.72] mt-4">{desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          {/* Left info */}
          <div className="flex flex-col gap-10">
            <div>
              <a
                href={`mailto:${email}`}
                className="font-heading text-[clamp(1.1rem,2.2vw,1.7rem)] font-bold text-ink tracking-[-0.025em] transition-colors duration-200 inline-flex items-center gap-2.5 hover:text-accent"
              >
                {email} <ArrowRight size={18} className="text-accent" />
              </a>
              <p className="text-[13px] text-muted mt-2.5">Győr &amp; Budapest, Magyarország</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase">Social</p>
              <div className="flex gap-6 flex-wrap">
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
                    className="text-[13px] text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            {info && (
              <div className="px-6 py-[22px] bg-accent/5 border border-accent/15 rounded-xl">
                <p className="text-[13px] text-muted leading-[1.72]">{info}</p>
              </div>
            )}
          </div>

          {/* Right form */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <input name="name" type="text" placeholder="Neved" required className={inputClasses} />
                <input name="email" type="email" placeholder="E-mail cím" required className={inputClasses} />
                <input name="company" type="text" placeholder="Vállalkozás neve (opcionális)" className={inputClasses} />
                <textarea
                  name="message"
                  placeholder="A projekt részletei..."
                  required
                  rows={5}
                  className={`${inputClasses} resize-y min-h-[120px]`}
                />
                {error && <p className="text-[13px] text-[#f87171]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`text-white border-none px-7 py-3.5 rounded-lg text-sm font-medium self-start flex items-center gap-2 transition-colors duration-200 ${
                    loading ? "bg-accent-dark cursor-not-allowed" : "bg-accent cursor-pointer"
                  }`}
                >
                  {loading ? (
                    "Küldés..."
                  ) : (
                    <>
                      Ötletem elküldése <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-start gap-5 pt-10">
                <div className="w-[52px] h-[52px] bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.28)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={22} className="text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="font-heading text-[21px] font-bold text-navy tracking-[-0.02em] mb-2">
                    Köszönjük! Hamarosan jelentkezünk.
                  </h3>
                  <p className="text-sm text-muted leading-[1.7]">Általában 24 órán belül válaszolunk.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
