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
      <div className="w-full max-w-[560px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(10,13,32,0.98)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-start gap-3 px-6 pt-6">
          <div className="w-9 h-9 rounded-full bg-[rgba(76,124,248,0.12)] flex items-center justify-center flex-shrink-0">
            <Cookie size={18} className="text-[#4c7cf8]" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-[15px] font-bold text-[#eef2ff] tracking-[-0.02em]">
              Süti (cookie) beállítások
            </h2>
            <p className="text-[13px] text-[#8592b0] leading-[1.6] mt-1.5">
              A szükséges sütiken kívül statisztikai és marketing célú sütiket is használunk a{" "}
              <a href="/adatvedelem" className="text-[#4c7cf8] hover:underline">
                adatvédelmi tájékoztatóban
              </a>{" "}
              leírtak szerint. Ezekhez a hozzájárulásod szükséges.
            </p>
          </div>
          {settingsOpen && (
            <button
              onClick={() => setSettingsOpen(false)}
              aria-label="Bezárás"
              className="text-[#5e7090] hover:text-[#d0daf5] transition-colors duration-200 bg-transparent flex-shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {settingsOpen && (
          <div className="flex flex-col gap-3 px-6 pt-5">
            <div className="flex items-start justify-between gap-4 py-2">
              <div>
                <p className="text-[13px] font-medium text-[#c0ccea]">Szükséges</p>
                <p className="text-xs text-[#5e7090] mt-0.5">Az oldal alapműködéséhez elengedhetetlen, mindig aktív.</p>
              </div>
              <span className="mt-0.5 flex-shrink-0 w-9 h-5 rounded-full bg-[rgba(76,124,248,0.5)] relative">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white block" />
              </span>
            </div>
            {toggleLabels.map((t) => (
              <div key={t.key} className="flex items-start justify-between gap-4 py-2 border-t border-[rgba(255,255,255,0.06)]">
                <div>
                  <p className="text-[13px] font-medium text-[#c0ccea]">{t.title}</p>
                  <p className="text-xs text-[#5e7090] mt-0.5">{t.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={draft[t.key]}
                  onClick={() => setDraft((d) => ({ ...d, [t.key]: !d[t.key] }))}
                  className={`mt-0.5 flex-shrink-0 w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer bg-transparent p-0 ${
                    draft[t.key] ? "bg-[#4c7cf8]" : "bg-[rgba(255,255,255,0.12)]"
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
              className="flex-1 bg-[#4c7cf8] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:bg-[#6390fa] cursor-pointer border-none"
            >
              Beállítások mentése
            </button>
          ) : (
            <>
              <button
                onClick={acceptAll}
                className="flex-1 bg-[#4c7cf8] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:bg-[#6390fa] cursor-pointer border-none"
              >
                Összes elfogadása
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 border border-[rgba(255,255,255,0.12)] text-[#c0ccea] px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-200 hover:border-[rgba(255,255,255,0.3)] hover:text-white cursor-pointer bg-transparent"
              >
                Csak szükséges
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-[#7080a8] transition-colors duration-200 hover:text-[#d0daf5] cursor-pointer bg-transparent border-none"
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
