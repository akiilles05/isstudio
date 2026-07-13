"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VideoRoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room } = use(params);
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");

  const jitsiSrc = `https://meet.isstudio.hu/${encodeURIComponent(room)}#userInfo.displayName="${encodeURIComponent(
    name || "Vendég"
  )}"&config.prejoinPageEnabled=false`;

  return (
    <div className="min-h-screen flex flex-col bg-[#07091c]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
        <Link href="/" className="text-[13px] text-[#5e7090] inline-flex items-center gap-1.5 hover:text-[#eef2ff] transition-colors">
          <ArrowLeft size={14} strokeWidth={2} /> I&amp;S Studio
        </Link>
        <p className="text-[13px] text-[#5e7090]">Ingyenes videóhívás · nincs időkorlát</p>
      </header>

      {!joined ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.gtag?.("event", "videohivas_join", {
                event_category: "videohivas",
                room,
              });
              setJoined(true);
            }}
            className="w-full max-w-[380px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10"
          >
            <p className="font-heading text-xl font-extrabold text-[#eef2ff] mb-2 tracking-[-0.03em]">
              Csatlakozás a híváshoz
            </p>
            <p className="text-[13px] text-[#5e7090] mb-8">
              Add meg a neved, hogy a többiek felismerjenek.
            </p>
            <input
              type="text"
              placeholder="Neved"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[#d0daf5] text-sm outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-[#4c7cf8] text-white border-none py-3 px-6 rounded-lg text-sm font-medium cursor-pointer"
            >
              Csatlakozás
            </button>
          </form>
        </div>
      ) : (
        <iframe
          src={jitsiSrc}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="flex-1 w-full border-0"
        />
      )}
    </div>
  );
}
