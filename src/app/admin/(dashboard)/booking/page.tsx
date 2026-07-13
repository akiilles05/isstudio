"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Trash2, Video } from "lucide-react";

type BookingSlot = {
  id: number;
  date: string;
  duration: number;
  booked: boolean;
  name: string | null;
  email: string | null;
  note: string | null;
  videoUrl: string | null;
};

const WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const WEEKDAY_FULL = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function toInputDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function generateSlotDates(opts: {
  rangeStart: string;
  rangeEnd: string;
  weekdays: Set<number>; // 0=Monday..6=Sunday
  startTime: string;
  endTime: string;
  interval: number;
}): Date[] {
  const [sy, sm, sd] = opts.rangeStart.split("-").map(Number);
  const [ey, em, ed] = opts.rangeEnd.split("-").map(Number);
  const [sh, smin] = opts.startTime.split(":").map(Number);
  const [eh, emin] = opts.endTime.split(":").map(Number);

  const rangeStart = new Date(sy, sm - 1, sd);
  const rangeEnd = new Date(ey, em - 1, ed);
  const dates: Date[] = [];

  for (let day = new Date(rangeStart); day <= rangeEnd; day.setDate(day.getDate() + 1)) {
    const weekdayIdx = (day.getDay() + 6) % 7;
    if (!opts.weekdays.has(weekdayIdx)) continue;

    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), sh, smin);
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), eh, emin);
    for (let t = new Date(dayStart); t < dayEnd; t.setMinutes(t.getMinutes() + opts.interval)) {
      dates.push(new Date(t));
    }
  }
  return dates;
}

