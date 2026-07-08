"use client";

import { useState, useEffect } from "react";
import type { ProcessStep } from "@/types";

const empty = { num: "", title: "", desc: "", active: true, order: 0 };

export default function AdminProcessPage() {
  const [items, setItems] = useState<ProcessStep[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await fetch("/api/process").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }
  function openEdit(s: ProcessStep) {
    setForm({ num: s.num, title: s.title, desc: s.desc, active: s.active, order: s.order });
    setEditId(s.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/process", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch("/api/process", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(13, 59, 102,0.03)",
    border: "1px solid rgba(13, 59, 102,0.12)",
    borderRadius: 6,
    padding: "10px 12px",
    color: "var(--color-ink)",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)", fontSize: 22, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em" }}>Folyamat lépések</h1>
        <button onClick={openNew} style={{ background: "var(--color-accent)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Új lépés</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(13, 59, 102,0.04)", border: "1px solid rgba(13, 59, 102,0.14)", borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)", fontSize: 16, fontWeight: 700, color: "var(--color-navy)", marginBottom: 20 }}>
            {editId ? "Szerkesztés" : "Új lépés"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "num", label: "Szám (pl. 01)" },
              { key: "order", label: "Sorrend" },
              { key: "title", label: "Cím" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "var(--color-muted)", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.key === "order" ? "number" : "text"} value={(form as Record<string, unknown>)[f.key] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.key === "order" ? Number(e.target.value) : e.target.value }))}
                  style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "var(--color-muted)", display: "block", marginBottom: 6 }}>Leírás</label>
              <textarea rows={3} value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--color-ink)" }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
                Aktív
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={handleSave} disabled={saving} style={{ background: "var(--color-accent)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
              {saving ? "Mentés..." : "Mentés"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: "rgba(13, 59, 102,0.08)", color: "var(--color-muted)", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Mégse</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(13, 59, 102,0.03)", border: "1px solid rgba(13, 59, 102,0.10)", borderRadius: 10, padding: "16px 20px" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-navy)" }}><span style={{ color: "var(--color-accent)", marginRight: 8 }}>{s.num}</span>{s.title}</p>
              <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 2, maxWidth: 500 }}>{s.desc.slice(0, 80)}...</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(s)} style={{ background: "rgba(46,140,178,0.1)", color: "var(--color-accent-dark)", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Szerkesztés</button>
              <button onClick={() => handleDelete(s.id)} style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Törlés</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
