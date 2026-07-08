import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/sections/FooterSection";
import { LegalContent } from "@/components/LegalPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató — I&S Studio",
  description: "Adatvédelmi és adatkezelési tájékoztató — I&S Studio.",
};

export default async function AdatvedelemPage() {
  const contentRows = await prisma.siteContent.findMany();
  const content = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));

  return (
    <>
      <NavBar />
      <main>
        <LegalContent
          title="Adatkezelési tájékoztató"
          updated="2026. július 1."
          sections={[
            {
              heading: "1. Bevezetés",
              paragraphs: [
                "Az I&S Studio elkötelezett a személyes adatok átlátható, biztonságos és a hatályos jogszabályoknak (GDPR, Infotv.) megfelelő kezelése iránt. Jelen tájékoztató bemutatja, milyen adatokat kezelünk, milyen célból, és milyen jogok illetik meg az érintetteket.",
              ],
            },
            {
              heading: "2. Adatkezelő adatai",
              paragraphs: [],
              list: [
                "Név: I&S Studio (Illés Ákos egyéni vállalkozó)",
                "Székhely: 9012 Győr, Galgóczi Erzsébet utca 20-22 E. lph 1. emelet 4. ajtó",
                "E-mail: hello@isstudio.hu",
                "Telefon: +36 30 648 7399",
                "Adószám: 41924703-2-28",
                "Nyilvántartási szám: 59303525",
              ],
            },
            {
              heading: "3. Tárhelyszolgáltató (adatfeldolgozó)",
              paragraphs: [
                "A weboldal infrastruktúráját a Contabo GmbH (München, Németország) üzemelteti, mint adatfeldolgozó.",
              ],
            },
            {
              heading: "4. Kezelt adatok köre",
              paragraphs: [],
              list: [
                "Kapcsolati adatok: név, e-mail cím, telefonszám, üzenet tartalma",
                "Technikai adatok: IP-cím, böngésző típusa, látogatás időpontja",
                "Cookie-adatok",
                "Projekthez kapcsolódó üzleti információk",
              ],
            },
            {
              heading: "5. Az adatkezelés célja",
              paragraphs: [
                "A személyes adatok kezelése a kapcsolattartás és kommunikáció, a szolgáltatás nyújtása és a szerződés teljesítése, elemzési és marketing célú mérések, valamint jogi kötelezettségek teljesítése érdekében történik.",
              ],
            },
            {
              heading: "6. Harmadik felek, akikkel adatot osztunk meg",
              paragraphs: [],
              list: ["Contabo GmbH — tárhelyszolgáltatás", "Google Analytics 4 — látogatottsági elemzés", "Meta Pixel — marketing mérés"],
            },
            {
              heading: "7. Adatmegőrzési idők",
              paragraphs: [],
              list: [
                "Kapcsolati adatok: a kommunikáció lezárását követő 2 évig",
                "Technikai adatok: legfeljebb 12 hónapig",
                "Analitikai adatok: kb. 14 hónapig",
                "Számviteli bizonylatok: jogszabály szerint, jellemzően 8 évig",
              ],
            },
            {
              heading: "8. Az érintettek jogai",
              paragraphs: [
                "Az érintettek jogosultak a rájuk vonatkozó személyes adatokhoz hozzáférni, azok helyesbítését, törlését, kezelésének korlátozását kérni, adathordozhatósághoz és tiltakozáshoz való jogukkal élni. Ezen jogok a hello@isstudio.hu címen gyakorolhatók.",
              ],
            },
            {
              heading: "9. Panasztétel",
              paragraphs: [
                "Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH, Budapest) lehet élni, illetve bírósági jogorvoslattal is lehet élni.",
              ],
            },
          ]}
        />
      </main>
      <FooterSection content={content} />
    </>
  );
}
