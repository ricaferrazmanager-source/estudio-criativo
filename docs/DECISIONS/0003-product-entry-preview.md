# 0003 — Prévia local do cadastro de produtos

2026-09-09. Aprovado: formulário de identificação, características e regras para imagens, com revisão e retorno para correção; sem salvamento no Supabase e sem fotos.

Origem: planejamento Word, RF-001 e seção 7.1. A tela é um recorte preparatório de Product Library (M1); não significa conclusão de M0 ou contrato completo de Product DNA. O usuário aprovou esse recorte em conversa após apresentação da proposta.

Implementação: seção Produtos no estúdio já protegido por requireMember. Componente cliente independente, sem nova rota, endpoint, SDK, armazenamento local ou alteração de autenticação. Estado dura somente enquanto a seção está montada. O aviso explica a perda ao navegar/recarregar. Revisão nunca afirma salvamento ou aprovação de uma versão.

Escolhas de interface deste incremento: nome, SKU, categoria, altura, largura, profundidade, materiais e cores obrigatórios; unidade cm/mm/m, medidas positivas aceitando ponto ou vírgula; textos curtos até 160 caracteres, medidas até 20 e textos longos até 2000. Produto simples ou kit; kit exige descrição das peças e quantidades em texto. Regras do que preservar e variar opcionais. Estas são decisões de preenchimento local, não contratos definitivos de banco/IA.

Ficam de fora: validação de SKU único, gravação, upload, aprovação/versionamento, proporções estruturadas dos componentes, conversão de unidades, fidelidade e integração dos papéis por equipe. Antes de persistir, definir o contrato completo e repetir validações no servidor com autorização por equipe. Não aplicar migrations com base nesta decisão.

Validação: teste de navegador escrito antes da tela falhou pela ausência de Produtos. Cenários exercitam revisão/correção, ausência de envio e persistência, campos obrigatórios, medidas inválidas, kit e celular, com Auth simulado. Nenhum usuário, e-mail ou produto real criado.
