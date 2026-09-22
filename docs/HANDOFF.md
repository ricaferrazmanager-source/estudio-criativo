# Passagem de contexto

2026-09-10 — Estúdio Criativo 0.5.1. Usuário não técnico; orientar um passo de cada vez.

Ler AGENTS, PROJECT_STATE, HANDOFF e ADRs 0001–0004. Código validado cbcbd5a; commit documental atual em git log -1. Publicado fb2b834. Sem push/deploy. Word na raiz não versionado: não mover/alterar/adicionar. Não reaplicar f1d3d9f.

Concluído: correção autorizada para links padrão Supabase de convite/recuperação. Fragmento capturado e removido, confirmação por clique, POST para validação getUser e setSession no servidor, cookies HttpOnly e destino fixo /definir-senha. Sem localStorage, novo segredo ou alteração remota. Convite personalizado anterior preservado.

Real, segundo evidências enviadas pelo usuário: conta inicial convidada e e-mail confirmado; em 2026-09-10 usuário confirmou redefinição da senha, acesso, saída e novo login. Validação relatada pelo usuário. Equipe Estúdio Criativo com vínculo member ativo confirmada por imagem; papel admin pendente. Não confundir encrypted_password não vazio com senha conhecida. Usuário executou as duas migrations e enviou telas de sucesso; consulta mostrou cinco tabelas com RLS ativa. RPC e permissões básicas confirmadas em consultas do usuário: membro executa, anônimo não executa, INSERT direto negado. Separação básica entre duas contas/equipes observada pela interface; limites da evidência detalhados abaixo. SMTP próprio para outras pessoas adiado; usuário recebeu convite em seu e-mail da equipe Supabase.

Verificado: pnpm check passou, lint/tipos/build de testes e 43 testes (13 SQL, 3 Workers, 27 navegador) com provedores simulados. Não representa homologação real.

Ensaio manual concluído pelo usuário: produto "Primeiro produto teste", SKU 23584556698774, aparece na lista antes e depois de recarregar. Não recriar TESTE-001: o usuário escolheu outro nome/código. Próximo passo: revisar pendências do M0 e propor um incremento delimitado; não repetir o teste básico já concluído. STUDIO_CATALOG_ENABLED=true e STUDIO_SITE_URL=http://127.0.0.1:3000 habilitados somente em apps/web/.env.local ignorado para o ensaio autorizado. Sem produtos reais até validação. Não repetir migrations, bootstrap do vínculo ou recuperação.

Depois: revisar demais permissões e completar cenários adversariais de API antes de homologação abrangente. Não atribuir papel admin nem publicar por inferência.

Compilação final pnpm build aprovada; /login local em 3000 respondeu HTTP 200.

Alteração local conhecida e preservada: apps/web/next-env.d.ts regenerado por next dev (.next/dev/types), fora do commit documental. Nenhum SQL remoto executado.

Validação da configuração: login HTTP 200, catálogo anônimo HTTP 401; gravação autenticada e leitura após recarregar confirmadas por imagens do usuário. Sem mudança de código.

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
