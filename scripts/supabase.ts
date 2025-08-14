import { withRetry } from './retry';

const ENV = process.env.EXPO_PUBLIC_ENV === 'production' ? 'production' : 'development';

const SUPABASE_URL =
  ENV === 'production'
    ? process.env.EXPO_PUBLIC_SUPABASE_URL_PROD!
    : process.env.EXPO_PUBLIC_SUPABASE_URL_DEV!;
const SUPABASE_KEY =
  ENV === 'production'
    ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_PROD!
    : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_DEV!;
const EVENT_TABLE =
  ENV === 'production'
    ? process.env.EXPO_PUBLIC_SUPABASE_EVENT_TABLE_PROD!
    : process.env.EXPO_PUBLIC_SUPABASE_EVENT_TABLE_DEV!;

async function insert(table: string, values: Record<string, any>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Supabase insert failed');
  }

  return res.json();
}

export async function logEvent(action: string, payload: Record<string, any>) {
  return withRetry(() =>
    insert(EVENT_TABLE, {
      action,
      payload,
      created_at: new Date().toISOString(),
    }),
  );
}
