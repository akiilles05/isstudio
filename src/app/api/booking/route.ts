import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { bookingRoomSlug, videoRoomUrl } from "@/lib/video-room";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "true";

  if (all) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const slots = await prisma.bookingSlot.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json(
      slots.map((s) => ({ ...s, videoUrl: s.booked ? videoRoomUrl(bookingRoomSlug(s.id)) : null }))
    );
  }

  const slots = await prisma.bookingSlot.findMany({
    where: { booked: false, date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const duration = body.duration || 30;

  if (Array.isArray(body.dates)) {
    if (body.dates.length === 0) return NextResponse.json({ error: "Nincs megadva dátum" }, { status: 400 });
    const existing = await prisma.bookingSlot.findMany({
      where: { date: { in: body.dates.map((d: string) => new Date(d)) } },
      select: { date: true },
    });
    const existingTimes = new Set(existing.map((s) => s.date.getTime()));
    const toCreate = (body.dates as string[])
      .map((d) => new Date(d))
      .filter((d) => !existingTimes.has(d.getTime()));

    const result = await prisma.bookingSlot.createMany({
      data: toCreate.map((date) => ({ date, duration })),
    });
    return NextResponse.json({ created: result.count, skipped: body.dates.length - toCreate.length });
  }

  const { date } = body;
  if (!date) return NextResponse.json({ error: "Hiányzó dátum" }, { status: 400 });

  const slot = await prisma.bookingSlot.create({
    data: { date: new Date(date), duration },
  });
  return NextResponse.json(slot);
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.bookingSlot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
