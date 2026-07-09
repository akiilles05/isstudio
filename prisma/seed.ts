import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "illes.akos@isstudio.hu" },
    update: {},
    create: { email: "illes.akos@isstudio.hu", passwordHash: hash },
  });

  // Site content
  const content = [
    { key: "hero_tag", value: "Webfejlesztés · Győr & Budapest", label: "Hero tag", group: "hero" },
    { key: "hero_title", value: "Weboldal, ami\ndolgozik helyetted.", label: "Hero cím", group: "hero" },
    { key: "hero_desc", value: "Modern, eredményorientált webfejlesztés magyar KKV-knak. Ahol az üzleti cél az első, a kód utána jön.", label: "Hero leírás", group: "hero" },
    { key: "hero_email", value: "illes.akos@isstudio.hu", label: "Email cím", group: "hero" },
    { key: "about_title", value: "Sziasztok, Illés Ákos vagyok.", label: "Rólam cím", group: "about" },
    { key: "about_p1", value: "5+ év tapasztalattal, pénzügyi és informatikai kettős szakértelemmel segítek vállalkozásoknak valódi üzleti eredményt elérni digitális eszközökkel.", label: "Rólam 1. bekezdés", group: "about" },
    { key: "about_p2", value: "Nem ügynökségi workflow-t kapsz - közvetlen, nyugodt partneri együttműködést. Veled egyeztetek végig, átlátható folyamattal, stabil technikai alapon.", label: "Rólam 2. bekezdés", group: "about" },
    { key: "about_stat1_val", value: "5+", label: "Stat 1 érték", group: "about" },
    { key: "about_stat1_label", value: "Év tapasztalat", label: "Stat 1 szöveg", group: "about" },
    { key: "about_stat2_val", value: "20+", label: "Stat 2 érték", group: "about" },
    { key: "about_stat2_label", value: "Elkészült projekt", label: "Stat 2 szöveg", group: "about" },
    { key: "about_stat3_val", value: "2 in 1", label: "Stat 3 érték", group: "about" },
    { key: "about_stat3_label", value: "Kettős szakértelem", label: "Stat 3 szöveg", group: "about" },
    { key: "contact_title", value: "Kezdjük el a projekted.", label: "Kapcsolat cím", group: "contact" },
    { key: "contact_desc", value: "Mesélj a vállalkozásodról. Egy napon belül válaszolok ötletekkel és konkrét javaslattal.", label: "Kapcsolat leírás", group: "contact" },
    { key: "contact_info", value: "Az együttműködés általában egy rövid konzultációval indul - áttekintjük a célokat és a lehetséges megoldásokat. Nincs elköteleződés, nincs díj.", label: "Kapcsolat info box", group: "contact" },
    { key: "footer_desc", value: "Skálázható digitális rendszerek tervezése és fejlesztése. Nem ügynökség - rendszerépítő partner.", label: "Footer leírás", group: "footer" },
    { key: "social_linkedin", value: "https://linkedin.com/company/illes-innovate", label: "LinkedIn URL", group: "social" },
    { key: "social_github", value: "https://github.com/Illes-Innovate", label: "GitHub URL", group: "social" },
    { key: "social_instagram", value: "https://instagram.com/illesinnovate", label: "Instagram URL", group: "social" },
    { key: "social_facebook", value: "#", label: "Facebook URL", group: "social" },
    { key: "booking_title", value: "Foglalj egy ingyenes konzultációt.", label: "Foglalás cím", group: "booking" },
    { key: "booking_desc", value: "30 perc, kötelezettség nélkül - átbeszéljük az ötleted és a lehetséges megoldást.", label: "Foglalás leírás", group: "booking" },
  ];

  for (const c of content) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: { value: c.value, label: c.label, group: c.group },
      create: c,
    });
  }

  // Projects
  const projects = [
    { order: 1, title: "Fonalbaba.hu", subtitle: "E-commerce · Kézműves", url: "https://fonalbaba.hu", domain: "fonalbaba.hu", slug: "fonalbaba", accentColor: "#4c7cf8", previewBg: "linear-gradient(145deg, #08122a 0%, #0d1e52 55%, #091430 100%)", image: "/projects/fonalbaba.webp", content: "A Fonalbaba.hu egy kézműves fonalakat és kiegészítőket árusító webshop, amit a nulláról építettem fel - a termékkatalógustól a fizetési folyamatig.\n\nA cél egy gyors, mobilbarát felület volt, ami nem csak szépen néz ki, hanem tényleg konvertál: átlátható kategóriastruktúra, gyors kereső, és zökkenőmentes checkout.", results: "40%|Konverziónövekedés\n1.2s|Betöltési idő\n95+|Lighthouse score" },
    { order: 2, title: "Mex&Mex", subtitle: "Személyszállítás · Szolgáltatás", url: "#", domain: "mexmex.hu", slug: "mexmex", accentColor: "#f59e0b", previewBg: "linear-gradient(145deg, #180f08 0%, #3d2008 55%, #26140a 100%)", image: "/projects/mexmex.png", content: "A Mex&Mex Személyszállítás Kft. számára készült professzionális weboldal, ami bemutatja a szolgáltatásokat és megkönnyíti az ügyfelek számára a kapcsolatfelvételt.\n\nA cél egy megbízható, letisztult megjelenés volt, ami erősíti a vállalkozás szakmai hitelességét.", results: "" },
    { order: 3, title: "Master Piercing", subtitle: "Szépségipar · Studio", url: "#", domain: "masterpiercing.hu", slug: "master-piercing", accentColor: "#c084fc", previewBg: "linear-gradient(145deg, #120828 0%, #230e52 55%, #1a0838 100%)", image: "/projects/master-piercing.png", content: "Piercing stúdió számára készült prémium megjelenésű bemutatkozó oldal galériával és online időpontfoglalással.", results: "" },
    { order: 4, title: "Sasa Klíma", subtitle: "Klímatechnika · Szolgáltatás", url: "#", domain: "sasaklima.hu", slug: "sasa-klima", accentColor: "#38bdf8", previewBg: "linear-gradient(145deg, #041a24 0%, #063a52 55%, #042838 100%)", image: "/projects/sasaklima.jpeg", content: "A Sasa Klíma Kft. számára készült professzionális webes megjelenés, ami bemutatja a klímatechnikai szolgáltatásokat és megkönnyíti az érdeklődők számára az ajánlatkérést.", results: "" },
  ];

  for (const p of projects) {
    const existing = await prisma.project.findFirst({ where: { title: p.title } });
    if (!existing) await prisma.project.create({ data: p });
  }

  // Testimonials
  const testimonials = [
    {
      order: 1,
      content:
        "Ákos tökéletesen megértette az elképzeléseimet, és rendkívül gyorsan, professzionálisan valósította meg a projektet. A weboldal azóta is kifogástalanul működik, folyamatos pozitív visszajelzéseket kapok a dizájnról. Maximálisan elégedett vagyok, mindenkinek ajánlom.",
      author: "Gondár Ibolya",
      role: "Fonalbaba.hu, ügyvezető",
    },
    {
      order: 2,
      content:
        "Ritka az olyan weboldal-készítő mint Ákos, aki nemcsak technikailag profi, de valóban figyel arra, hogy az oldal tükrözze a vállalkozás lelkét is. Gyors, precíz, rugalmas és minden apró részletre odafigyel. Öröm vele dolgozni – csak ajánlani tudom!",
      author: "Kerstinger Erika",
      role: "Master Piercing, tulajdonos",
    },
    {
      order: 3,
      content:
        "Nagyon elégedett vagyok a weboldalam elkészítésével! Illés Ákos professzionális, pontos és rugalmas volt a teljes folyamat során. Minden ötletemre nyitottan reagált, közben pedig rengeteg hasznos tanácsot adott, amivel még jobb lett a végeredmény, mint amit elképzeltem. A design modern, letisztult, mobilon is tökéletesen működik. Az egész munka gördülékenyen és határidőre zajlott. Bátran ajánlom mindenkinek, aki egy megbízható, kreatív webfejlesztőt keres!",
      author: "Mex&Mex Személyszállítás",
      role: "Ügyfél",
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { author: t.author } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // FAQs
  const faqs = [
    { order: 1, question: "Mennyi idő alatt készül el egy weboldal?", answer: "Egy egyszerűbb bemutatkozó oldal 2-3 hét alatt, egy webshop 4-6 hét alatt készül el, a tartalomtól és a visszajelzési körök gyorsaságától függően." },
    { order: 2, question: "Mennyibe kerül egy weboldal?", answer: "Ez a projekt méretétől és funkcióitól függ - egy rövid egyeztetés után pontos árajánlatot adok, kötelezettség nélkül." },
    { order: 3, question: "Mi történik az élesítés után?", answer: "30 nap ingyenes support jár minden projekthez, utána opcionálisan karbantartási csomagot is vállalok." },
    { order: 4, question: "Milyen technológiákkal dolgozol?", answer: "Modern, iparági sztenderd eszközöket használok: Next.js, React, TypeScript a fejlesztéshez, Figma a tervezéshez - ezek gyors, karbantartható és jövőbiztos weboldalt eredményeznek." },
    { order: 5, question: "Meglévő weboldalt is tudsz fejleszteni vagy csak újat?", answer: "Mindkettőt vállalom - legyen szó egy teljesen új oldal elkészítéséről vagy egy meglévő weboldal továbbfejlesztéséről, redesignjáról." },
    { order: 6, question: "Ki lesz a tulajdonosa a kész weboldalnak?", answer: "A weboldal 100%-ban a tiéd - a forráskód, a domain és minden hozzáférés átadásra kerül, nincs elrejtett licenc vagy függőség." },
    { order: 7, question: "Hogyan zajlik az együttműködés?", answer: "Egy rövid egyeztetéssel indulunk, majd tervezési és fejlesztési fázisokban haladunk, rendszeres visszajelzési pontokkal, hogy mindig lásd a projekt állását." },
    { order: 8, question: "Vállalsz karbantartást a weboldal elkészülte után is?", answer: "Igen, opcionális karbantartási csomagok keretében gondoskodom a frissítésekről, biztonságról és kisebb tartalmi módosításokról is." },
  ];

  for (const f of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!existing) await prisma.fAQ.create({ data: f });
  }

  // Services
  const services = [
    { order: 1, num: "01", title: "Webfejlesztés", desc: "Üzleti célra tervezett, gyors és keresőbarát weboldalak, amik mérhetően több érdeklődőt hoznak.", stack: "Next.js · React · TypeScript" },
    { order: 2, num: "02", title: "Webdesign", desc: "Letisztult, modern dizájn, ami azonnal bizalmat épít, konvertál és igazán a tiéd marad.", stack: "Figma · UI/UX · Mobilbarát" },
    { order: 3, num: "03", title: "SEO & teljesítményoptimalizálás", desc: "Megtalálhatóság és villámgyors betöltés - hogy a te oldalad nyerje a Google-versenyt.", stack: "Core Web Vitals · Analytics · Lighthouse" },
    { order: 4, num: "04", title: "Automatizálás & integráció", desc: "Ismétlődő folyamatok gépesítése, hogy az időd értékteremtésre mehessen.", stack: "Make · n8n · API · Webhooks" },
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { num: s.num } });
    if (!existing) await prisma.service.create({ data: s });
  }

  // Process steps
  const steps = [
    { order: 1, num: "01", title: "Megismerés", desc: "Közösen feltárjuk a célokat, a célközönséget és amit valójában a weboldaladtól elvársz." },
    { order: 2, num: "02", title: "Tervezés", desc: "Struktúra, dizájn, üzleti logika - együtt csiszoljuk, amíg igazán a tiéd nem lesz." },
    { order: 3, num: "03", title: "Fejlesztés", desc: "Megépítem és alaposan letesztelem - gyors, megbízható, és pontosan úgy működik, ahogy elképzelted." },
    { order: 4, num: "04", title: "Átadás", desc: "Élesítés, betanítás, 30 nap ingyenes support. Te vagy az irányításban." },
  ];

  for (const s of steps) {
    const existing = await prisma.processStep.findFirst({ where: { num: s.num } });
    if (!existing) await prisma.processStep.create({ data: s });
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
