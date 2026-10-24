/**
 * Server-only. Talks to Supabase's PostgREST endpoint over plain fetch, so the
 * app carries no Supabase SDK dependency. The service role key bypasses RLS,
 * which is why this module must never be imported from a client component.
 */

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    this.name = "SupabaseNotConfiguredError";
  }
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

type RestInit = Omit<RequestInit, "headers"> & {
  prefer?: string;
  headers?: Record<string, string>;
};

export async function supabaseRest<T = null>(
  path: string,
  { prefer, headers, ...init }: RestInit = {},
): Promise<T> {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new SupabaseNotConfiguredError();

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase ${response.status} on ${path}: ${await response.text()}`);
  }

  const body = await response.text();
  return (body ? JSON.parse(body) : null) as T;
}
