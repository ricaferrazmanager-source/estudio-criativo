import { redirect } from "next/navigation";
import { requireMember } from "../../lib/supabase";
import { AccessForm } from "../access-form";
export default async function TeamPage() {
  const member = await requireMember();
  if (!member.admin) redirect("/");
  return <main className="access-page"><section className="access-card"><p className="access-brand">Estúdio Criativo</p><h1>Convide sua equipe.</h1><p>O convidado poderá usar o estúdio, sem permissão para administrar os acessos.</p><AccessForm mode="invite" /><a href="/">Voltar ao estúdio</a></section></main>;
}
