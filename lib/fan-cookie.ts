/**
 * Records which fan tapped which service. Set at submit time, read by
 * `/go/<platform>`. It is attribution only — nothing is gated behind it.
 * Holds the subscriber id, no name or email.
 */
import { cookies } from "next/headers";

const COOKIE = "nlm_fan";
const SIX_MONTHS = 60 * 60 * 24 * 180;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function setFanCookie(id: string) {
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SIX_MONTHS,
  });
}

export async function readFanId() {
  const value = (await cookies()).get(COOKIE)?.value;
  return value && UUID.test(value) ? value : null;
}
