import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.siteContent.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }));
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updates: { key: string; value: string }[] = await req.json();
  const results = await Promise.all(
    updates.map((u) =>
      prisma.siteContent.update({ where: { key: u.key }, data: { value: u.value } })
    )
  );
  return NextResponse.json(results);
}
