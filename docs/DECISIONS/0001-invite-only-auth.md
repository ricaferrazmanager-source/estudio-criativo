# ADR 0001 — acesso por convite com Supabase Auth

Data: 2026-09-09. Implementação local; ativação remota pendente.

## Contexto e aprovação

O planejamento prevê Supabase Auth, JWT, papéis e RLS. O usuário aprovou login por e-mail/senha, acesso somente por convite, administrador inicial conta-de-teste@example.invalid e demais participantes como usuários. Este incremento implementa somente essa divisão; creative_manager, operator, reviewer e viewer do planejamento permanecem futuros. Não cria tabelas, migrations ou substitui o planejamento.

## Decisão

Next.js usa @supabase/ssr e @supabase/supabase-js no servidor. Sessões ficam em cookies HttpOnly/SameSite=Lax; Secure é padrão em produção e para origem HTTPS; a exceção explícita é HTTP em localhost/127.0.0.1 para testes locais. Proxy renova cookies; páginas, API /api/health e ações verificam o usuário junto ao Supabase com getUser. Não confiar no objeto de getSession nem em metadados fornecidos pelo navegador. Conteúdo autenticado usa cookies e resposta private/no-store.

A entrada exige invited_at e email_confirmed_at. A administração exige app_metadata.studio_role = admin, informação que somente uma operação privilegiada no servidor pode atribuir. E-mail e user_metadata não elevam permissões. Convites da interface não aceitam papéis do cliente: o convidado entra como usuário comum. A checagem é repetida na ação do servidor, além da proteção de /equipe. Next.js verifica a origem das Server Actions. Cada ação de convite corresponde a uma solicitação explícita do administrador.

A chave publicável permite login. SUPABASE_SECRET_KEY é opcional para preparar/testar a interface e obrigatória para envio real de convites pela aplicação; usada apenas no servidor após verificar o administrador. Sua ausência produz mensagem de configuração pendente. Nenhuma chave foi adicionada ao Git.

Convites usam token_hash no fragmento da URL; o navegador remove o fragmento e envia o token por POST somente após o clique em Aceitar convite. O servidor fixa type=invite e o destino /definir-senha. Não há destino arbitrário fornecido pelo usuário. O link não deve usar tokens em query strings, que podem aparecer nos logs. O usuário define uma senha de 12 a 128 caracteres. Links padrão de convite/recuperação também são aceitos: access_token/refresh_token no fragmento são removidos do endereço e enviados por POST após confirmação explícita. getUser(access_token) valida o usuário convidado e confirmado antes de setSession; a identidade resultante deve coincidir. Cookies HttpOnly, sem localStorage. type não é prova de identidade. Destino fixo /definir-senha. Solicitação pública automática de recuperação não está incluída; o administrador usa o painel.

## Configuração operacional pendente

1. Manter Allow new users to sign up desativado (já confirmado via API na preparação).
2. Em Authentication > URL Configuration, usar Site URL http://127.0.0.1:3000 para desenvolvimento e permitir o redirect http://127.0.0.1:3000/convite. Em publicação, substituir por origem HTTPS real.
3. O template padrão é suportado, sem exigir personalização. Se houver template personalizado, usar o link: `{{ .SiteURL }}/convite#token_hash={{ .TokenHash }}`. Confirmar a origem e os redirects antes do uso real; personalização pode exigir SMTP próprio no painel atual.
4. Configurar SMTP próprio para convidados fora da equipe técnica do Supabase. O serviço padrão limita destinatários à equipe do projeto. Não dar acesso à organização Supabase aos usuários do estúdio como alternativa.
5. O proprietário deve convidar conta-de-teste@example.invalid pelo painel Authentication > Users, aceitar o convite e definir a senha. Após conferir identidade, e-mail confirmado e UUID dessa conta, atribuir app_metadata.studio_role=admin por operação administrativa controlada, preservando os demais metadados. Não atribuir privilégios automaticamente a qualquer cadastro com esse e-mail. Esta operação ainda NÃO foi executada.
6. Para o administrador enviar convites na interface, definir SUPABASE_SECRET_KEY e STUDIO_SITE_URL em apps/web/.env.local (ou gerenciador de segredos no ambiente publicado). Nunca usar NEXT_PUBLIC para a chave secreta, nem enviá-la no chat.
7. Homologar com administrador e convidado reais: entrega de e-mail, aceite, senha, login, saída e rejeição de convite expirado. O usuário enviou convite pelo painel e apresentou conta confirmada; definição de senha e login real ainda não homologados. Nenhum e-mail foi enviado pelas ferramentas nesta correção.

## Verificação e limites

Playwright executa a aplicação compilada em porta 3100 e substitui apenas o serviço externo por apps/web/test/supabase-mock.mjs em 54329. Não há bypass de autenticação na aplicação. O ambiente de testes injeta valores fictícios e não usa o Supabase real nem envia mensagens. Testes verificam inclusive replay do formulário administrativo por um usuário comum e recusa de sessões revogadas/expiradas pelo provedor simulado. Isso não comprova entrega real de e-mails ou políticas de revogação do serviço remoto.

A API Workers direta continua expondo apenas o health check público sem dados de usuário. Quando houver endpoints funcionais, cada um deverá verificar JWT e autorização; os papéis deste incremento não substituem RLS nas tabelas futuras. Faltam ambientes remotos, banco de domínio, R2, filas e rate limiting próprio por usuário/endpoint do planejamento. Antes de publicação real, concluir homologação, revisão de proteção contra abuso e configuração de HTTPS. Sem deploy neste incremento.

## Fontes oficiais consultadas

- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/reference/javascript/auth-getuser
- https://supabase.com/docs/guides/auth/users
- https://supabase.com/docs/guides/auth/auth-smtp
- Convenções da versão instalada do Next.js em node_modules/next/dist/docs.

- https://supabase.com/docs/guides/auth/sessions/implicit-flow
- https://supabase.com/docs/reference/javascript/auth-setsession
