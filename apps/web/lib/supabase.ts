import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}
export async function authClient() {
  const config = authConfig();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.STUDIO_SITE_URL?.startsWith("https://") === true || (process.env.NODE_ENV === "production" && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(process.env.STUDIO_SITE_URL ?? "")) },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000) }) },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => { try { for (const { name, value, options } of values) store.set(name, value, options); } catch { /* Proxy refreshes cookies for Server Components. */ } },
    },
  });
}
export async function currentMember() {
  const client = await authClient();
  if (!client) return null;
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user?.invited_at || !user.email_confirmed_at) return null;
    return { id: user.id, email: user.email ?? "", admin: user.app_metadata?.studio_role === "admin" };
  } catch { return null; }
}
export async function requireMember() {
  const member = await currentMember();
  if (!member) redirect("/login");
  return member;
}
