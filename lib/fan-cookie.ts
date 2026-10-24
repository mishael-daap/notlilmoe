/**
 * The gate. Submitting the form mints this cookie; `/listen` and `/go/*` read
 * it. It holds the subscriber id only — no name, no email — so a stolen cookie
 * leaks nothing beyond "this browser passed the form once".
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
