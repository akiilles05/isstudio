import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { bookingConfirmationEmail, bookingAdminNotificationEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { id, name, email, note } = await req.json();
  if (!id || !name || !email) {
    return NextResponse.json({ error: "Hiányzó mezők" }, { status: 400 });
  }

  const result = await prisma.bookingSlot.updateMany({
    where: { id, booked: false },
    data: { booked: true, name, email, note: note || null },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Ez az időpont már foglalt." }, { status: 409 });
  }

  const slot = await prisma.bookingSlot.findUnique({ where: { id } });
  if (slot) {
    const formatted = slot.date.toLocaleString("hu-HU", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Budapest" });

    sendMail(
      email,
      "Foglalás megerősítve — I&S Studio",
      bookingConfirmationEmail({ name, dateFormatted: formatted, duration: slot.duration })
    ).catch(() => {});

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
    const admin2Email = process.env.ADMIN_NOTIFY_EMAIL_2;
    if (adminEmail && admin2Email) {
      sendMail(
        adminEmail,
        `Új foglalás — ${name}`,
        bookingAdminNotificationEmail({ name, email, note: note || null, dateFormatted: formatted, duration: slot.duration })
      ).catch(() => {});
      sendMail(
        admin2Email,
        `Új foglalás — ${name}`,
        bookingAdminNotificationEmail({ name, email, note: note || null, dateFormatted: formatted, duration: slot.duration })
      ).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
