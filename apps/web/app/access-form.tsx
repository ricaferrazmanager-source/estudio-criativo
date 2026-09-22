"use client";

import { useActionState, useEffect, useState } from "react";
import { acceptInvite, invite, login, setPassword } from "./auth-actions";

type Mode = "login" | "invite" | "accept" | "password";
const actions = { login, invite, accept: acceptInvite, password: setPassword };
const labels = { login: "Entrar", invite: "Enviar convite", accept: "Aceitar convite", password: "Salvar senha" };
export function AccessForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState(actions[mode], {});
  const [token, setToken] = useState("");
  useEffect(() => {
    if (mode !== "accept") return;
    const inviteToken = new URLSearchParams(window.location.hash.slice(1)).get("token_hash");
    if (!inviteToken) return;
    setToken(inviteToken);
    window.history.replaceState(null, "", window.location.pathname);
  }, [mode]);
  return <form action={action} className="access-form">
    {mode === "login" || mode === "invite" ? <label>{mode === "invite" ? "E-mail do convidado" : "E-mail"}<input name="email" type="email" autoComplete="email" maxLength={254} required /></label> : null}
    {mode === "login" || mode === "password" ? <label>Senha<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "password" ? 12 : 1} maxLength={128} required /></label> : null}
    {mode === "password" ? <><p>Use pelo menos 12 caracteres.</p><label>Confirmar senha<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label></> : null}
    {mode === "accept" ? <input type="hidden" name="token_hash" value={token} /> : null}
    {state.error ? <p role="alert" className="form-error">{state.error}</p> : null}
    {state.message ? <p role="status">{state.message}</p> : null}
    <button type="submit" className="primary" disabled={pending}>{pending ? "Aguarde…" : labels[mode]}</button>
  </form>;
}
