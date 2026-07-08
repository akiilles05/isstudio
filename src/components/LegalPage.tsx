import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalContent({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  const items = sections.map((s) => ({ ...s, id: slugify(s.heading) }));

  return (
    <section className="pt-[clamp(140px,16vw,180px)] pb-[clamp(60px,8vw,100px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1100px] mx-auto">
        <Link
          href="/"
          className="text-[13px] text-accent inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft size={14} strokeWidth={2} /> Vissza a főoldalra
        </Link>

        <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Jogi dokumentum</p>
        <h1 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05] mb-4">
          {title}
        </h1>
        <p className="text-[13px] text-muted mb-16">Utolsó frissítés: {updated}</p>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-16 items-start">
          {/* TOC */}
          <nav className="hidden md:flex flex-col gap-1 sticky top-28 border-l border-navy/10 pl-5">
            <p className="text-[10.5px] font-medium text-accent tracking-[0.09em] uppercase mb-3">Tartalom</p>
            {items.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[13px] text-muted leading-[1.6] py-1 transition-colors duration-200 hover:text-ink"
              >
                {s.heading}
              </a>
            ))}
          </nav>

          {/* Content */}
          <div className="flex flex-col gap-14 max-w-[680px]">
            {items.map((s, i) => (
              <div key={i} id={s.id} className="scroll-mt-28">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-heading text-[13px] font-bold text-accent tracking-[0.05em] shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-lg font-bold text-navy tracking-[-0.02em]">{s.heading}</h2>
                </div>
                <div className="flex flex-col gap-3 pl-[30px]">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm text-muted leading-[1.8] font-light">
                      {p}
                    </p>
                  ))}
                </div>
                {s.list && (
                  <ul className="mt-3 ml-[30px] border border-navy/10 rounded-xl bg-navy/3 divide-y divide-navy/10 overflow-hidden">
                    {s.list.map((l, k) => (
                      <li key={k} className="text-sm text-ink leading-[1.7] font-light px-4 py-2.5">
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
