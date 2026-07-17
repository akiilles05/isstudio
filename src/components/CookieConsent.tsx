"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import {
  type CookieConsent as Consent,
  OPEN_COOKIE_SETTINGS_EVENT,
  getStoredConsent,
  storeConsent,
} from "@/lib/cookie-consent";

const toggleLabels: { key: keyof Omit<Consent, "necessary">; title: string; desc: string }[] = [
  {
    key: "analytics",
    title: "Statisztikai",
    desc: "Segít megérteni, hogyan használják a látogatók az oldalt (pl. Google Analytics).",
  },
  {
    key: "marketing",
    title: "Marketing",
    desc: "Releváns hirdetések megjelenítésére és mérésére szolgál (pl. Meta Pixel).",
  },
];

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Consent>({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
    else setDraft(stored);

    const onOpenSettings = () => {
      setDraft(getStoredConsent() ?? { necessary: true, analytics: false, marketing: false });
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  function acceptAll() {
    storeConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
    setSettingsOpen(false);
  }

  function rejectAll() {
    storeConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
    setSettingsOpen(false);
  }

  function saveSettings() {
    storeConsent(draft);
    setVisible(false);
    setSettingsOpen(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="w-full max-w-[560px] rounded-2xl border border-navy/15 bg-bg/98 backdrop-blur-xl shadow-[0_20px_60px_rgba(13,59,102,0.16)] overflow-hidden">
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="w-9 h-9 rounded-full bg-accent/12 flex items-center justify-center flex-shrink-0">
            <Cookie size={18} className="text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-[15px] font-bold text-navy tracking-[-0.02em]">
              Süti (cookie) beállítások
            </h2>
            <p className="text-[13px] text-muted leading-[1.6] mt-1.5">
              A szükséges sütiken kívül statisztikai és marketing célú sütiket is használunk a{" "}
              <a href="/adatvedelem" className="text-accent hover:underline">
                adatvédelmi tájékoztatóban
              </a>{" "}
              leírtak szerint. Ezekhez a hozzájárulásod szükséges.
            </p>
          </div>
          {settingsOpen && (
            <button
              onClick={() => setSettingsOpen(false)}
              aria-label="Bezárás"
              className="text-muted hover:text-ink transition-colors duration-200 bg-transparent flex-shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {settingsOpen && (
          <div className="flex flex-col gap-3 px-6 pt-5">
            <div className="flex items-start justify-between gap-4 py-2">
              <div>
                <p className="text-[13px] font-medium text-ink">Szükséges</p>
                <p className="text-xs text-muted mt-0.5">Az oldal alapműködéséhez elengedhetetlen, mindig aktív.</p>
              </div>
              <span className="mt-0.5 flex-shrink-0 w-9 h-5 rounded-full bg-accent/50 relative">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white block" />
              </span>
            </div>
            {toggleLabels.map((t) => (
              <div key={t.key} className="flex items-start justify-between gap-4 py-2 border-t border-navy/10">
                <div>
                  <p className="text-[13px] font-medium text-ink">{t.title}</p>
                  <p className="text-xs text-muted mt-0.5">{t.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={draft[t.key]}
                  aria-label={t.title}
                  onClick={() => setDraft((d) => ({ ...d, [t.key]: !d[t.key] }))}
                  className={`mt-0.5 flex-shrink-0 w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer bg-transparent p-0 ${
                    draft[t.key] ? "bg-accent" : "bg-navy/16"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white block transition-[left] duration-200 ${
                      draft[t.key] ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 px-6 py-5 mt-2">
          {settingsOpen ? (
            <button
              onClick={saveSettings}
              className="flex-1 bg-accent text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:bg-accent-dark cursor-pointer border-none"
            >
              Beállítások mentése
            </button>
          ) : (
            <>
              <button
                onClick={acceptAll}
                className="flex-1 bg-accent text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:bg-accent-dark cursor-pointer border-none"
              >
                Összes elfogadása
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 border border-navy/16 text-ink px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:border-navy/35 hover:text-navy cursor-pointer bg-transparent"
              >
                Csak szükséges
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ink cursor-pointer bg-transparent border-none"
              >
                Beállítások
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
