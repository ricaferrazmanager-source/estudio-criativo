"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { receiveEmailLink } from "./auth-actions";

const invalid = "Link inválido ou expirado. Solicite um novo e-mail.";
export function EmailLinkReceiver({ children }: { children: ReactNode }) {
  const captured = useRef(false);
  const [link, setLink] = useState<{ access: string; refresh: string; type: string } | null>(null);
  const [error, setError] = useState("");
  const [state, action, pending] = useActionState(receiveEmailLink, {});
  useEffect(() => {
    if (captured.current) return;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (!hash.has("access_token") && !hash.has("refresh_token") && !hash.has("error") && !hash.has("error_code")) return;
    captured.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    const access = hash.get("access_token") ?? "";
    const refresh = hash.get("refresh_token") ?? "";
    const type = hash.get("type") ?? "";
    if (hash.has("error") || hash.has("error_code") || !access || !refresh || !["invite", "recovery"].includes(type)) {
      setError(invalid);
      return;
    }
    setLink({ access, refresh, type });
  }, []);
  useEffect(() => {
    if (state.success) window.location.replace("/definir-senha");
  }, [state.success]);
  if (!link && !error) return children;
  return <main className="access-page"><section className="access-card">
    <p className="access-brand">Estúdio Criativo</p><h1>Defina sua senha.</h1>
    <p>Continue para validar o link recebido no seu e-mail.</p>
    {error || state.error ? <p role="alert" className="form-error">{error || state.error}</p> : null}
    {link && !state.error ? <form action={action} className="access-form">
      <input type="hidden" name="access_token" value={link.access} />
      <input type="hidden" name="refresh_token" value={link.refresh} />
      <input type="hidden" name="type" value={link.type} />
      <button type="submit" className="primary" disabled={pending || state.success}>{pending || state.success ? "Aguarde…" : "Continuar para definir senha"}</button>
    </form> : null}
  </section></main>;
}
