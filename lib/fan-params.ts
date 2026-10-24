/**
 * Template parameters sent to EmailJS, shared by the browser send in
 * `subscribe-form.tsx` and the server fallback in `lib/notify.ts`.
 *
 * EmailJS only fills the variables a template actually references, and the
 * dashboard's default template uses different names than ours (`from_name`,
 * `message`). Sending the common aliases means a template fills correctly
 * whichever naming it was written with — the unused keys are ignored.
 */
const ALIASES = ["email", "from_email", "user_email", "email_address"] as const;
const NAME_ALIASES = ["name", "from_name", "user_name"] as const;

export function buildTemplateParams(
  fan: { name: string; email: string },
  toEmail: string,
) {
  const params: Record<string, string> = {
    to_email: toEmail,
    reply_to: fan.email,
    submitted_at: new Date().toUTCString(),
    // EmailJS's stock template asks for `time`, not `submitted_at`.
    time: new Date().toUTCString(),
    message: `${fan.name} <${fan.email}>`,
  };

  for (const key of NAME_ALIASES) params[key] = fan.name;
  for (const key of ALIASES) params[key] = fan.email;

  return params;
}
