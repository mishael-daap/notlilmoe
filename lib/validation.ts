/**
 * One definition of "a valid fan", used by the server action (authority) and
 * rendered into the form as native constraints (fast feedback, no JS needed).
 */

export const NAME_MAX = 80;
export const EMAIL_MAX = 254;

/**
 * Deliberately pragmatic: this rejects typos and obvious junk without trying
 * to out-guess RFC 5322. A bad string that slips through is still a deliverable
 * address or it bounces later.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FanField = "name" | "email";

export type FanFormState = {
  error: { field: FanField | "form"; message: string } | null;
};

export type ParseFanResult =
  | { ok: true; name: string; email: string }
  | { ok: false; field: FanField; message: string };

export function parseFan(raw: { name: unknown; email: unknown }): ParseFanResult {
  const name = String(raw.name ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const email = String(raw.email ?? "")
    .trim()
    .toLowerCase();

  if (!name) {
    return { ok: false, field: "name", message: "We need a name to know who's listening." };
  }

  if (name.length > NAME_MAX) {
    return { ok: false, field: "name", message: `Keep the name under ${NAME_MAX} characters.` };
  }

  if (!email) {
    return { ok: false, field: "email", message: "We need an email to let you in." };
  }

  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    return { ok: false, field: "email", message: "That email doesn't look right." };
  }

  return { ok: true, name, email };
}
