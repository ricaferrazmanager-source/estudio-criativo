import { AccessForm } from "../access-form";
export default function InvitePage() {
  return <main className="access-page"><section className="access-card"><p className="access-brand">Estúdio Criativo</p><h1>Você foi convidado.</h1><p>Aceite o convite para definir sua senha.</p><AccessForm mode="accept" /><a href="/login">Voltar para entrar</a></section></main>;
}
