# Arquitetura — Estúdio Criativo

## Autoridade e limites
Este registro reproduz os pilares informados na instrução inicial. O documento de planejamento aprovado ainda não está disponível no projeto. Nenhuma definição abaixo substitui esse documento; detalhes de implementação deverão ser conciliados com ele antes do desenvolvimento funcional.

## Pilares do escopo
| Pilar | Direção inicial a detalhar no planejamento |
| --- | --- |
| Product DNA | Contexto e características do produto para orientar a criação. |
| Brand DNA | Identidade e diretrizes da marca. |
| Creative DNA | Direção criativa para a produção visual. |
| Prompt Compiler | Composição das instruções enviadas às APIs a partir dos contextos definidos. |
| Model Router | Seleção e integração de modelos e provedores. |
| Imagens por API | Geração e edição de imagens. |
| Extensibilidade | Arquitetura aberta à inclusão de modelos e provedores. |

## Direcionamento tecnológico solicitado
- Supabase/PostgreSQL para a camada de dados; esquema, permissões e demais recursos a definir pelo planejamento.
- Cloudflare R2 para armazenamento de objetos; organização, acesso e retenção a definir.
- Cloudflare Workers/Queues para execução e filas; contratos, fluxo de trabalhos e tratamento de falhas a definir.
- GitHub privado para versionamento e continuidade entre sessões.

## Decisões ainda não tomadas
Framework, linguagem, interface, autenticação, contratos dos DNAs, compilação de prompts, critérios de roteamento, provedores iniciais, esquema de dados, isolamento de usuários, custos, limites, observabilidade e estratégia de implantação.

Não foram criados serviços, contas, buckets, filas, tabelas, migrations ou integrações. Não há compromisso com APIs específicas de provedores nesta etapa.
