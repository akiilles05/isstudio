import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import BookingSection from "@/components/sections/BookingSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import type { ContentMap } from "@/types";

export const revalidate = 60;

async function getData() {
  const [contentRows, projects, services, steps, testimonials, faqs] = await Promise.all([
    prisma.siteContent.findMany(),
    prisma.project.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.processStep.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.fAQ.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);
  const content: ContentMap = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));
  return { content, projects, services, steps, testimonials, faqs };
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { content, projects, services, steps, testimonials, faqs } = await getData();

  return (
    <>
      <NavBar />
      <main>
        <HeroSection content={content} />
        <MarqueeSection />
        <PortfolioSection projects={projects} />
        <ServicesSection services={services} />
        <ProcessSection steps={steps} />
        <BookingSection content={content} />
        <AboutSection content={content} />
        <TestimonialSection testimonials={testimonials} />
        <FAQSection faqs={faqs} />
        <ContactSection content={content} />
      </main>
      <FooterSection content={content} />
    </>
  );
}
