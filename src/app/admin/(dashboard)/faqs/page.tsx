"use client";

import { useState, useEffect } from "react";
import type { FAQ } from "@/types";

const empty = { question: "", answer: "", active: true, order: 0 };

export default function AdminFAQsPage() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await fetch("/api/faqs").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }
  function openEdit(f: FAQ) {
    setForm({ question: f.question, answer: f.answer, active: f.active, order: f.order });
    setEditId(f.id);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/faqs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch("/api/faqs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
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
        <h1 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 22, fontWeight: 800, color: "#eef2ff", letterSpacing: "-0.03em" }}>GYIK</h1>
        <button onClick={openNew} style={{ background: "#4c7cf8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Új</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 16, fontWeight: 700, color: "#e0e8ff", marginBottom: 20 }}>
            {editId ? "Szerkesztés" : "Új kérdés"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Kérdés</label>
              <input type="text" value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Válasz</label>
              <textarea rows={4} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>Sorrend</label>
              <input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#d0daf5", marginTop: 20 }}>
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
        {items.map((f) => (
          <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#e0e8ff" }}>{f.question}</p>
              <p style={{ fontSize: 12, color: "#5e7090", marginTop: 2, maxWidth: 480 }}>{f.answer}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(f)} style={{ background: "rgba(76,124,248,0.1)", color: "#90b0ff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Szerkesztés</button>
              <button onClick={() => handleDelete(f.id)} style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Törlés</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