export default function AdminBookingPage() {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<string>(() => dateKey(new Date()));
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [saving, setSaving] = useState(false);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStart, setBulkStart] = useState(() => toInputDate(new Date()));
  const [bulkEnd, setBulkEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return toInputDate(d);
  });
  const [bulkWeekdays, setBulkWeekdays] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));
  const [bulkStartTime, setBulkStartTime] = useState("09:00");
  const [bulkEndTime, setBulkEndTime] = useState("17:00");
  const [bulkInterval, setBulkInterval] = useState(30);
  const [bulkDuration, setBulkDuration] = useState(30);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<string>("");

  async function load() {
    setSlots(await fetch("/api/booking?all=true").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, BookingSlot[]>();
    for (const s of slots) {
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
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [monthCursor]);

  function changeMonth(delta: number) {
    setMonthCursor((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  function selectDay(d: Date) {
    setSelectedDay(dateKey(d));
  }

  async function handleAdd() {
    if (!time) return;
    const [y, m, day] = selectedDay.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    const dateObj = new Date(y, m, day, h, min);
    setSaving(true);
    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateObj.toISOString(), duration }),
    });
    setTime("");
    await load();
    setSaving(false);
  }

  function toggleBulkWeekday(idx: number) {
    setBulkWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  async function handleBulkGenerate() {
    const dates = generateSlotDates({
      rangeStart: bulkStart,
      rangeEnd: bulkEnd,
      weekdays: bulkWeekdays,
      startTime: bulkStartTime,
      endTime: bulkEndTime,
      interval: bulkInterval,
    });
    if (dates.length === 0) {
      setBulkResult("Nincs a szűrésnek megfelelő időpont.");
      return;
    }
    setBulkSaving(true);
    setBulkResult("");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dates: dates.map((d) => d.toISOString()), duration: bulkDuration }),
    });
    const data = await res.json();
    setBulkResult(`${data.created} időpont létrehozva${data.skipped ? `, ${data.skipped} már létezett` : ""}.`);
    await load();
    setBulkSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Biztosan törlöd ezt az időpontot?")) return;
    await fetch("/api/booking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(13, 59, 102,0.03)",
    border: "1px solid rgba(13, 59, 102,0.12)",
    borderRadius: 6,
    padding: "10px 12px",
    color: "var(--color-ink)",
    fontSize: 13,
    outline: "none",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selY, selM, selD] = selectedDay.split("-").map(Number);
  const selectedDate = new Date(selY, selM, selD);
  const daySlots = slotsByDay.get(selectedDay) ?? [];

  function formatTime(d: string) {
    return new Date(d).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)", fontSize: 22, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em" }}>
          Foglalás
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>
          Válassz egy napot a naptárban, és nyiss meg rá időpontokat, amikre a látogatók foglalhatnak.
        </p>
      </div>

      <div style={{ background: "rgba(13, 59, 102,0.02)", border: "1px solid rgba(13, 59, 102,0.12)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <button
          onClick={() => setBulkOpen((o) => !o)}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>Több időpont egyszerre</p>
          {bulkOpen ? <ChevronLeft size={15} style={{ transform: "rotate(-90deg)" }} /> : <ChevronRight size={15} style={{ transform: "rotate(90deg)" }} />}
        </button>

        {bulkOpen && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Kezdő nap</p>
                <input type="date" value={bulkStart} onChange={(e) => setBulkStart(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Utolsó nap</p>
                <input type="date" value={bulkEnd} onChange={(e) => setBulkEnd(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Napi kezdés</p>
                <input type="time" value={bulkStartTime} onChange={(e) => setBulkStartTime(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Napi zárás</p>
                <input type="time" value={bulkEndTime} onChange={(e) => setBulkEndTime(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Időköz (perc)</p>
                <input type="number" value={bulkInterval} onChange={(e) => setBulkInterval(Number(e.target.value))} style={{ ...inputStyle, width: 80 }} />
              </div>
              <div>
                <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 4 }}>Időtartam (perc)</p>
                <input type="number" value={bulkDuration} onChange={(e) => setBulkDuration(Number(e.target.value))} style={{ ...inputStyle, width: 80 }} />
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginBottom: 6 }}>Napok</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {WEEKDAY_FULL.map((label, idx) => {
                  const active = bulkWeekdays.has(idx);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleBulkWeekday(idx)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12.5,
                        cursor: "pointer",
                        border: active ? "1px solid var(--color-accent)" : "1px solid rgba(13, 59, 102,0.15)",
                        background: active ? "rgba(46,140,178,0.15)" : "transparent",
                        color: active ? "var(--color-navy)" : "var(--color-muted)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleBulkGenerate}
                disabled={bulkSaving}
                style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: bulkSaving ? "not-allowed" : "pointer",
                  opacity: bulkSaving ? 0.6 : 1,
                }}
              >
                {bulkSaving ? "Generálás..." : "Időpontok generálása"}
              </button>
              {bulkResult && <p style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{bulkResult}</p>}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "rgba(13, 59, 102,0.02)", border: "1px solid rgba(13, 59, 102,0.12)", borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 320px" }}>
        {/* Calendar */}
        <div style={{ padding: 24, borderRight: "1px solid rgba(13, 59, 102,0.10)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)" }}>
              {monthCursor.toLocaleDateString("hu-HU", { month: "long", year: "numeric" })}
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Előző hónap"
                style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-muted)", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => changeMonth(1)}
                aria-label="Következő hónap"
                style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-muted)", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
            {WEEKDAYS.map((w) => (
              <div key={w} style={{ textAlign: "center", fontSize: 10.5, color: "var(--color-muted)", fontWeight: 500, padding: "4px 0" }}>
                {w}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {calendarDays.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />;
              const key = dateKey(d);
              const daySlotsForCell = slotsByDay.get(key) ?? [];
              const isSelected = selectedDay === key;
              const isPast = d < today;
              const openCount = daySlotsForCell.filter((s) => !s.booked).length;
              const bookedCount = daySlotsForCell.filter((s) => s.booked).length;

              return (
                <button
                  key={key}
                  onClick={() => selectDay(d)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    fontSize: 13,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    cursor: "pointer",
                    border: isSelected ? "1px solid var(--color-accent)" : "1px solid transparent",
                    background: isSelected ? "rgba(46,140,178,0.15)" : "transparent",
                    color: isPast ? "var(--color-muted)" : isSelected ? "var(--color-navy)" : "var(--color-ink)",
                    opacity: isPast ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontWeight: isSelected ? 600 : 400 }}>{d.getDate()}</span>
                  {(openCount > 0 || bookedCount > 0) && (
                    <span style={{ display: "flex", gap: 2 }}>
                      {openCount > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-accent)", display: "block" }} />}
                      {bookedCount > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e", display: "block" }} />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day panel */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-navy)", marginBottom: 16 }}>
            {selectedDate.toLocaleDateString("hu-HU", { weekday: "long", month: "long", day: "numeric" })}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, flex: 1, overflowY: "auto" }}>
            {daySlots.length === 0 && <p style={{ fontSize: 13, color: "var(--color-muted)" }}>Nincs időpont ezen a napon.</p>}
            {daySlots.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(13, 59, 102,0.04)",
                  border: "1px solid rgba(13, 59, 102,0.10)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-navy)" }}>
                    {formatTime(s.date)} · {s.duration} perc
                  </p>
                  {s.booked ? (
                    <p style={{ fontSize: 11.5, color: "#22c55e", marginTop: 2 }}>
                      Foglalt - {s.name} ({s.email}){s.note ? ` · ${s.note}` : ""}
                    </p>
                  ) : (
                    <p style={{ fontSize: 11.5, color: "var(--color-muted)", marginTop: 2 }}>Szabad</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {s.booked && s.videoUrl && (
                    <a
                      href={s.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Videóhívás megnyitása"
                      style={{ background: "rgba(76,124,248,0.12)", color: "var(--color-accent)", border: "none", padding: 6, borderRadius: 6, cursor: "pointer", display: "flex" }}
                    >
                      <Video size={13} />
                    </a>
                  )}
                  {!s.booked && (
                    <button
                      onClick={() => handleDelete(s.id)}
                      aria-label="Törlés"
                      style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "none", padding: 6, borderRadius: 6, cursor: "pointer", display: "flex" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(13, 59, 102,0.10)", paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 10 }}>Új időpont erre a napra</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ ...inputStyle, width: 64 }} />
            </div>
            <button
              onClick={handleAdd}
              disabled={saving || !time}
              style={{
                width: "100%",
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 13,
                cursor: saving || !time ? "not-allowed" : "pointer",
                opacity: saving || !time ? 0.6 : 1,
              }}
            >
              {saving ? "Mentés..." : "+ Hozzáadás"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
