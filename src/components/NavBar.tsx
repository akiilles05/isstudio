"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const links = [
  { href: "/#munkak", label: "Munkáink", num: "01" },
  { href: "/#folyamat", label: "Folyamat", num: "02" },
  { href: "/#rolam", label: "Rólunk", num: "03" },
  { href: "/#kapcsolat", label: "Kapcsolat", num: "04" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[60px] py-[18px] border-b transition-[background,border-color] duration-400 ease-in-out ${
          scrolled
            ? "bg-[rgba(7,9,28,0.97)] backdrop-blur-[20px] border-[rgba(255,255,255,0.07)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <Link
          href="#top"
          className="flex items-center gap-2.5 font-heading text-[17px] font-extrabold tracking-[-0.03em] text-[#eef2ff] whitespace-nowrap"
        >
          <Image src="/logo-mark.png" alt="" width={1366} height={767} className="h-[19px] w-auto" priority />
          I&amp;S Studio<span className="text-[#4c7cf8]">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-[#7080a8] transition-colors duration-200 hover:text-[#d0daf5]"
            >
              <span className="font-heading text-[10px] font-bold text-[#4c7cf8] mr-1.5 tracking-[0.04em]">
                {l.num}
              </span>
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="/#kapcsolat"
          className="hidden md:flex items-center gap-1.5 bg-[#4c7cf8] text-white px-5 py-2.5 rounded-[7px] text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 hover:bg-[#6390fa]"
        >
          Dolgozzunk együtt <ArrowRight size={15} />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
        >
          <span className="w-[22px] h-0.5 bg-[#d0daf5] block rounded-[1px]" />
          <span className="w-[22px] h-0.5 bg-[#d0daf5] block rounded-[1px]" />
          <span className="w-3.5 h-0.5 bg-[#7080a8] block rounded-[1px]" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[190] bg-[rgba(7,9,28,0.98)] flex flex-col items-center justify-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-[28px] font-bold text-[#eef2ff] transition-colors duration-200 hover:text-[#4c7cf8]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#kapcsolat"
            onClick={() => setMenuOpen(false)}
            className="bg-[#4c7cf8] text-white px-8 py-[13px] rounded-lg text-[15px] font-medium mt-2 inline-flex items-center gap-1.5"
          >
            Dolgozzunk együtt <ArrowRight size={16} />
          </a>
        </div>
      )}
    </>
  );
}
