"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import type { ContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  async function load() {
    setMessages(await fetch("/api/messages").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  async function markRead(id: number, read: boolean) {
    await fetch("/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read }) });
    await load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd?")) return;
    await fetch("/api/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (open === id) setOpen(null);
    await load();
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-syne,'Syne',sans-serif)", fontSize: 22, fontWeight: 800, color: "#eef2ff", letterSpacing: "-0.03em" }}>
          Üzenetek
          {unread > 0 && (
            <span style={{ marginLeft: 10, background: "#f59e0b", color: "#000", fontSize: 12, fontWeight: 700, borderRadius: 12, padding: "2px 8px" }}>
              {unread} olvasatlan
            </span>
          )}
        </h1>
      </div>

      {messages.length === 0 && (
        <p style={{ fontSize: 14, color: "#5e7090" }}>Még nincsenek üzenetek.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ background: "rgba(255,255,255,0.025)", border: m.read ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(245,158,11,0.25)", borderRadius: 10, overflow: "hidden" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", cursor: "pointer" }}
              onClick={() => setOpen(open === m.id ? null : m.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {!m.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "block", flexShrink: 0 }} />}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: m.read ? "#6b7b9b" : "#e0e8ff" }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: "#5e7090" }}>{m.email}{m.company ? ` · ${m.company}` : ""}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: "#5e7090" }}>{new Date(m.createdAt).toLocaleDateString("hu-HU")}</span>
                {open === m.id ? (
                  <ChevronUp size={15} strokeWidth={2} color="#5e7090" />
                ) : (
                  <ChevronDown size={15} strokeWidth={2} color="#5e7090" />
                )}
              </div>
            </div>

            {open === m.id && (
              <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: 14, color: "#d0daf5", lineHeight: 1.7, paddingTop: 16, whiteSpace: "pre-wrap" }}>{m.message}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <a
                    href={`mailto:${m.email}`}
                    style={{
                      background: "rgba(76,124,248,0.1)",
                      color: "#90b0ff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Válasz küldése <ArrowRight size={12} strokeWidth={2} />
                  </a>
                  <button
                    onClick={() => markRead(m.id, !m.read)}
                    style={{ background: "rgba(255,255,255,0.05)", color: "#5e7090", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                  >
                    {m.read ? "Olvasatlannak jelöl" : "Olvasottnak jelöl"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                  >
                    Törlés
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
