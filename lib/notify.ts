/**
 * Notifies the artist when a fan submits the form.
 *
 * EmailJS over its REST endpoint instead of the browser SDK: no dependency, no
 * client bundle weight, and the call happens on the server so it still fires
 * with JS disabled. Needs EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
 * EMAILJS_PUBLIC_KEY and (for server-side sends) EMAILJS_PRIVATE_KEY.
 */

import { buildTemplateParams } from "@/lib/fan-params";

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/** Where the notification lands. */
const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "msowunmi@gmail.com";

type Fan = { name: string; email: string };

export function isNotifyConfigured() {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_TEMPLATE_ID &&
      process.env.EMAILJS_PUBLIC_KEY,
  );
}

/**
 * Returns true when EmailJS accepted the send. Throws when it is configured but
 * the send failed, so the caller can tell "nothing set up" from "went wrong".
 */
export async function notifyNewFan(fan: Fan) {
  if (!isNotifyConfigured()) {
    console.warn("[notify] EmailJS env vars missing — notification skipped");
    return false;
  }

  const accessToken = process.env.EMAILJS_PRIVATE_KEY;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      ...(accessToken ? { accessToken } : {}),
      template_params: buildTemplateParams(fan, NOTIFY_TO),
    }),
  });

  if (!response.ok) {
    throw new Error(`EmailJS ${response.status}: ${await response.text()}`);
  }

  return true;
}
