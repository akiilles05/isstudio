import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/sections/FooterSection";
import { LegalContent } from "@/components/LegalPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Impresszum - I&S Studio",
  description: "Impresszum - I&S Studio.",
};

export default async function ImpresszumPage() {
  const contentRows = await prisma.siteContent.findMany();
  const content = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));

  return (
    <>
      <NavBar />
      <main>
        <LegalContent
          title="Impresszum"
          updated="2026. július 1."
          sections={[
            {
              heading: "Szolgáltató adatai",
              paragraphs: [],
              list: [
                "Név: I&S Studio (Illés Ákos egyéni vállalkozó)",
                "Székhely: 9012 Győr, Galgóczi Erzsébet utca 20-22 E. lph 1. emelet 4. ajtó",
                "E-mail: hello@isstudio.hu / hello@isstudio.hu",
                "Telefon: +36 30 648 7399",
                "Adószám: 41924703-2-28",
                "Nyilvántartási szám: 59303525",
              ],
            },
            {
              heading: "Tárhelyszolgáltató",
              paragraphs: ["Contabo GmbH, München, Németország."],
            },
            {
              heading: "Tevékenységi kör",
              paragraphs: ["Főtevékenység:"],
              list: ["621001 - Számítógépes programozás m.n.s."],
            },
            {
              heading: "Egyéb tevékenységek",
              paragraphs: [],
              list: [
                "621002 - Egyedi szoftverfejlesztés",
                "621003 - Rendszerszervezési, -karbantartási tanácsadás",
                "621004 - Weblap tervezése (webdizájn)",
                "622001 - Egyéb számítástechnikai szakértés, tanácsadás",
                "622002 - Hardver-szaktanácsadás",
                "622003 - Számítógép-üzemeltetés",
                "731101 - Reklámtervezés, -készítés, -elhelyezés",
              ],
            },
            {
              heading: "Egyéb",
              paragraphs: [
                "A Szolgáltató fenntartja a jogot a jelen tájékoztató módosítására. Kérdés esetén keresse az I&S Studio csapatát a hello@isstudio.hu címen.",
                "© 2026 I&S Studio. Minden jog fenntartva.",
              ],
            },
          ]}
        />
      </main>
      <FooterSection content={content} />
    </>
  );
}
