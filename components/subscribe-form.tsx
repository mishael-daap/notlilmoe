"use client";

import { useActionState, useState, useTransition } from "react";
import { subscribe } from "@/app/actions/subscribe";
import {
  EMAIL_MAX,
  EMAIL_PATTERN,
  NAME_MAX,
  parseFan,
  type FanField,
  type FanFormState,
} from "@/lib/validation";

import { buildTemplateParams } from "@/lib/fan-params";

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

/**
 * Handed down from the server so the values stay in env instead of being
 * duplicated with a NEXT_PUBLIC_ prefix. The public key is public by design.
 */
export type EmailJsConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  toEmail: string;
};

const initialState: FanFormState = { error: null };

const fieldClass =
  "min-h-11 w-full min-w-0 bg-transparent py-2 text-[clamp(1.1rem,5vw,1.75rem)] tracking-tight placeholder:tracking-tight";
const labelClass = "block text-[11px] uppercase tracking-[0.3em] text-foreground/55";

export function SubscribeForm({ emailjs }: { emailjs: EmailJsConfig | null }) {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const [local, setLocal] = useState<{ field: FanField; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [, startTransition] = useTransition();

  const error = local ?? state.error;
  const busy = pending || sending;

  /**
   * EmailJS blocks server-side sends unless the dashboard opt-in is on, but
   * accepts browser requests. So the notification goes out here first, and the
   * action is told whether it still needs to try from the server.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!emailjs) return; // no browser config: leave it entirely to the action

    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const parsed = parseFan({ name: data.get("name"), email: data.get("email") });

    if (!parsed.ok) {
      setLocal({ field: parsed.field, message: parsed.message });
      return;
    }

    setLocal(null);
    setSending(true);

    let sent = false;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailjs.serviceId,
          template_id: emailjs.templateId,
          user_id: emailjs.publicKey,
          template_params: buildTemplateParams(parsed, emailjs.toEmail),
        }),
      });

      sent = response.ok;
      if (!sent) console.error("[subscribe] EmailJS", response.status, await response.text());
    } catch (cause) {
      console.error("[subscribe] EmailJS unreachable", cause);
    } finally {
      setSending(false);
    }

    data.set("emailSent", sent ? "1" : "0");
    startTransition(() => formAction(data));
  }

  return (
    <section id="subscribe" className="mt-12 px-5 sm:px-8">
      <form onSubmit={handleSubmit} action={formAction} className="flex flex-col gap-6">
        <div
          className={`border-b transition-colors focus-within:border-accent ${
            error?.field === "name" ? "border-accent" : "border-rule"
          }`}
        >
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={NAME_MAX}
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Your name"
            aria-invalid={error?.field === "name" || undefined}
            aria-describedby={error ? "fan-error" : undefined}
            className={fieldClass}
          />
        </div>

        <div className="flex items-end gap-3">
          <div
            className={`min-w-0 flex-1 border-b transition-colors focus-within:border-accent ${
              error?.field === "email" ? "border-accent" : "border-rule"
            }`}
          >
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={EMAIL_MAX}
              pattern={EMAIL_PATTERN.source}
              autoComplete="email"
              autoCapitalize="off"
              inputMode="email"
              enterKeyHint="go"
              placeholder="you@email.com"
              aria-invalid={error?.field === "email" || undefined}
              aria-describedby={error ? "fan-error" : undefined}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            aria-label={busy ? "Saving" : "Continue"}
            className="grid size-11 shrink-0 place-items-center text-[clamp(1.5rem,7vw,2.25rem)] leading-none text-accent disabled:opacity-40"
          >
            &rarr;
          </button>
        </div>

        <p
          id="fan-error"
          role="alert"
          aria-live="polite"
          className="min-h-5 text-[13px] leading-relaxed text-accent"
        >
          {error?.message ?? ""}
        </p>
      </form>
    </section>
  );
}
