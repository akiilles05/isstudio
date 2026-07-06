import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = "https://illesinnovate.hu";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "I&S Studio — Webfejlesztés Győr & Budapest",
    template: "%s — I&S Studio",
  },
  description:
    "Modern, eredményorientált webfejlesztés magyar KKV-knak. Ahol az üzleti cél az első, a kód utána jön.",
  keywords: ["webfejlesztés", "webdesign", "győr", "budapest", "seo", "next.js"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "I&S Studio",
    description: "Weboldal, ami dolgozik helyetted.",
    url: siteUrl,
    siteName: "I&S Studio",
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I&S Studio",
    description: "Weboldal, ami dolgozik helyetted.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "I&S Studio",
  url: siteUrl,
  email: "kapcsolat@illesinnovate.hu",
  telephone: "+36306487399",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Galgóczi Erzsébet utca 20-22 E. lph 1. emelet 4. ajtó",
    addressLocality: "Győr",
    postalCode: "9012",
    addressCountry: "HU",
  },
  areaServed: ["Győr", "Budapest", "Magyarország"],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GoogleAnalytics />
      </head>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
