import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/sections/FooterSection";
import { LegalContent } from "@/components/LegalPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ÁSZF — I&S Studio",
  description: "Általános Szerződési Feltételek — I&S Studio.",
};

export default async function ASZFPage() {
  const contentRows = await prisma.siteContent.findMany();
  const content = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));

  return (
    <>
      <NavBar />
      <main>
        <LegalContent
          title="Általános Szerződési Feltételek"
          updated="2026. július 1."
          sections={[
            {
              heading: "1. Általános rendelkezések",
              paragraphs: [
                "Jelen ÁSZF tartalmazza az I&S Studio (Illés Ákos egyéni vállalkozó) által nyújtott szolgáltatások feltételeit.",
              ],
              list: [
                "Név: I&S Studio",
                "Székhely: 9012 Győr, Galgóczi Erzsébet utca 20-22 E. lph 1. emelet 4. ajtó",
                "E-mail: hello@isstudio.hu",
                "Telefon: +36 30 648 7399",
                "Adószám: 41924703-2-28",
                "Nyilvántartási szám: 59303525",
              ],
            },
            {
              heading: "2. Szolgáltatások",
              paragraphs: ["A Szolgáltató az alábbi szolgáltatásokat nyújtja:"],
              list: [
                "Weboldal tervezés és fejlesztés",
                "Alkalmazásfejlesztés és szoftverfejlesztés",
                "No-code / low-code automatizáció",
                "Informatikai tanácsadás",
                "Weboldal karbantartás",
              ],
            },
            {
              heading: "3. Szerződéskötés",
              paragraphs: [
                "A szerződés a Megrendelő írásbeli megrendelésének Szolgáltató általi visszaigazolásával jön létre. A megerősítés tartalmazza a szolgáltatás leírását, időpontját és költségét. A vállalkozás fenntartja a visszautasítás jogát indoklás nélkül.",
              ],
            },
            {
              heading: "4. Árak és fizetési feltételek",
              paragraphs: [
                "Az árak forintban értendők és ÁFA-t tartalmaznak. Fizetési lehetőségek: banki átutalás, készpénz, online fizetés kártyával.",
                "A számla kiegyenlítésének határideje 8 nap. Késedelmes kifizetésnél késedelmi kamat számlázható.",
              ],
            },
            {
              heading: "5. Teljesítés és határidők",
              paragraphs: [
                "A Szolgáltató vállalja, hogy a szolgáltatást a megállapított határidőre teljesíti. Időpontmódosítás csak írásban lehetséges. Vis maior esetén (katasztrófák, háborúk, járványok) a kötelezettség alól mentesül.",
              ],
            },
            {
              heading: "6. Szerzői jogok",
              paragraphs: [
                "Szerzői jogok a teljes kifizetés után átszállnak a Megrendelőre, kivéve a Szolgáltató saját fejlesztésű eszközeit és módszereit. A vállalkozás referenciaként felhasználhatja a munkákat.",
              ],
            },
            {
              heading: "7. Garancia és szavatosság",
              paragraphs: [
                "A Szolgáltató 30 napos garanciát vállal a szolgáltatás hibamentes működésére. A garancia nem vonatkozik a Megrendelő által okozott károkra.",
              ],
            },
            {
              heading: "8. Felelősség korlátozása",
              paragraphs: [
                "A felelősség maximum a rendelés értékéig terjedhet. A Szolgáltató nem felel az elmaradt haszonért vagy közvetett károkért. A Megrendelő köteles biztonsági másolatot készíteni.",
              ],
            },
            {
              heading: "9. Elállási jog",
              paragraphs: [
                "Fogyasztó Megrendelőket 14 napos elállási jog illeti meg a szerződéskötéstől számítva, feltéve, ha a teljesítés még nem kezdődött meg. Egyedi igények szerint készített szolgáltatásoknál az elállási jog nem gyakorolható.",
              ],
            },
            {
              heading: "10. Panaszkezelés",
              paragraphs: ["Panaszok bejelentésének elérhetőségei:", "A panaszokat 30 napon belül kivizsgáljuk és írásban válaszolunk."],
              list: [
                "E-mail: hello@isstudio.hu",
                "Telefon: +36 30 648 7399",
                "Postai cím: 9012 Győr, Galgóczi Erzsébet utca 20-22",
              ],
            },
            {
              heading: "11. Alkalmazandó jog és jogviták",
              paragraphs: [
                "Jelen ÁSZF-re a magyar jog az irányadó. Viták esetén a felek békés rendezésre törekednek. Jogorvoslat a Győri Járásbíróság vagy Törvényszék előtt kezdeményezhető.",
              ],
            },
            {
              heading: "12. Záró rendelkezések",
              paragraphs: [
                "Jelen ÁSZF 2025. június 18-tól hatályos. A Szolgáltató fenntartja a jogot az egyoldalú módosításra, amelyről előzetesen értesíti a Megrendelőket. A módosítás a folyamatban lévő szerződéseket nem érinti.",
              ],
            },
          ]}
        />
      </main>
      <FooterSection content={content} />
    </>
  );
}
