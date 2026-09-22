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

## 2026-09-09 — preparação do acesso por convite
- Registradas as decisões aprovadas de acesso e o projeto Supabase informado pelo usuário.
- Preparado arquivo de ambiente local ignorado, com chave publicável ainda vazia; login não implementado.
- Sem alterações funcionais ou push.

## 2026-09-09 — conexão local ao Supabase validada
- Configuração fornecida pelo usuário copiada para apps/web/.env.local, ignorado pelo Git; original preservado.
- Consulta de configurações confirmou conexão, cadastro público desativado e login por e-mail ativo.
- Sem implementação de login, criação de usuários, exposição de chaves ou push.

## 0.3.0 — 2026-09-09 — acesso por convite (implementação local)
- Login, logout, proteção de páginas e consulta da base por sessão validada no servidor.
- Aceitação explícita de convite, definição de senha e formulário administrativo de convites.
- Cookies HttpOnly, verificação de app_metadata e recusa de usuário não convidado; sem concessão automática por e-mail.
- 19 testes passaram (3 Workers, 16 navegador), lint, tipos e compilação. Testes de autenticação com provedor simulado; nenhum e-mail real enviado.
- Criado ADR de autenticação com instruções para ativação remota; ambiente de exemplo atualizado sem valores.
- Administrador, SMTP e homologação real pendentes; sem push/deploy. Planejamento original preservado.

## 2026-09-09 — base local do catálogo (versão funcional 0.3.0 preservada)
- Preparadas cinco tabelas SQL: equipes, vínculos, produtos, versões e metadados de arquivos; nenhuma migration remota executada.
- Adicionadas regras de leitura por equipe, revogação por vínculo ativo, bloqueio de escrita do cliente e imutabilidade de versões/arquivos.
- Nove testes PostgreSQL em memória com PGlite 0.5.8 integrados ao pnpm check; lint, tipos, build e 28 testes passaram.
- Registradas escolhas e limites no ADR 0002 e continuidade; SMTP/e-mails adiados pelo usuário.
- Nenhuma alteração de interface, segredo novo, push, deploy ou provisionamento; Word e instruções principais preservados.

## 0.4.0 — 2026-09-09 — prévia do cadastro de produtos
- Adicionada opção Produtos com identificação, características, kits e regras para imagens.
- Validação de campos e medidas com vírgula/ponto, revisão acessível e retorno para correção.
- Aviso explícito de estado temporário; sem gravação, fotos, migrations ou alteração de autenticação.
- pnpm check passou: lint, tipos, build e 31 testes (9 banco, 3 Workers, 19 navegador). Capturas desktop/mobile inspecionadas.
- ADR 0003 registra escolhas e limites; commit local, sem push/deploy.

## 0.5.0 — 2026-09-09 — salvamento e consulta preparados localmente
- Adicionadas API autenticada, validação no servidor, gravação atômica do produto/primeira versão e consulta paginada por equipe.
- Nova migration de RPC com autorização por vínculo ativo, validação própria, repetição idempotente e bloqueio de SKU duplicado; nenhuma aplicação remota.
- Botão Salvar confirma somente resposta válida; falhas preservam o preenchimento. Flag desativada por padrão, .env real preservado.
- Verificados 39 testes: 13 SQL, 3 Workers e 23 navegador, além de lint, tipos e build. Testes de navegador usam SQL real em memória atrás de Auth/PostgREST simulados; flag vazia validada em processo separado.
- Registrado ADR 0004. E-mails continuam adiados, sem push, deploy ou provisionamento.

## 0.5.1 — 2026-09-09 — links padrão de acesso
- Corrigido recebimento de links padrão Supabase de convite e recuperação, além do convite personalizado existente.
- Remoção do fragmento, confirmação explícita e validação no servidor antes de cookies HttpOnly; destino fixo para definir senha.
- Quatro testes novos; check completo passou com 43 testes e build de testes. Provedor simulado; recuperação real ainda pendente.
- Continuidade corrigida com evidências do usuário sobre conta convidada/confirmada. Sem envio de e-mails, migrations, push ou deploy.

## 2026-09-10 — confirmação manual de acesso
- Usuário confirmou redefinição de senha, acesso, saída e novo login reais.
- Retomada da preparação de equipe/catálogo: consulta remota somente leitura ainda pendente; nenhum SQL, privilégio ou configuração remota alterado.
- Registro documental sem mudança funcional; verificação por diff. Alteração automática de next-env.d.ts pelo servidor identificada e preservada fora deste registro. Sem push.

## 2026-09-10 — preparação do teste remoto de catálogo
- Registrada autorização para usar o projeto Supabase atual como ambiente de teste inicial sem produtos reais.
- Primeira migration revisada e disponibilizada para execução manual no SQL Editor; SQL preservado.
- pnpm test:db: 13 testes aprovados; aplicação remota ainda aguardando resultado. Sem push/deploy.

## 2026-09-10 — evidências da criação do catálogo de teste
- Usuário apresentou sucesso após as duas migrations e cinco tabelas com RLS ativa.
- Conferência da RPC, permissões e vínculo segue pendente; flag desativada. Nenhum SQL remoto executado pelas ferramentas.
- Atualização documental revisada por diff, sem alteração de código ou novos testes funcionais; sem push.

## 2026-09-10 — habilitação local para ensaio do catálogo
- Registradas evidências do vínculo member ativo e das permissões básicas da RPC.
- Configurados flag e origem apenas no .env.local ignorado; credenciais preservadas. Ensaio autorizado no projeto de teste, sem produtos reais.
- Login HTTP 200 e catálogo anônimo HTTP 401 verificados. Salvamento autenticado e isolamento remoto entre equipes ainda pendentes. Sem mudança de código ou push.

## 2026-09-10 — persistência confirmada no ensaio manual
- Usuário apresentou o produto de teste na consulta antes e depois de recarregar: gravação e leitura persistente confirmadas por imagens.
- Isolamento remoto entre equipes permanece pendente; nenhuma conclusão de prontidão para produção.
- Atualização somente documental, revisada por diff; testes automatizados não repetidos, sem alteração de código ou push.

## 2026-09-10 — roteiro de isolamento SQL
- Preparado roteiro transacional com equipe/produtos temporários, identidade SQL simulada e rollback integral.
- Cinco verificações: leitura própria, bloqueio de produto/versão alheios, equipe alheia, RPC alheia e UPDATE direto.
- Teste local detecta vazamento proposital e confirma ausência de dados residuais. test:db inclui todos os arquivos de testes; 14 SQL e lint aprovados. Execução remota e teste JWT/HTTP com dois usuários continuam pendentes. Sem push.

## 2026-09-10 — correção de cópia local do roteiro
- Identificado e reproduzido erro 42883 causado por gen_randoam_uuid na cópia local; corrigido somente o nome, igualando o roteiro ao SQL versionado.
- 14 testes SQL aprovados após correção. Nova execução remota pendente; nenhuma migration ou dado remoto alterado pelas ferramentas. Sem push.

## 2026-09-10 — teste manual com duas contas
- Usuário apresentou cinco aprovações no roteiro SQL de isolamento e completou cadastro/consulta com duas contas em equipes distintas.
- Segunda conta viu lista vazia e depois apenas Produto teste B; primeira conta continuou vendo apenas Primeiro produto teste.
- Registrada separação básica observada pelas imagens e pelo relato, sem afirmar auditoria completa ou teste de HTTP adulterado.
- Continuidade atualizada; sem alteração funcional, exclusão de dados, repetição de testes automatizados ou push.
