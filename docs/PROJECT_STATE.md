# Estado do projeto

2026-09-10 — Estúdio Criativo 0.5.1. M0 parcial; catálogo inicial desenvolvido localmente.

## Implementado
API Workers de saúde; interface Next.js; login/saída por convite e administração de convites. getUser valida identidade; invited_at/e-mail confirmado permitem acesso; administração depende de app_metadata.studio_role. E-mail e user_metadata não concedem privilégios.

Convites personalizados com token_hash e links padrão de convite/recuperação são recebidos no navegador. Fragmento removido; clique explícito envia credenciais por POST ao servidor, que verifica identidade no provedor antes de estabelecer cookies HttpOnly. Destino fixo /definir-senha; sem localStorage. Solicitação pública automática de recuperação continua fora do escopo; usar painel do Supabase.

Produtos: preenchimento, validação, revisão, salvamento e consulta paginada das primeiras versões. API resolve equipe ativa e chama RPC atômica. Reenvio idempotente; SKU duplicado não sobrescreve; clientes não escrevem diretamente nas tabelas. Contrato entry-1 ainda não é Product DNA completo. ADRs 0002–0004 detalham catálogo.

## Estado real / ativação
Supabase informado: PROJETO_SUPABASE_LOCAL. URL/chave publicável em apps/web/.env.local ignorado. Consulta anterior confirmou disable_signup=true e login por e-mail ativo.

Conforme evidências fornecidas pelo usuário, convite da conta inicial foi recebido e aceito; e-mail confirmado e último acesso registrados no painel. Em 2026-09-10, o usuário confirmou redefinição de senha, acesso, saída e novo login com a senha. Validação manual relatada pelo usuário; a senha não foi solicitada nem inspecionada. Não inferir senha conhecida a partir de encrypted_password preenchido. Vínculo confirmado por imagem: uma equipe Estúdio Criativo, role member, active=true. Papel administrativo continua pendente.

Evidências posteriores enviadas pelo usuário: cinco tabelas presentes com RLS ativa e mensagem de sucesso após execução da segunda migration. Consulta enviada confirmou RPC presente, conta pronta e posteriormente vínculo ativo. Permissões consultadas: authenticated executa RPC; anon não; authenticated sem INSERT direto em products. STUDIO_CATALOG_ENABLED=true e STUDIO_SITE_URL=http://127.0.0.1:3000 configurados no .env.local ignorado exclusivamente para ensaio com produto fictício. SMTP próprio para outras pessoas adiado até o usuário recuperar acesso ao provedor. Nenhum e-mail enviado por ferramentas nesta tarefa.

## Verificação
pnpm check passou: lint, TypeScript, build de testes, 13 SQL, 3 Workers e 27 navegador (43 testes). Novos casos cobrem recuperação com definição de senha e novo login, convite padrão, sessões expiradas/sem convite e erro do provedor. Fluxo personalizado anterior permanece aprovado nos testes. Auth simulado; SQL em PGlite. Não equivalem a homologação remota.
pnpm build final com ambiente local passou. Tela /login em 3000 respondeu HTTP 200.

## Git e ambiente
Último commit de código validado: cbcbd5a. Consultar git log -1 para o registro documental atual. Último publicado: fb2b834. Sem push/deploy. Word intacto na raiz não versionado; AGENTS, ARCHITECTURE, ROADMAP e migrations preservados. Não reaplicar f1d3d9f.
Node 24, pnpm 11.19.0. Desenvolvimento 3000/8787; testes 3100/54329 e 3111 temporária. Execução fora do sandbox com safe.directory por comando.

Usuário autorizou o projeto PROJETO_SUPABASE_LOCAL como teste inicial, sem produtos reais. Execução manual das duas migrations relatada com telas de sucesso; cinco tabelas/RLS confirmadas em imagem. Usuário apresentou o produto de teste "Primeiro produto teste", SKU 23584556698774, na consulta antes e depois de recarregar. Salvamento e leitura persistente confirmados por evidência manual do usuário; não houve inspeção direta do banco pelas ferramentas. Teste básico manual de separação entre duas contas/equipes concluído conforme evidências abaixo; revisão abrangente de permissões continua pendente. Flag habilitada somente no ambiente local para conduzir o ensaio autorizado. Sem R2, filas ou geração/edição de imagens.

Ao retomar o servidor de desenvolvimento, Next.js regenerou apps/web/next-env.d.ts apontando para .next/dev/types. Alteração automática identificada e preservada fora do commit documental.

Nesta preparação, pnpm test:db foi repetido: 13 testes passaram. Migrations preservadas; teste local não comprova aplicação nem isolamento remoto.

Validação desta configuração: /login HTTP 200 e /api/products anônimo HTTP 401. Sem alteração de código, novo segredo, migrations pelas ferramentas ou push. Gravação autenticada e consulta após recarregar confirmadas pelas imagens do usuário em 2026-09-10.

## Confirmação manual — duas contas/equipes
Em 2026-09-10, o usuário enviou cinco resultados true do roteiro SQL de isolamento após correção do erro de digitação. O roteiro simula identidade SQL e termina em rollback; não equivale a autenticação JWT/HTTP.
Depois confirmou senha/login da segunda conta conta-de-teste@example.invalid (UID 00000000-0000-4000-8000-000000000001), convidada e confirmada segundo consulta apresentada. Escolha substitui conta-de-teste@example.invalid, que não deve ser usado neste teste.
O usuário executou o vínculo member ativo em Equipe de teste B. Nessa conta, a listagem estava vazia enquanto a equipe inicial já tinha um produto; depois cadastrou Produto teste B, SKU TESTE-B-001, e a listagem mostrou apenas esse produto. Voltou à primeira conta e a listagem mostrou somente Primeiro produto teste, SKU 23584556698774.
Conclusão limitada: cadastro e separação básica das listagens nas duas direções observados no fluxo manual relatado, com imagens. Identidades das sessões não foram inspecionadas pelas ferramentas; imagens das listas não exibem o e-mail. Não é auditoria completa nem prova de resistência a requisições HTTP adulteradas.
Preservar os dois produtos e equipes de teste; não excluir dados ou elevar papéis por inferência. SMTP próprio continua adiado; acesso à segunda conta não comprova envio livre para qualquer destinatário.
Próximo passo: revisar pendências do M0 e propor a próxima etapa pequena, sem ampliar automaticamente para publicação, imagens ou administração. Nenhum push autorizado.
Fechamento somente documental: diff revisado; testes automatizados não repetidos porque código/configuração não mudaram. Referência anterior: 1a1bd6f; commit deste registro em git log -1.

## Publicacao das fontes — 21/09/2026
Snapshot do codigo local d027dba preparado sobre o historico publico fb2b834. Identificadores de contas/projeto foram substituidos por exemplos; os 15 commits locais e o arquivo gerado next-env.d.ts permanecem preservados na maquina de origem e no bundle local. As referencias historicas a ausencia de autorizacao/push descrevem a sessao anterior; o pedido atual autoriza versionar estas fontes, sem executar deploy ou SQL remoto.
Planejamento e dados pertencem ao Drive Polivenda_IA/01_Projetos/Estudio_Criativo. O Word original permanece intacto na origem e foi enviado ao Drive.
