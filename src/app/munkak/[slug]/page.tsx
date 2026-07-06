import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/sections/FooterSection";

export const revalidate = 60;

async function getProject(slug: string) {
  return prisma.project.findFirst({ where: { slug, active: true } });
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { active: true }, select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — I&S Studio`,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      locale: "hu_HU",
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const paragraphs = project.content.split(/\n\n+/).filter(Boolean);
  const results = (project.results ?? "")
    .split("\n")
    .map((line) => line.split("|"))
    .filter(([value, label]) => value && label) as [string, string][];

  const contentRows = await prisma.siteContent.findMany();
  const content = Object.fromEntries(contentRows.map((r) => [r.key, r.value]));

  return (
    <>
      <NavBar />
      <main>
        <section className="pt-[clamp(140px,16vw,180px)] pb-[clamp(60px,8vw,100px)] px-[clamp(24px,6vw,80px)]">
          <div className="max-w-[900px] mx-auto">
            <Link
              href="/#munkak"
              className="text-[13px] text-[#4c7cf8] inline-flex items-center gap-1.5 mb-8"
            >
              <ArrowLeft size={14} strokeWidth={2} /> Vissza a munkákhoz
            </Link>

            <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">
              {project.subtitle}
            </p>
            <h1 className="font-heading text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05] mb-5">
              {project.title}
            </h1>

            {project.url && project.url !== "#" && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13.5px] text-white bg-[#4c7cf8] px-[18px] py-2.5 rounded-lg font-medium mb-12"
              >
                {project.domain} <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-0 border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden mb-12">
                {results.map(([value, label], i) => (
                  <div
                    key={i}
                    className={`px-[18px] py-[22px] text-center ${i > 0 ? "border-l border-[rgba(255,255,255,0.07)]" : ""}`}
                  >
                    <p className="font-heading text-[1.8rem] font-extrabold text-[#4c7cf8] tracking-[-0.03em]">
                      {value.trim()}
                    </p>
                    <p className="text-[11px] text-[#5e7090] mt-1.5">{label.trim()}</p>
                  </div>
                ))}
              </div>
            )}

            <div
              className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)] mb-12"
              style={{ background: project.previewBg }}
            >
              <div className="flex items-center gap-1.5 px-4 py-[13px] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.25)]">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="w-[9px] h-[9px] rounded-full bg-[rgba(255,255,255,0.1)] block" />
                ))}
                <div className="flex-1 bg-[rgba(255,255,255,0.06)] rounded h-5 ml-2 flex items-center pl-2.5">
                  <span className="text-[10.5px] text-[rgba(255,255,255,0.22)]">{project.domain}</span>
                </div>
              </div>
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full block object-cover" />
              ) : (
                <div className="min-h-[260px]" />
              )}
            </div>

            {paragraphs.map((p, i) => (
              <p key={i} className="text-[15.5px] font-light text-[#94a3c9] leading-[1.85] mb-[22px]">
                {p}
              </p>
            ))}
          </div>
        </section>
      </main>
      <FooterSection content={content} />
    </>
  );
}
