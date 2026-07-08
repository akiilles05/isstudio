"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Hibás belépési adatok");
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(13, 59, 102,0.08)",
    border: "1px solid rgba(13, 59, 102,0.14)",
    borderRadius: 8,
    padding: "12px 16px",
    color: "var(--color-ink)",
    fontSize: 14,
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "rgba(13, 59, 102,0.04)",
          border: "1px solid rgba(13, 59, 102,0.12)",
          borderRadius: 16,
          padding: 40,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
            fontSize: 20,
            fontWeight: 800,
            color: "var(--color-navy)",
            marginBottom: 8,
            letterSpacing: "-0.03em",
          }}
        >
          I&S Studio<span style={{ color: "var(--color-accent)" }}>.</span>
        </p>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 32 }}>Admin belépés</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {error && <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {loading ? "Belépés..." : (<>Belépés <ArrowRight size={14} strokeWidth={2} /></>)}
          </button>
        </form>
      </div>
    </div>
  );
}
