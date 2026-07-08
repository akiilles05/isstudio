import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [projectCount, serviceCount, stepCount, msgCount, unreadCount] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.processStep.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Projektek", value: projectCount, href: "/admin/projects", color: "var(--color-accent)" },
    { label: "Szolgáltatások", value: serviceCount, href: "/admin/services", color: "#22c55e" },
    { label: "Folyamat lépések", value: stepCount, href: "/admin/process", color: "#a78bfa" },
    { label: "Üzenetek", value: msgCount, href: "/admin/messages", color: "#f59e0b", badge: unreadCount > 0 ? unreadCount : null },
  ];

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
          fontSize: 26,
          fontWeight: 800,
          color: "var(--color-navy)",
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}
      >
        Dashboard
      </h1>
      <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 40 }}>
        Üdvözöllek az I&S Studio admin felületén.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: "block",
              background: "rgba(13, 59, 102,0.04)",
              border: "1px solid rgba(13, 59, 102,0.10)",
              borderRadius: 12,
              padding: "24px 20px",
              textDecoration: "none",
              transition: "border-color 0.2s",
              position: "relative",
            }}
          >
            {s.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "#f59e0b",
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.badge}
              </span>
            )}
            <p
              style={{
                fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
                fontSize: 36,
                fontWeight: 800,
                color: s.color,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: 13, color: "var(--color-muted)" }}>{s.label}</p>
          </Link>
        ))}
      </div>

      <div
        style={{
          background: "rgba(13, 59, 102,0.04)",
          border: "1px solid rgba(13, 59, 102,0.10)",
          borderRadius: 12,
          padding: "24px 28px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--color-navy)",
            marginBottom: 16,
          }}
        >
          Gyors elérés
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { href: "/admin/content", label: "Tartalom szerkesztése" },
            { href: "/admin/projects", label: "Projekt hozzáadása" },
            { href: "/admin/messages", label: "Üzenetek megtekintése" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 16px",
                background: "rgba(46,140,178,0.08)",
                border: "1px solid rgba(46,140,178,0.2)",
                borderRadius: 7,
                fontSize: 13,
                color: "var(--color-accent-dark)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {l.label} <ArrowRight size={13} strokeWidth={2} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
