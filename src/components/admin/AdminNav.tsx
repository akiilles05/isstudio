"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  PenLine,
  Diamond,
  CircleDot,
  Milestone,
  Quote,
  HelpCircle,
  Clock,
  Mail,
  Video,
  ArrowLeft,
  LogOut,
  type LucideIcon,
} from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/content", label: "Tartalom", icon: PenLine },
  { href: "/admin/projects", label: "Projektek", icon: Diamond },
  { href: "/admin/services", label: "Szolgáltatások", icon: CircleDot },
  { href: "/admin/process", label: "Folyamat", icon: Milestone },
  { href: "/admin/testimonials", label: "Vélemények", icon: Quote },
  { href: "/admin/faqs", label: "GYIK", icon: HelpCircle },
  { href: "/admin/booking", label: "Foglalás", icon: Clock },
  { href: "/admin/messages", label: "Üzenetek", icon: Mail },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside
      style={{
        width: 220,
        background: "rgba(13, 59, 102,0.03)",
        borderRight: "1px solid rgba(13, 59, 102,0.10)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 20px 28px" }}>
        <p
          style={{
            fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
            fontSize: 15,
            fontWeight: 800,
            color: "var(--color-navy)",
            letterSpacing: "-0.03em",
          }}
        >
          I&S Studio<span style={{ color: "var(--color-accent)" }}>.</span>
        </p>
        <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 3 }}>CMS Admin</p>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 7,
                fontSize: 13.5,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--color-navy)" : "var(--color-muted)",
                background: active ? "rgba(46,140,178,0.12)" : "transparent",
                border: active ? "1px solid rgba(46,140,178,0.2)" : "1px solid transparent",
                transition: "all 0.15s ease",
                textDecoration: "none",
              }}
            >
              <Icon size={15} strokeWidth={2} style={{ opacity: active ? 1 : 0.65, flexShrink: 0 }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "20px 12px 0" }}>
        <Link
          href="/videohivas"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 7,
            fontSize: 13.5,
            color: "var(--color-muted)",
            textDecoration: "none",
            marginBottom: 4,
          }}
        >
          <Video size={15} strokeWidth={2} style={{ opacity: 0.65, flexShrink: 0 }} />
          Videóhívás indítása
        </Link>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 7,
            fontSize: 13.5,
            color: "var(--color-muted)",
            textDecoration: "none",
            marginBottom: 4,
          }}
        >
          <ArrowLeft size={15} strokeWidth={2} style={{ opacity: 0.65, flexShrink: 0 }} />
          Weboldal
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 7,
            fontSize: 13.5,
            color: "var(--color-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <LogOut size={15} strokeWidth={2} style={{ opacity: 0.65, flexShrink: 0 }} />
          Kilépés
        </button>
      </div>
    </aside>
  );
}
