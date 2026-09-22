import { requireMember } from "../../lib/supabase";
import { AccessForm } from "../access-form";
export default async function PasswordPage() {
  await requireMember();
  return <main className="access-page"><section className="access-card"><p className="access-brand">Estúdio Criativo</p><h1>Defina sua senha.</h1><AccessForm mode="password" /></section></main>;
}
