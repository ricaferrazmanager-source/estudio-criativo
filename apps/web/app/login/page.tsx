import { AccessForm } from "../access-form";
export default function LoginPage() {
  return <main className="access-page"><section className="access-card"><p className="access-brand">Estúdio Criativo</p><h1>Entre no seu estúdio.</h1><p>Um espaço para criar com identidade.</p><AccessForm mode="login" /><p className="access-note">Acesso somente por convite. Para receber acesso ou ajuda com sua senha, fale com o administrador.</p></section></main>;
}
