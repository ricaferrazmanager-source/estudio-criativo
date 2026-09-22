# Estúdio Criativo

Projeto para geração e edição de imagens por API, com Product DNA, Brand DNA, Creative DNA, Prompt Compiler e Model Router.

## O que já funciona

A versão 0.5.0 inclui login por convite, saída, proteção do estúdio e formulário de convites para administrador. A ativação das contas e do envio real de e-mails no Supabase está pendente. A opção Produtos inclui preenchimento, revisão, salvamento da primeira versão e consulta, testados localmente. Salvamento real desativado até aplicar/homologar o banco e o vínculo de equipe; sem fotos. Geração de imagens ainda não existe; M0 continua parcial.

## Executar no computador

Requisitos: Node.js 24 e pnpm 11.19.0. Para usar o login real, configurar apps/web/.env.local conforme .env.example. Os testes usam provedor simulado e não precisam de chaves reais.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm dev
```

Abra http://127.0.0.1:3000 para entrar. Sem sessão válida, a página direciona ao login. A API continua em http://127.0.0.1:8787/health, com a resposta:

```json
{"status":"ok","project":"Estúdio Criativo"}
```

O servidor fica restrito ao computador local. Use Ctrl+C no terminal para encerrar os servidores.

## Verificações

- `pnpm lint`: revisão automatizada do código.
- `pnpm typecheck`: geração local dos tipos do Worker e validação TypeScript.
- `pnpm test`: treze testes de banco em memória, três testes da API e vinte e três testes de navegador (autenticação, autorização, convite, senha, navegação e celular), com serviço de identidade simulado.
- `pnpm check`: executa as três verificações acima.
- `pnpm build`: compila a interface para validar sua distribuição.

## Continuidade e organização

Antes de alterar o projeto, leia `AGENTS.md`, `docs/PROJECT_STATE.md` e `docs/HANDOFF.md`.

A interface Next.js/React está em `apps/web` e consulta a API pelo caminho local `/api/health`, com limite de espera e validação da resposta. A base está em `apps/api`; dependências e configurações compartilhadas ficam na raiz. `pnpm-lock.yaml` registra as versões instaladas. Tipos gerados em `apps/api/.wrangler` e dependências não são versionados.

O planejamento Word permanece na raiz, sem alterações e não versionado. `docs/ARCHITECTURE.md` e `docs/ROADMAP.md` continuam como registros preliminares; não foram reescritos neste incremento.

O remoto `origin` já está configurado para o repositório do Estúdio Criativo, com branch `main` e upstream `origin/main`. Os commits da base, da tela e do CI foram enviados com autorização; não houve deploy.

`.env.example` permanece com valores vazios. Nunca adicione credenciais reais a arquivos versionados.

## Checagem automática no GitHub

O arquivo `.github/workflows/checks.yml` prepara verificação em pushes para main, pull requests destinados a main e execução manual. Instala as versões do lockfile e o Chromium, executa `pnpm check` e `pnpm build`, com acesso somente de leitura ao repositório. Não usa segredos de provedores e não publica a aplicação.

Configuração validada localmente com actionlint 1.7.12; testes e build passaram no Windows. A primeira execução em Ubuntu no GitHub passou após o push autorizado: [resultado em 4c4b215](https://github.com/ricaferrazmanager-source/estudio-criativo/actions/runs/34404329453). Actions está habilitado no repositório. Não foram alteradas proteções de branch.

Referências oficiais: [setup-node](https://github.com/actions/setup-node), [pnpm/action-setup v4](https://github.com/pnpm/action-setup/tree/v4) e [Playwright em CI](https://playwright.dev/docs/ci). Ações fixadas por SHA, conferido nos respectivos repositórios oficiais.

## Ativação do acesso por convite

Consulte [a decisão e o procedimento de configuração](docs/DECISIONS/0001-invite-only-auth.md). Somente pessoas convidadas e com e-mail confirmado entram. O administrador ainda precisa ser ativado; configurar URLs, template do convite e envio de e-mails antes de homologar com contas reais. Nunca colocar a chave administrativa em variáveis NEXT_PUBLIC ou no Git.

## Ativação do catálogo

STUDIO_CATALOG_ENABLED vazio mantém o recurso desativado. Consulte docs/DECISIONS/0004-product-persistence.md antes de ativar. Nenhuma migration remota executada; a aprovação desta implementação local não autoriza aplicação no Supabase.
