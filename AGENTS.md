# Estúdio Criativo — instruções de continuidade

## Leitura obrigatória
Antes de qualquer alteração, leia integralmente `AGENTS.md`, `docs/PROJECT_STATE.md` e `docs/HANDOFF.md`. Consulte também `docs/ARCHITECTURE.md` e o planejamento aprovado quando a tarefa envolver arquitetura ou escopo.

## Escopo e fonte de verdade
- Nome oficial: Estúdio Criativo.
- Siga o documento de planejamento aprovado. Enquanto ele não estiver disponível, os pilares registrados em `docs/ARCHITECTURE.md` são referências iniciais, sem substituir suas especificações.
- A etapa inicial autoriza apenas preparação do repositório e documentação. Desenvolvimento funcional depende de nova solicitação e consulta ao planejamento aprovado.
- Não invente requisitos, contratos, modelos de dados ou decisões de implementação como se estivessem aprovados.
- Preserve alterações existentes e verifique o estado do Git antes de editar.

## Segurança e versionamento
- Nunca adicione chaves, senhas, tokens, credenciais ou outros segredos a arquivos versionados, exemplos, logs ou commits.
- Mantenha `.env.example` somente com valores vazios e comentários. Guarde valores reais em ambiente local ignorado ou no gerenciador de segredos do provedor.
- Revise o diff e os arquivos preparados antes de cada commit. Não use `git add .` sem revisar seu conteúdo.
- Use GitHub privado para continuidade quando conectado. Não configure destino remoto por suposição.
- Não faça push, publicação ou provisionamento sem autorização aplicável.

## Encerramento de sessão
Atualize `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md` e `docs/HANDOFF.md` conforme necessário, registrando trabalho realizado, verificações, pendências e próximo passo. Registre problemas em `docs/KNOWN_ISSUES.md` e aprendizados relevantes em `docs/LEARNINGS.md`.
Informe o que foi efetivamente verificado e quaisquer impedimentos. Não declare commits, testes ou implantações concluídos sem confirmação.
