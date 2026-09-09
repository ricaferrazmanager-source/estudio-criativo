# Estado do projeto

Atualizado em: 2026-09-09. Versão local: 0.2.0. M0 parcial.

## Implementado

API Workers em apps/api e primeira tela Next.js/React em apps/web, conforme o incremento aprovado. Visão geral, explicações e próximas etapas; consulta real da base com estados de espera, sucesso, erro e nova tentativa. Nome oficial: Estúdio Criativo.

## Validado

Lint e TypeScript passaram. Três testes da API e quatro testes de navegador passaram. Build da interface passou. Consulta real pelo botão confirmou a API local. Capturas de computador (1440 px) e celular (390 px) inspecionadas, sem transbordamento horizontal. O navegador integrado estava indisponível neste ambiente; a conferência utilizou Chromium pelo Playwright.

## Git e preservação

Último commit funcional validado: 15330ec (0.2.0). Baseline publicada e validada no GitHub: 4c4b215. Os três commits locais foram enviados com autorização. Sem deploy. AGENTS.md, arquitetura, roadmap e Word preservados; Word na raiz, não versionado. Não reaplicar f1d3d9f.

## Limites e próximo passo

Ainda não há autenticação, banco, storage, filas, geração ou edição de imagens. Nenhum serviço pago ou segredo necessário. Próximo passo: definir e aprovar o próximo incremento do M0. Novas funcionalidades exigem incremento definido e aprovado.

## Ambiente

Node 24, pnpm 11.19.0. pnpm dev inicia interface em 127.0.0.1:3000 e API em 127.0.0.1:8787. Servidores mantidos disponíveis ao final para revisão local; podem precisar ser reiniciados em nova sessão. O terminal exige execução autorizada fora do sandbox neste ambiente; confiança Git limitada a cada comando. Capturas e resultados de testes ficam em node_modules/.cache, ignorado.

## Checagem automática preparada

`.github/workflows/checks.yml`: push/PR para main e execução manual; Ubuntu 24.04, Node 24.19.0, pnpm conforme package.json, instalação frozen-lockfile, Chromium com dependências, pnpm check e pnpm build. Permissão contents: read, credenciais de checkout não persistidas, timeout 20 minutos, ações fixadas por SHA. Sem deploy ou segredos de provedores.

Validação deste incremento: actionlint 1.7.12 sem erros; pnpm install --frozen-lockfile, lint, typecheck, 3 testes API, 4 testes de navegador e build passaram localmente no Windows. A primeira execução no Ubuntu do GitHub concluiu com sucesso em 4c4b215: https://github.com/ricaferrazmanager-source/estudio-criativo/actions/runs/34404329453. Actions está habilitado. Versão funcional permanece 0.2.0; M0 continua parcial.
