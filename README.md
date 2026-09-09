# Estúdio Criativo

Projeto para geração e edição de imagens por API, com Product DNA, Brand DNA, Creative DNA, Prompt Compiler e Model Router.

## O que já funciona

A primeira base local responde em `/health` e possui três testes automáticos. Ainda não há interface visual, geração de imagens, autenticação ou conexão com serviços externos. Esta entrega é somente o primeiro incremento do M0.

## Executar no computador

Requisitos: Node.js 24 e pnpm 11.19.0. Não é necessário login em provedores nem arquivo `.env` para esta base.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

Abra http://127.0.0.1:8787/health. A resposta esperada é:

```json
{"status":"ok","project":"Estúdio Criativo"}
```

O servidor fica restrito ao computador local. Use `x` no terminal do servidor para encerrá-lo.

## Verificações

- `pnpm lint`: revisão automatizada do código.
- `pnpm typecheck`: geração local dos tipos do Worker e validação TypeScript.
- `pnpm test`: três testes no runtime Workers (saúde, endereço inexistente e método não permitido).
- `pnpm check`: executa as três verificações acima.

## Continuidade e organização

Antes de alterar o projeto, leia `AGENTS.md`, `docs/PROJECT_STATE.md` e `docs/HANDOFF.md`.

A base está em `apps/api`; dependências e configurações compartilhadas ficam na raiz. `pnpm-lock.yaml` registra as versões instaladas. Tipos gerados em `apps/api/.wrangler` e dependências não são versionados.

O planejamento Word permanece na raiz, sem alterações e não versionado. `docs/ARCHITECTURE.md` e `docs/ROADMAP.md` continuam como registros preliminares; não foram reescritos neste incremento.

O remoto `origin` já está configurado para o repositório do Estúdio Criativo, com branch `main` e upstream `origin/main`. Esta entrega é local; não houve push ou deploy.

`.env.example` permanece com valores vazios. Nunca adicione credenciais reais a arquivos versionados.
