# Estado do projeto

Atualizado em: 2026-09-09. Versão local: 0.2.0. M0 parcial.

## Implementado

API Workers em apps/api e primeira tela Next.js/React em apps/web, conforme o incremento aprovado. Visão geral, explicações e próximas etapas; consulta real da base com estados de espera, sucesso, erro e nova tentativa. Nome oficial: Estúdio Criativo.

## Validado

Lint e TypeScript passaram. Três testes da API e quatro testes de navegador passaram. Build da interface passou. Consulta real pelo botão confirmou a API local. Capturas de computador (1440 px) e celular (390 px) inspecionadas, sem transbordamento horizontal. O navegador integrado estava indisponível neste ambiente; a conferência utilizou Chromium pelo Playwright.

## Git e preservação

Último commit anterior validado: 3f2a232. Baseline publicada: 6c55188. O incremento 0.2.0 recebe commit local próprio; consultar git log -1 para o identificador. Sem push/deploy. AGENTS.md, arquitetura, roadmap e Word preservados; Word na raiz, não versionado. Não reaplicar f1d3d9f.

## Limites e próximo passo

Ainda não há autenticação, banco, storage, filas, geração ou edição de imagens. Nenhum serviço pago ou segredo necessário. Próximo passo: usuário revisar a tela e aprovar um incremento pequeno antes de ampliar funcionalidades.

## Ambiente

Node 24, pnpm 11.19.0. pnpm dev inicia interface em 127.0.0.1:3000 e API em 127.0.0.1:8787. Servidores mantidos disponíveis ao final para revisão local; podem precisar ser reiniciados em nova sessão. O terminal exige execução autorizada fora do sandbox neste ambiente; confiança Git limitada a cada comando. Capturas e resultados de testes ficam em node_modules/.cache, ignorado.
