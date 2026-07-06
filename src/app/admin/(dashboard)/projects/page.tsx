"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/types";

const emptyProject = {
  title: "",
  subtitle: "",
  url: "",
  domain: "",
  slug: "",
  accentColor: "#4c7cf8",
  previewBg: "linear-gradient(145deg, #08122a 0%, #0d1e52 55%, #091430 100%)",
  content: "",
  results: "",
  image: "",
  active: true,
  order: 0,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyProject>(emptyProject);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await fetch("/api/projects").then((r) => r.json());
    setProjects(data);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(emptyProject);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setForm({
      title: p.title,
      subtitle: p.subtitle,
      url: p.url,
      domain: p.domain,
      slug: p.slug,
      accentColor: p.accentColor,
      previewBg: p.previewBg,
      content: p.content,
      results: p.results ?? "",
      image: p.image ?? "",
      active: p.active,
      order: p.order,
    });
    setEditId(p.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editId) {
      await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
    } else {
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "10px 12px",
    color: "#d0daf5",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 22, fontWeight: 800, color: "#eef2ff", letterSpacing: "-0.03em" }}>Projektek</h1>
        <button
          onClick={openNew}
          style={{ background: "#4c7cf8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          + Új projekt
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 28,
            marginBottom: 28,
          }}
        >
          <h2 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 16, fontWeight: 700, color: "#e0e8ff", marginBottom: 20 }}>
            {editId ? "Projekt szerkesztése" : "Új projekt"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "title", label: "Cím" },
              { key: "subtitle", label: "Alcím (pl. E-commerce · Kézműves)" },
              { key: "slug", label: "Slug (pl. fonalbaba, az URL-ben: /munkak/fonalbaba)" },
              { key: "url", label: "URL" },
              { key: "domain", label: "Domain (pl. fonalbaba.hu)" },
              { key: "accentColor", label: "Accent szín (hex)" },
              { key: "order", label: "Sorrend" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.key === "order" ? "number" : "text"}
                  value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: f.key === "order" ? Number(e.target.value) : e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>
                Kép elérési útja (pl. /projects/fonalbaba.webp, opcionális — ha üres, a gradient mockup jelenik meg)
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Preview háttér (CSS gradient)</label>
              <input
                type="text"
                value={form.previewBg}
                onChange={(e) => setForm((prev) => ({ ...prev, previewBg: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>
                Aloldal tartalom (case study szöveg, bekezdések üres sorral elválasztva)
              </label>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>
                Eredmények (soronként &quot;Label|Érték&quot; formátumban, opcionális)
              </label>
              <textarea
                rows={3}
                value={form.results}
                onChange={(e) => setForm((prev) => ({ ...prev, results: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Aktív</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                />
                <span style={{ fontSize: 13, color: "#d0daf5" }}>Megjelenik az oldalon</span>
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: "#4c7cf8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              {saving ? "Mentés..." : "Mentés"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: "rgba(255,255,255,0.05)", color: "#5e7090", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
            >
              Mégse
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: p.accentColor,
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#e0e8ff" }}>{p.title}</p>
                <p style={{ fontSize: 12, color: "#5e7090" }}>{p.subtitle} · {p.domain}</p>
              </div>
              {!p.active && (
                <span style={{ fontSize: 10, color: "#5e7090", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 6px" }}>
                  Inaktív
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => openEdit(p)}
                style={{ background: "rgba(76,124,248,0.1)", color: "#90b0ff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Szerkesztés
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
