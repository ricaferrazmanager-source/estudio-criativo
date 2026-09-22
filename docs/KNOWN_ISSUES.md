# Problemas e limitações conhecidos

## Autenticação: homologação remota pendente

A versão 0.5.1 recebe links padrão de convite/recuperação, validada com provedor simulado. O usuário apresentou conta convidada/confirmada e recebeu convite real, e em 2026-09-10 confirmou redefinição de senha, saída e novo login. Papel administrativo, SMTP para outras pessoas e envio pela interface seguem pendentes. Detalhes em docs/DECISIONS/0001-invite-only-auth.md.

## Escopo parcial do M0

Banco de domínio/RLS preparado somente em SQL local, testado em PGlite; aplicação manual relatada pelo usuário com tabelas/RLS e RPC confirmadas; isolamento remoto completo ainda não homologado. Integração da interface com o catálogo implementada localmente na 0.5.0 e habilitada localmente para ensaio com dados fictícios. Sem R2, filas ou ambientes remotos homologados. Imutabilidade de assets não impede sobrescrita no futuro R2; contrato detalhado de DNA, expurgo e integração de papéis pendentes (ADR 0002). SMTP/e-mails adiados pelo usuário até recuperar acesso ao provedor. Papéis administrativos detalhados, proteção própria contra abuso e solicitação pública automática de recuperação ainda não implementados. Não publicar esta etapa como aplicação pronta para produção.

## Ambiente de execução

Terminal do sandbox falha com helper_unknown_error: setup refresh had errors. Execução autorizada fora dele funciona; usar confiança Git por comando, sem configuração global. Navegador integrado indisponível na validação anterior; Playwright/Chromium disponível como alternativa.

## Registros preliminares

ARCHITECTURE.md e ROADMAP.md preservam o estado da preparação inicial e contêm afirmações superadas. O Word aprovado está na raiz, não versionado; não mover nem adicionar automaticamente. GitHub já está configurado e a primeira execução de CI passou. Para estado atual, usar PROJECT_STATE, HANDOFF e Git.

## Catálogo de teste — validação básica e limites

Dados não confirmados pelo banco se perdem ao sair da seção ou recarregar. Salvamento habilitado localmente para ensaio autorizado no projeto de teste; usuário confirmou gravação e consulta após recarregar por imagens. Kits têm somente descrição textual; não existe validação de proporções, fotos ou contrato completo de Product DNA. Tela permanece protegida pelo login existente: login e vínculo member ativo confirmados pelo usuário. Não foi criado bypass para demonstração; testes usam identidade simulada.

Catálogo exige exatamente um vínculo ativo na aplicação; seleção entre equipes fica pendente. Lista mostra primeira versão, sem edição/aprovação. A flag bloqueia a API do aplicativo, não a RPC depois de aplicada; autorização da RPC vem do JWT/vínculo. Fluxo básico de gravação/leitura foi validado manualmente pelo usuário; separação básica de listagens com duas contas foi observada no ensaio manual. Carga, concorrência distribuída e requisições HTTP adulteradas contra outras equipes continuam sem homologação. Ver ADR 0004.
