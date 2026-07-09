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

  const inputClass =
    "w-full bg-navy/8 border border-navy/14 rounded-lg py-3 px-4 text-ink text-sm outline-none";

  return (
    <div className="dark scheme-dark min-h-screen flex items-center justify-center p-6 bg-bg text-ink">
      <div className="w-full max-w-[400px] bg-navy/4 border border-navy/12 rounded-2xl p-10">
        <p className="font-heading text-xl font-extrabold text-navy mb-2 tracking-[-0.03em]">
          I&S Studio<span className="text-accent">.</span>
        </p>
        <p className="text-[13px] text-muted mb-8">Admin belépés</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
          {error && <p className="text-[13px] text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 bg-accent text-white border-none py-3 px-6 rounded-lg text-sm font-medium mt-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Belépés..." : (<>Belépés <ArrowRight size={14} strokeWidth={2} /></>)}
          </button>
        </form>
      </div>
    </div>
  );
}
