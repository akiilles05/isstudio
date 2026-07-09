import { createHmac, randomBytes } from "crypto";

const SECRET = process.env.VIDEO_ROOM_SECRET ?? "isstudio-video-room-secret";

/** Deterministic, unguessable room slug for a given booking slot. */
export function bookingRoomSlug(bookingId: number): string {
  const hash = createHmac("sha256", SECRET).update(`booking-${bookingId}`).digest("hex").slice(0, 20);
  return `isstudio-${hash}`;
}

/** Random room slug for an ad-hoc call started outside of a booking. */
export function randomRoomSlug(): string {
  return `isstudio-${randomBytes(10).toString("hex")}`;
}

export function videoRoomUrl(room: string): string {
  return `https://isstudio.hu/videohivas/${room}`;
}
