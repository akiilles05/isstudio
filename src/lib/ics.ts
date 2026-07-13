function toIcsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildBookingIcs(params: {
  uid: string;
  start: Date;
  durationMinutes: number;
  summary: string;
  description: string;
  location?: string;
  organizerEmail: string;
  attendeeEmail: string;
  attendeeName: string;
}) {
  const end = new Date(params.start.getTime() + params.durationMinutes * 60_000);
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//I&S Studio//Booking//HU",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${params.uid}`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(params.start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(params.summary)}`,
    `DESCRIPTION:${escapeText(params.description)}`,
    ...(params.location ? [`LOCATION:${escapeText(params.location)}`] : []),
    `ORGANIZER;CN=I&S Studio:mailto:${params.organizerEmail}`,
    `ATTENDEE;CN=${escapeText(params.attendeeName)};RSVP=TRUE:mailto:${params.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}
