"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

function randomRoomSlug() {
  return `isstudio-${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

export default function VideoLandingPage() {
  const router = useRouter();
  const [roomInput, setRoomInput] = useState("");

  function startNewCall() {
    router.push(`/videohivas/${randomRoomSlug()}`);
  }

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = roomInput.trim();
    if (!trimmed) return;
    const room = trimmed.includes("/") ? trimmed.split("/").filter(Boolean).pop()! : trimmed;
    router.push(`/videohivas/${encodeURIComponent(room)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07091c]">
      <header className="px-6 py-4 border-b border-white/8">
        <Link href="/" className="text-[13px] text-[#5e7090] inline-flex items-center gap-1.5 hover:text-[#eef2ff] transition-colors">
          <ArrowLeft size={14} strokeWidth={2} /> I&amp;S Studio
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] text-center">
          <div className="w-14 h-14 rounded-full bg-[#4c7cf8]/10 border border-[#4c7cf8]/28 flex items-center justify-center mx-auto mb-6">
            <Video size={22} strokeWidth={2} color="#4c7cf8" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[#eef2ff] tracking-[-0.03em] mb-3">
            Videóhívás
          </h1>
          <p className="text-[15px] text-[#a8b4d0] leading-[1.7] mb-10">
            Teljesen ingyenes, időkorlát nélküli videókonferencia — nincs szükség
            regisztrációra vagy alkalmazás telepítésére.
          </p>

          <button
            onClick={startNewCall}
            className="w-full flex items-center justify-center gap-1.5 bg-[#4c7cf8] text-white border-none py-3.5 px-6 rounded-lg text-sm font-medium cursor-pointer mb-4"
          >
            Új hívás indítása
          </button>

          <form onSubmit={joinRoom} className="flex gap-2">
            <input
              type="text"
              placeholder="Szoba neve / link csatlakozáshoz"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[#d0daf5] text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-white/5 border border-white/10 text-[#eef2ff] py-3 px-5 rounded-lg text-sm font-medium cursor-pointer"
            >
              Csatlakozás
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
