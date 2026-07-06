"use client";

import { useEffect } from "react";
import Script from "next/script";
import { getStoredConsent } from "@/lib/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function gtagConsentUpdate(analytics: boolean, marketing: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID) return;

    const stored = getStoredConsent();
    if (stored) gtagConsentUpdate(stored.analytics, stored.marketing);

    const onConsentChange = (e: Event) => {
      const consent = (e as CustomEvent).detail as { analytics: boolean; marketing: boolean };
      gtagConsentUpdate(consent.analytics, consent.marketing);
    };
    window.addEventListener("cookie-consent-changed", onConsentChange);
    return () => window.removeEventListener("cookie-consent-changed", onConsentChange);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
            window.gtag = gtag;
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
