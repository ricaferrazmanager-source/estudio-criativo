"use client";

import { useState } from "react";

type Section = "Visão geral" | "Como funciona" | "Próximas etapas";
const steps = [
  ["Conhecer o produto", "Reunir referências e características."],
  ["Definir a direção", "Combinar identidade e intenção criativa."],
  ["Criar e revisar", "Gerar imagens e escolher os melhores resultados."],
];
export default function Home() {
  const [section, setSection] = useState<Section>("Visão geral");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  async function verify() {
    setStatus("loading");
    try {
      const response = await fetch("/api/health", { cache: "no-store", signal: AbortSignal.timeout(5000) });
      const data = await response.json();
      setStatus(response.ok && data.status === "ok" && data.project === "Estúdio Criativo" ? "ok" : "error");
    } catch { setStatus("error"); }
  }
  const titles = { idle: "Pronta para verificar", loading: "Verificando…", ok: "Base funcionando", error: "Base indisponível" };
  return <div className="shell">
    <a className="skip" href="#main">Ir para o conteúdo</a>
    <aside className="sidebar">
      <div className="brand"><span aria-hidden="true">▦</span> Estúdio Criativo</div>
      <nav className="nav" aria-label="Navegação principal">{(["Visão geral", "Como funciona", "Próximas etapas"] as Section[]).map((item, index) => <button key={item} type="button" aria-current={section === item ? "page" : undefined} onClick={() => setSection(item)}><span aria-hidden="true">{["⌂", "☷", "↗"][index]}</span>{item}</button>)}</nav>
      <p className="sidebar-note">Seu espaço de criação</p>
    </aside>
    <div className="workspace">
      <header className="topbar"><span>{section}</span><span className="local"><span aria-hidden="true">●</span> Versão local</span></header>
      <main id="main" className="content">
        {section === "Visão geral" ? <>
          <h1>Seu estúdio começa aqui.</h1><p className="intro">Um espaço para transformar produtos em imagens com identidade.</p>
          <button type="button" className="banner" onClick={() => setSection("Próximas etapas")}><span><strong>Vamos construir por etapas.</strong><p>Esta primeira versão apresenta o espaço de trabalho. A criação de imagens será adicionada nas próximas etapas.</p></span><span aria-hidden="true" className="arrow">→</span></button>
          <div className="columns"><section className="panel"><h2>Do produto à imagem</h2><ol className="steps">{steps.map(([title, description], index) => <li key={title} className="step"><span className="number">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><span className="soon">Em breve</span></li>)}</ol></section>
          <section className="panel status-panel"><h2>Funcionamento da base</h2><div role="status" aria-live="polite"><div className="status-title"><span aria-hidden="true" className={`status-dot ${status}`} />{titles[status]}</div><p>{status === "ok" ? "A base local está respondendo corretamente." : status === "error" ? "Não foi possível consultar a base local. Confira se ela está iniciada e tente novamente." : "Confira se a base local está respondendo."}</p></div><button type="button" className="primary" disabled={status === "loading"} onClick={verify}>{status === "loading" ? "Verificando…" : status === "error" ? "Tentar novamente" : status === "ok" ? "Verificar novamente" : "Verificar agora"}</button></section></div>
        </> : section === "Como funciona" ? <section className="explanation"><h1>Do produto à imagem</h1><p className="intro">Uma visão do caminho que vamos construir.</p><ol className="steps">{steps.map(([title, description], index) => <li className="step" key={title}><span className="number">0{index + 1}</span><div><h2>{title}</h2><p>{description}</p></div></li>)}</ol><p className="notice">Essas etapas ainda não estão disponíveis. Hoje você pode conhecer o espaço e verificar a base local.</p></section> : <section className="explanation"><h1>Um passo de cada vez.</h1><p className="intro">O Estúdio Criativo está começando.</p><ol className="stage-list"><li><h2>Agora: primeira tela local</h2><p>Navegação, apresentação do projeto e verificação da base.</p></li><li><h2>Depois: definir o próximo incremento</h2><p>Cada nova etapa será apresentada para sua aprovação antes de começar.</p></li><li><h2>Mais adiante: criar com identidade</h2><p>Informações do produto, identidade da marca e direção criativa apoiarão a geração e edição de imagens.</p></li></ol><p className="notice">Nenhum serviço pago está conectado nesta versão.</p></section>}
      </main>
      <footer className="footer"><span>Estúdio Criativo</span><span>Construído um passo de cada vez.</span></footer>
    </div>
  </div>;
}