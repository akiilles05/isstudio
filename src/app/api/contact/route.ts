import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Hiányzó mezők" }, { status: 400 });
    }
    await prisma.contactMessage.create({
      data: { name, email, company: company || null, message },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Szerver hiba" }, { status: 500 });
  }
}
