"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { authClient, authConfig, currentMember } from "../lib/supabase";

type Result = { error?: string; message?: string };
function field(data: FormData, name: string) { const value = data.get(name); return typeof value === "string" ? value : ""; }
const validEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function login(_state: Result, data: FormData): Promise<Result> {
  const email = field(data, "email").trim();
  const password = field(data, "password");
  if (!validEmail(email) || !password || password.length > 256) return { error: "Informe seu e-mail e sua senha." };
  const client = await authClient();
  if (!client) return { error: "O acesso ainda está sendo configurado. Tente novamente mais tarde." };
  try {
    const { data: result, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !result.user) return { error: "Não foi possível entrar. Confira seus dados e tente novamente." };
    if (!result.user.invited_at || !result.user.email_confirmed_at) {
      await client.auth.signOut({ scope: "local" });
      return { error: "Este acesso precisa de um convite do administrador." };
    }
  } catch { return { error: "Não foi possível entrar. Tente novamente em instantes." }; }
  redirect("/");
}
export async function logout() {
  const client = await authClient();
  if (client) {
    try { await client.auth.signOut({ scope: "local" }); } catch { /* Clear the local browser session below, even offline. */ }
  }
  const { cookies } = await import("next/headers");
  const store = await cookies();
  // Only Supabase auth cookies; no unrelated application cookies are removed.
  for (const item of store.getAll()) if (/^sb-.*-auth-token(?:\.\d+)?$/.test(item.name)) store.delete(item.name);
  redirect("/login");
}
export async function acceptInvite(_state: Result, data: FormData): Promise<Result> {
  const token = field(data, "token_hash");
  if (!/^[A-Za-z0-9_-]{10,512}$/.test(token)) return { error: "Convite inválido ou expirado. Solicite um novo convite." };
  const client = await authClient();
  if (!client) return { error: "O acesso ainda está sendo configurado." };
  try {
    const { error, data: result } = await client.auth.verifyOtp({ token_hash: token, type: "invite" });
    if (error || !result.user?.invited_at) return { error: "Convite inválido ou expirado. Solicite um novo convite." };
  } catch { return { error: "Não foi possível verificar o convite. Tente novamente." }; }
  redirect("/definir-senha");
}
export async function setPassword(_state: Result, data: FormData): Promise<Result> {
  if (!await currentMember()) return { error: "Sua sessão expirou. Abra um convite válido ou entre novamente." };
  const password = field(data, "password");
  if (password.length < 12 || password.length > 128) return { error: "Use uma senha com 12 a 128 caracteres." };
  if (password !== field(data, "confirmation")) return { error: "As senhas precisam ser iguais." };
  const client = await authClient();
  try {
    const result = await client?.auth.updateUser({ password });
    if (!result || result.error) return { error: "Não foi possível salvar a senha. Tente novamente." };
  } catch { return { error: "Não foi possível salvar a senha. Tente novamente." }; }
  redirect("/");
}
export async function invite(_state: Result, data: FormData): Promise<Result> {
  const member = await currentMember();
  if (!member?.admin) return { error: "Somente o administrador pode enviar convites." };
  const email = field(data, "email").trim();
  if (!validEmail(email)) return { error: "Informe um e-mail válido." };
  const config = authConfig();
  const secret = process.env.SUPABASE_SECRET_KEY;
  const site = process.env.STUDIO_SITE_URL;
  if (!config || !secret || !site) return { error: "O envio de convites ainda precisa ser configurado." };
  try { const origin = new URL(site); if (origin.protocol !== "https:" && !(origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname))) return { error: "O endereço do estúdio precisa ser configurado." }; } catch { return { error: "O endereço do estúdio precisa ser configurado." }; }
  // This client exists only on the server, after verifying administrator access.
  const admin = createClient(config.url, secret, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) } });
  try {
    const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${site.replace(/\/$/, "")}/convite` });
    if (error) return { error: "Não foi possível enviar. Confira o endereço e a configuração de e-mail." };
    return { message: "Convite enviado. A pessoa receberá as instruções por e-mail." };
  } catch { return { error: "Não foi possível confirmar o envio. Confira o painel antes de tentar novamente." }; }
}

export async function receiveEmailLink(_state: { error?: string; success?: boolean }, data: FormData): Promise<{ error?: string; success?: boolean }> {
  const invalid = { error: "Link inválido ou expirado. Solicite um novo e-mail." };
  const access = field(data, "access_token");
  const refresh = field(data, "refresh_token");
  if (!["invite", "recovery"].includes(field(data, "type")) ||
    !/^[A-Za-z0-9_.-]{20,8192}$/.test(access) ||
    !/^[A-Za-z0-9_-]{1,2048}$/.test(refresh)) return invalid;
  const client = await authClient();
  if (!client) return { error: "O acesso ainda está sendo configurado." };
  try {
    // Validate with the provider before writing cookies; the URL type is not proof of identity.
    const verified = await client.auth.getUser(access);
    if (verified.error || !verified.data.user?.invited_at || !verified.data.user.email_confirmed_at) return invalid;
    const result = await client.auth.setSession({ access_token: access, refresh_token: refresh });
    if (result.error || result.data.user?.id !== verified.data.user.id ||
      !result.data.user?.invited_at || !result.data.user.email_confirmed_at) {
      await client.auth.signOut({ scope: "local" });
      return invalid;
    }
    return { success: true };
  } catch { return invalid; }
}
