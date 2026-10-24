/**
 * The only module that touches the `subscribers` table.
 */
import { supabaseRest } from "@/lib/supabase";
import type { PlatformSlug } from "@/lib/platforms";

type SubscriberRow = { id: string };

/**
 * Inserts the fan, or refreshes the existing row when the email is already
 * known. `created_at` keeps its original value on conflict; `name` and
 * `updated_at` are overwritten.
 */
export async function upsertSubscriber({ name, email }: { name: string; email: string }) {
  const rows = await supabaseRest<SubscriberRow[]>("subscribers?on_conflict=email&select=id", {
    method: "POST",
    body: JSON.stringify({ name, email, updated_at: new Date().toISOString() }),
    prefer: "resolution=merge-duplicates,return=representation",
  });

  const id = rows?.[0]?.id;
  if (!id) throw new Error("Supabase returned no subscriber id");

  return id;
}

export async function recordPlatform(id: string, platform: PlatformSlug) {
  await supabaseRest(`subscribers?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ platform, updated_at: new Date().toISOString() }),
    prefer: "return=minimal",
  });
}
