# Changelog

## 2026-09-09 — preparação inicial
- Inicialização do Git local na branch `main`.
- Preparação da estrutura documental e das regras de leitura e encerramento de sessão.
- Registro dos pilares de arquitetura solicitados e das decisões pendentes.
- Inclusão de `.gitignore`, exemplo de ambiente sem valores e orientação de conexão com GitHub privado.
- Primeiro commit local confirmado: `4fb05c7`, com os onze arquivos solicitados.
- Revisados os arquivos, os valores vazios do exemplo de ambiente e as regras de exclusão; diff validado antes do commit.
- Atualizados os registros de encerramento. Execução do terminal viabilizada fora do sandbox, com autorização.

## 0.1.0 — 2026-09-09 — primeira base local
- Criado workspace pnpm com API mínima TypeScript para Workers em apps/api.
- Implementados GET /health, resposta 404 para endereço inexistente e 405 para método não permitido.
- Adicionados lint, typecheck e três testes no runtime Workers; verificações passaram.
- Confirmada resposta HTTP 200 no servidor local; servidor encerrado após o teste.
- Atualizados README e registros de estado/continuidade deste incremento aprovado.
- Sem interface visual, integrações pagas, infraestrutura, push ou deploy. Planejamento original preservado na raiz.

## 0.2.0 — 2026-09-09 — primeira tela local
- Adicionada interface Next.js/React com visão geral, explicações e próximas etapas.
- Consulta real da base com espera, sucesso, erro e nova tentativa, sem serviços externos.
- Quatro testes de navegador, três da API, lint, typecheck e build validados; visual conferido em computador e celular.
- Atualizados README, estado e handoff; sem push/deploy ou alteração do planejamento.

## 2026-09-09 — checagem automática preparada
- Adicionado workflow GitHub Actions para main, pull requests e execução manual: instalação fixada, lint, tipos, testes e build.
- Ações fixadas por SHA, acesso somente de leitura, limite de duração e nenhuma etapa de publicação.
- actionlint 1.7.12, sete testes e build passaram localmente; execução remota pendente de push autorizado.
- Versão funcional 0.2.0 preservada; sem alterações na tela, infraestrutura, planejamento ou instruções principais.

## 2026-09-09 — envio e primeira checagem no GitHub
- Enviados com autorização os commits 3f2a232, 15330ec e 4c4b215 para origin/main.
- Execução 34404329453 concluiu com sucesso no Ubuntu: instalação, verificações, testes e compilação.
- Continuidade atualizada; sem deploy, credenciais adicionadas ou alteração do planejamento.
