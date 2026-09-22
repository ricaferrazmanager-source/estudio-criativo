# Banco local — Estúdio Criativo

Preparação em supabase/migrations/20260909000100_catalog_foundation.sql. **Não aplicada ao Supabase.** Nenhuma tabela, equipe ou usuário real foi criado.

Contém equipes, vínculos, produtos, versões de Product DNA e metadados de arquivos. Não contém Brand DNA, Creative DNA, campanhas, geração, armazenamento ou filas.

Execute `pnpm test:db` na raiz para treze testes isolados em memória, sem .env, credenciais ou conexão remota. `pnpm check` também executa esses testes. Não usar este arquivo como autorização para aplicar migrations.

Decisões, limitações e condições da futura aplicação: docs/DECISIONS/0002-local-catalog-foundation.md.

A segunda migration, 20260909000200_create_catalog_product.sql, acrescenta salvamento atômico por RPC autenticada. Ambas permanecem não aplicadas remotamente. pnpm test:db executa agora 13 testes. Ativação e contrato: docs/DECISIONS/0004-product-persistence.md.
