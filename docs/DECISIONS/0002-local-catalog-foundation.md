# 0002 — Base local de catálogo e isolamento por equipe

2026-09-09. Status: preparação local autorizada; aplicação remota pendente.

## Origem e limite

O planejamento Word, seção 15, define organizations, memberships, products, product_versions e assets entre as entidades do domínio e exige preservar referências às versões. Este incremento implementa somente esse subconjunto em SQL local. Não altera o Word, arquitetura ou roadmap, não cria equipes reais nem liga a interface ao banco.

UUIDs, nomes dos campos, SKU único por equipe, papéis admin/member, DNA como objeto JSON, vínculos compostos e escrita exclusiva de backend são escolhas técnicas deste incremento, não transcrições de requisitos detalhados aprovados. O contrato dos campos de Product DNA e os papéis completos ainda precisam ser definidos antes das telas de cadastro.

## Decisão

Cada registro pertence a uma equipe. Vínculo ativo em memberships concede leitura; retirada do vínculo corta o acesso na próxima consulta. Clientes não escrevem, nem promovem seu próprio papel. O papel da equipe não é automaticamente sincronizado com app_metadata.studio_role da autenticação; a integração e o bootstrap administrativo ficam para uma etapa posterior.

As cinco tabelas têm RLS e concessões explícitas. A função SECURITY DEFINER fica no schema private, com search_path vazio, sem parâmetro de identidade e execução limitada. Deve pertencer ao executor confiável da migration e private deve permanecer fora dos schemas expostos pela Data API. Não executar como papel de cliente.

Versões e metadados de arquivos são imutáveis por UPDATE/DELETE. Correções criam registros novos; política de retenção/expurgo exigirá desenho específico. Referências compostas impedem relacionar arquivos e produtos de equipes diferentes. Sem exclusão em cascata. Assets guarda localização e checksum; nenhum objeto R2 é criado e o SQL não impede sobrescrita física no armazenamento. Esse controle precisa existir na futura integração R2.

service_role é confiável e ignora RLS; seu futuro backend deverá validar a equipe antes de cada escrita. Não existe endpoint de escrita neste incremento. Não conceder essa chave ao navegador. O proprietário do banco pode alterar o schema, portanto a imutabilidade não é uma proteção contra o administrador do banco.

## Validação e aplicação futura

pnpm test:db usa PGlite 0.5.8 em memória, com identidades fictícias e auth.uid simulado. Valida SQL, permissões, RLS, integridade e imutabilidade, sem credenciais nem rede. Isso não homologa Supabase Auth, PostgREST, event triggers, políticas preexistentes, versão/configuração do PostgreSQL remoto ou desempenho de produção.

Antes de aplicar: aprovação específica, inspecionar schema/roles existentes, confirmar projeto destino e backup, testar em ambiente Supabase isolado, revisar grants e schemas expostos, executar a migration uma vez e repetir os cenários pela Data API com usuários de teste autorizados. Não executar reset/drop para contornar colisões. Esta etapa não autoriza nenhum desses passos remotos.

## Fontes oficiais consultadas

- https://supabase.com/docs/guides/database/postgres/row-level-security — RLS, privilégios explícitos e papel service_role.
- https://pglite.dev/docs/ — PostgreSQL embutido em memória para testes locais.
