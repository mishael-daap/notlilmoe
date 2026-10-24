"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { parseFan, type FanFormState } from "@/lib/validation";
import { upsertSubscriber } from "@/lib/subscribers";
import { setFanCookie } from "@/lib/fan-cookie";
import { notifyNewFan } from "@/lib/notify";

export async function subscribe(_prev: FanFormState, formData: FormData): Promise<FanFormState> {
  const parsed = parseFan({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.ok) {
    return { error: { field: parsed.field, message: parsed.message } };
  }

  const fan = { name: parsed.name, email: parsed.email };

  // The browser already sent the EmailJS notification when it could; only try
  // from here if it could not, so a fan never gets two emails.
  const alreadySent = formData.get("emailSent") === "1";

  // Two independent capture channels: the database and the notification email.
  // Either one keeping the fan is enough to let them through.
  let storedId: string | null = null;
  try {
    storedId = await upsertSubscriber(fan);
  } catch (error) {
    console.error("[subscribe] store failed", error);
  }

  let notified = alreadySent;
  if (!alreadySent) {
    try {
      notified = await notifyNewFan(fan);
    } catch (error) {
      console.error("[subscribe] notify failed", error);
    }
  }

  if (!storedId && !notified) {
    return {
      error: {
        field: "form",
        message: "Couldn't save that just now. Try again in a moment.",
      },
    };
  }

  // Outside the try: redirect() signals by throwing.
  await setFanCookie(storedId ?? randomUUID());
  redirect("/listen");
}
