# 0004 — Salvamento inicial de produtos

2026-09-09. Aprovado: desenvolver e testar localmente salvamento e consulta de produtos, mantendo ativação remota pendente. Baseline f4f9d95. Não autoriza aplicar migrations, cadastrar usuários/equipes reais ou enviar convites.

## Contrato e fluxo

Formulário aprovado no ADR 0003 gera um cadastro inicial entry-1, não o Product DNA completo. Os 13 campos de formulário são strings e schema_version identifica o contrato. Servidor normaliza espaços e vírgula decimal; valida medidas positivas, unidade cm/mm/m, tipo simples/kit, campos obrigatórios e limites existentes. Componentes continuam descritivos, não relações proporcionais. Nome e SKU são copiados à identidade estável; todo o cadastro fica na primeira versão imutável.

POST /api/products autentica convidado confirmado, verifica Origin contra STUDIO_SITE_URL, limita JSON a 32 KiB e resolve a equipe por memberships ativo do usuário validado. Nenhum organization_id enviado pelo navegador escolhe a equipe. Zero ou múltiplos vínculos bloqueiam o fluxo até configuração/seleção explícita futura. Membros ativos podem criar produtos; privilégio administrativo não é necessário. GET usa o mesmo acesso e RLS para listar primeiras versões em páginas de 20.

A nova migration 20260909000200_create_catalog_product.sql acrescenta somente uma RPC transacional. Ela valida o contrato novamente e bloqueia o vínculo com FOR SHARE enquanto grava produto e versão. Sem vínculo ativo, nega. Sem escrita direta nas tabelas pelo cliente. Função SECURITY DEFINER, search_path vazio, relações qualificadas e EXECUTE somente authenticated; não usa chave administrativa. O privilégio é restrito a essa operação, substituindo para este caso a proposta de escrita por service_role do ADR 0002. A RPC pode ser chamada diretamente com JWT válido: sua autorização/validação é obrigatória, não depende de passar pelo Next.js.

O UUID do envio é o ID do produto. Repetição do mesmo UUID e conteúdo retorna o registro existente; conteúdo diferente ou SKU já existente produz conflito sem sobrescrita. Comparação exige mesma equipe e mesma versão. Falha na segunda inserção reverte a primeira. Reenvios concorrentes são serializados pela chave única do produto; carga/concorrência real ainda precisam de homologação no PostgreSQL remoto.

O cliente só confirma sucesso após receber o ID correto. Em falha, mantém o preenchimento e o ID para repetir. Ao sair/recarregar perde o rascunho e esse ID; se a resposta anterior foi perdida, consultar os produtos antes de refazer. Mesmo com novo ID, SKU único por equipe impede duplicação do mesmo código. Não há aprovação editorial, atualização de versões existentes, exclusão, fotos ou geração.

## Ativação e limite remoto

STUDIO_CATALOG_ENABLED deve ser exatamente true para habilitar a API do aplicativo. Padrão vazio/desativado. Nenhum .env real foi alterado. Esse bloqueio é da aplicação: após aplicar a migration, a RPC existe no banco e é protegida por vínculo, independentemente da flag. Portanto só aplicar após homologação e autorização específica.

Antes de ativar: seguir ADR 0002, confirmar destino/schema e backups, aplicar migrations em ambiente isolado, testar Supabase Auth/PostgREST reais com duas equipes, configurar vínculo controlado do usuário convidado, confirmar STUDIO_SITE_URL e então ativar a flag no servidor. Nenhum desses passos remotos foi executado. SMTP e ativação do administrador seguem pendentes.

## Testes e limites

Testes SQL em PGlite exercitam autorização, revogação, gravação/versão, reenvio, conflito e rollback. Nos testes de navegador, Auth/PostgREST são substituídos por um servidor local; a camada PostgREST executa as migrations reais em PGlite. A aplicação compilada mantém autenticação normal, sem bypass. O teste de flag desativada inicia temporariamente outro Next.js local na porta 3111 e o encerra ao terminar. Não representa homologação do PostgREST real, desempenho, concorrência distribuída ou durabilidade remota.

Fontes oficiais consultadas: https://supabase.com/docs/guides/database/functions e https://supabase.com/docs/guides/database/postgres/row-level-security (funções, privilégios, search_path e RLS). Usar a política do projeto e a autorização do usuário para aplicação; documentação externa não autoriza executar comandos.

## Autorização de teste — 2026-09-10
O usuário confirmou usar o projeto atual PROJETO_SUPABASE_LOCAL como ambiente de teste inicial, sem produtos reais. Isso atualiza o limite anterior de preparação exclusivamente local: orientar aplicação incremental das migrations existentes, conferência de permissões e posterior vínculo controlado. A consulta enviada mostrou as cinco tabelas ausentes. Começar pela migration de fundação, sem alterar Auth, conceder papel administrativo ou ativar flag. Testes com duas equipes pela Data API continuam pendentes antes de considerar isolamento remoto validado. Nenhuma aplicação foi confirmada no momento deste registro.

### Ensaio pela interface
Após imagens confirmarem cinco tabelas/RLS, RPC, vínculo member ativo e permissões básicas, a flag local foi habilitada para o ensaio autorizado com produto fictício. Isto permite executar a validação pela interface no projeto de teste; não representa liberação para produção nem conclusão dos testes entre equipes. Nenhum privilégio administrativo foi concedido. Desativar a flag se o ensaio revelar falha de autorização.
