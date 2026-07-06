import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "true";

  if (all) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const slots = await prisma.bookingSlot.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json(slots);
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

  const { date, duration } = await req.json();
  if (!date) return NextResponse.json({ error: "Hiányzó dátum" }, { status: 400 });

  const slot = await prisma.bookingSlot.create({
    data: { date: new Date(date), duration: duration || 30 },
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
