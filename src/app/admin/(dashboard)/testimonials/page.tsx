"use client";

import { useState, useEffect } from "react";
import type { Testimonial } from "@/types";

const empty = { content: "", author: "", role: "", active: true, order: 0 };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await fetch("/api/testimonials").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }
  function openEdit(t: Testimonial) {
    setForm({ content: t.content, author: t.author, role: t.role ?? "", active: t.active, order: t.order });
    setEditId(t.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch("/api/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
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
        <h1 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 22, fontWeight: 800, color: "#eef2ff", letterSpacing: "-0.03em" }}>Vélemények</h1>
        <button onClick={openNew} style={{ background: "#4c7cf8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Új</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 16, fontWeight: 700, color: "#e0e8ff", marginBottom: 20 }}>
            {editId ? "Szerkesztés" : "Új vélemény"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "author", label: "Szerző neve" },
              { key: "role", label: "Beosztás / cég (opcionális)" },
              { key: "order", label: "Sorrend" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.key === "order" ? "number" : "text"} value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.key === "order" ? Number(e.target.value) : e.target.value }))}
                  style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Idézet</label>
              <textarea rows={3} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#d0daf5" }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
                Aktív
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: "#4c7cf8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
              {saving ? "Mentés..." : "Mentés"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: "rgba(255,255,255,0.05)", color: "#5e7090", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Mégse</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((t) => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#e0e8ff" }}>{t.author}{t.role ? ` · ${t.role}` : ""}</p>
              <p style={{ fontSize: 12, color: "#5e7090", marginTop: 2, maxWidth: 480 }}>{t.content}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(t)} style={{ background: "rgba(76,124,248,0.1)", color: "#90b0ff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Szerkesztés</button>
              <button onClick={() => handleDelete(t.id)} style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Törlés</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
