"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, Globe, Video } from "lucide-react";
import type { ContentMap } from "@/types";

type BookingSlot = {
  id: number;
  date: string;
  duration: number;
};

const WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function BookingSection({ content }: { content: ContentMap }) {
  const [slots, setSlots] = useState<BookingSlot[] | null>(null);
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<BookingSlot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const title = content.booking_title ?? "Foglalj egy ingyenes konzultációt.";
  const desc = content.booking_desc ?? "30 perc, kötelezettség nélkül.";

  useEffect(() => {
    fetch("/api/booking")
      .then((r) => r.json())
      .then((data: BookingSlot[]) => {
        setSlots(data);
        if (data.length > 0) {
          const first = new Date(data[0].date);
          first.setDate(1);
          setMonthCursor(first);
          setSelectedDay(dateKey(new Date(data[0].date)));
        }
      })
      .catch(() => setSlots([]));
  }, []);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, BookingSlot[]>();
    for (const s of slots ?? []) {
      const key = dateKey(new Date(s.date));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    for (const list of map.values()) list.sort((a, b) => a.date.localeCompare(b.date));
    return map;
  }, [slots]);

  const calendarDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [monthCursor]);

  if (slots === null || slots.length === 0) return null;

  const duration = slots[0]?.duration ?? 30;
  const dayTimes = selectedDay ? slotsByDay.get(selectedDay) ?? [] : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function changeMonth(delta: number) {
    setMonthCursor((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, name, email, note }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Hiba történt");
      }
      setDone(true);
      setSlots((prev) => (prev ? prev.filter((s) => s.id !== selected.id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba történt, próbáld újra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="foglalas" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)] bg-[rgba(255,255,255,0.012)] border-t border-b border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-14 max-w-[560px]">
          <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">Foglalás</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05]">
            {title}
          </h2>
          <p className="text-[15px] text-[#6b7b9b] leading-[1.7] mt-4">{desc}</p>
        </div>

        {done ? (
          <div className="max-w-[520px] rounded-2xl border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.05)] px-7 py-8 flex items-start gap-4">
            <div className="w-11 h-11 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.28)] rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#e8eeff] tracking-[-0.02em] mb-1.5">Foglalás megerősítve!</h3>
              <p className="text-sm text-[#6b7b9b] leading-[1.7]">Emailben hamarosan visszaigazolást küldünk a részletekkel.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
            <div className={`grid grid-cols-1 ${selected ? "md:grid-cols-[280px_1fr]" : "md:grid-cols-[280px_1fr_220px]"}`}>
              {/* Event info panel */}
              <div className="p-7 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.07)] flex flex-col gap-5">
                <div>
                  <p className="text-xs text-[#5e7090] mb-1.5">I&S Studio</p>
                  <h3 className="font-heading text-lg font-bold text-[#eef2ff] tracking-[-0.02em] leading-[1.25]">{title}</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-[13px] text-[#8592b0]">
                    <Clock size={15} className="text-[#4c7cf8] flex-shrink-0" />
                    {duration} perc
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-[#8592b0]">
                    <Video size={15} className="text-[#4c7cf8] flex-shrink-0" />
                    Google Meet / telefon
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-[#8592b0]">
                    <Globe size={15} className="text-[#4c7cf8] flex-shrink-0" />
                    Közép-európai idő
                  </div>
                </div>
                {selected && (
                  <div className="mt-1 pt-5 border-t border-[rgba(255,255,255,0.07)]">
                    <p className="text-xs text-[#5e7090] mb-1.5">Kiválasztott időpont</p>
                    <p className="text-sm text-[#c0ccea] font-medium leading-[1.5]">
                      {new Date(selected.date).toLocaleString("hu-HU", { dateStyle: "long", timeStyle: "short" })}
                    </p>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-xs text-[#4c7cf8] mt-2 bg-transparent border-none cursor-pointer p-0 hover:underline"
                    >
                      Módosítás
                    </button>
                  </div>
                )}
              </div>

              {selected ? (
                /* Attendee form */
                <div className="p-7">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 max-w-[420px]">
                    <input
                      type="text"
                      placeholder="Neved"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3.5 text-[#d0daf5] text-sm outline-none transition-[border-color,background] duration-200 focus:border-[rgba(76,124,248,0.5)] focus:bg-[rgba(76,124,248,0.04)]"
                    />
                    <input
                      type="email"
                      placeholder="E-mail cím"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3.5 text-[#d0daf5] text-sm outline-none transition-[border-color,background] duration-200 focus:border-[rgba(76,124,248,0.5)] focus:bg-[rgba(76,124,248,0.04)]"
                    />
                    <textarea
                      placeholder="Miről lenne szó? (opcionális)"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3.5 text-[#d0daf5] text-sm outline-none resize-y transition-[border-color,background] duration-200 focus:border-[rgba(76,124,248,0.5)] focus:bg-[rgba(76,124,248,0.04)]"
                    />
                    {error && <p className="text-[13px] text-[#f87171]">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`text-white border-none px-7 py-3.5 rounded-lg text-sm font-medium self-start transition-colors duration-200 ${
                        loading ? "bg-[#3a5fd4] cursor-not-allowed" : "bg-[#4c7cf8] cursor-pointer hover:bg-[#6390fa]"
                      }`}
                    >
                      {loading ? "Foglalás..." : "Időpont lefoglalása"}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Calendar */}
                  <div className="p-7 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.07)]">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-sm font-medium text-[#e0e8ff]">
                        {monthCursor.toLocaleDateString("hu-HU", { month: "long", year: "numeric" })}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => changeMonth(-1)}
                          aria-label="Előző hónap"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#7080a8] hover:text-[#eef2ff] hover:bg-[rgba(255,255,255,0.06)] cursor-pointer bg-transparent border-none transition-colors duration-150"
                        >
                          <ChevronLeft size={15} />
                        </button>
                        <button
                          onClick={() => changeMonth(1)}
                          aria-label="Következő hónap"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#7080a8] hover:text-[#eef2ff] hover:bg-[rgba(255,255,255,0.06)] cursor-pointer bg-transparent border-none transition-colors duration-150"
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {WEEKDAYS.map((w) => (
                        <div key={w} className="text-center text-[10.5px] text-[#5e7090] font-medium py-1">
                          {w}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((d, i) => {
                        if (!d) return <div key={`empty-${i}`} />;
                        const key = dateKey(d);
                        const hasSlots = slotsByDay.has(key);
                        const isPast = d < today;
                        const isSelected = selectedDay === key;
                        return (
                          <button
                            key={key}
                            disabled={!hasSlots || isPast}
                            onClick={() => setSelectedDay(key)}
                            className={`aspect-square rounded-lg text-[13px] flex items-center justify-center border transition-colors duration-150 ${
                              isSelected
                                ? "bg-[#4c7cf8] border-[#4c7cf8] text-white font-medium cursor-pointer"
                                : hasSlots && !isPast
                                  ? "border-transparent text-[#c0ccea] hover:border-[rgba(76,124,248,0.4)] cursor-pointer font-medium"
                                  : "border-transparent text-[#3a4e68] cursor-default"
                            }`}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="p-7">
                    <p className="text-sm font-medium text-[#e0e8ff] mb-5">
                      {selectedDay
                        ? new Date(dayTimes[0]?.date ?? Date.now()).toLocaleDateString("hu-HU", { weekday: "long", month: "long", day: "numeric" })
                        : "Válassz egy napot"}
                    </p>
                    <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                      {dayTimes.length === 0 && (
                        <p className="text-[13px] text-[#5e7090]">Nincs elérhető időpont ezen a napon.</p>
                      )}
                      {dayTimes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelected(s)}
                          className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium border border-[rgba(76,124,248,0.35)] text-[#90b0ff] hover:bg-[#4c7cf8] hover:text-white hover:border-[#4c7cf8] cursor-pointer transition-colors duration-150 bg-transparent"
                        >
                          {new Date(s.date).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
