"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { SiteContent } from "@/types";

export default function AdminContentPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setItems);
  }, []);

  const groups = [...new Set(items.map((i) => i.group))].sort();

  function onChange(key: string, value: string) {
    setChanges((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const updates = Object.entries(changes).map(([key, value]) => ({ key, value }));
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setItems((prev) =>
      prev.map((item) => (changes[item.key] !== undefined ? { ...item, value: changes[item.key] } : item))
    );
    setChanges({});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const hasChanges = Object.keys(changes).length > 0;

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
        <div>
          <h1 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 22, fontWeight: 800, color: "#eef2ff", letterSpacing: "-0.03em" }}>
            Tartalom szerkesztése
          </h1>
          <p style={{ fontSize: 13, color: "#5e7090", marginTop: 4 }}>Az oldal szöveges tartalmait szerkesztheted itt.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          style={{
            background: hasChanges ? "#4c7cf8" : "rgba(255,255,255,0.05)",
            color: hasChanges ? "#fff" : "#5e7090",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: hasChanges ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {saving ? "Mentés..." : saved ? (<><Check size={14} strokeWidth={2.5} /> Mentve</>) : "Mentés"}
        </button>
      </div>

      {groups.map((group) => (
        <div
          key={group}
          style={{
            marginBottom: 32,
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#4c7cf8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{group}</p>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {items.filter((i) => i.group === group).map((item) => {
              const currentValue = changes[item.key] ?? item.value;
              const isLong = item.value.length > 100 || item.value.includes("\n");
              return (
                <div key={item.key}>
                  <label style={{ fontSize: 12, color: "#6b7b9b", display: "block", marginBottom: 6 }}>
                    {item.label}
                    <span style={{ fontSize: 10, color: "#3a4e68", marginLeft: 8 }}>{item.key}</span>
                  </label>
                  {isLong ? (
                    <textarea
                      value={currentValue}
                      onChange={(e) => onChange(item.key, e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => onChange(item.key, e.target.value)}
                      style={inputStyle}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
