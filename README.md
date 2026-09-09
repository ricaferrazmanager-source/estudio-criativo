# Estúdio Criativo

Projeto para geração e edição de imagens por API, organizado em torno de Product DNA, Brand DNA, Creative DNA, Prompt Compiler e Model Router, com abertura para novos modelos e provedores.

## Estado atual
Preparação documental do repositório. Nenhuma funcionalidade, aplicação, dependência ou infraestrutura foi implementada nesta etapa.
O documento de planejamento aprovado ainda precisa ser disponibilizado e consultado antes da implementação funcional.

## Estrutura
```text
AGENTS.md
README.md
.gitignore
.env.example
docs/
  ARCHITECTURE.md
  PROJECT_STATE.md
  ROADMAP.md
  CHANGELOG.md
  KNOWN_ISSUES.md
  LEARNINGS.md
  HANDOFF.md
```

Leia `AGENTS.md`, `docs/PROJECT_STATE.md` e `docs/HANDOFF.md` antes de alterar o projeto.

## Tecnologias direcionadoras
- Supabase/PostgreSQL.
- Cloudflare R2.
- Cloudflare Workers/Queues.
- APIs de geração e edição de imagens, com suporte extensível a modelos e provedores.
- Git e GitHub privado para versionamento e continuidade.

Detalhes, responsabilidades e decisões pendentes estão em `docs/ARCHITECTURE.md`.

## Conexão futura com GitHub privado
Crie um repositório **privado e vazio**, sem inicializar README, licença ou `.gitignore`. Confirme o proprietário e a URL antes de executar, substituindo os marcadores:

```sh
git remote add origin git@github.com:PROPRIETARIO/REPOSITORIO.git
git remote -v
git push -u origin main
```

Esses comandos são instruções para uma etapa posterior; não significam que um remoto foi configurado ou que houve push. A privacidade é configurada no GitHub, não no Git local. Use autenticação segura sem incorporar tokens à URL.

## Configuração
`.env.example` documenta apenas nomes iniciais de variáveis e não contém credenciais. Os nomes serão confirmados durante a implementação. Ainda não há comandos de instalação, execução ou testes funcionais.
