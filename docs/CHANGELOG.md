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
