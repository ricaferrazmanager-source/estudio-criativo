# Estúdio Criativo — instruções de continuidade

## 1. Protocolo automático de início de sessão

Ao iniciar qualquer nova sessão, conversa, tarefa ou retomada de trabalho dentro deste repositório, antes de alterar código, documentação, configuração ou arquivos do projeto:

1. Leia integralmente:
   - `AGENTS.md`
   - `docs/PROJECT_STATE.md`
   - `docs/HANDOFF.md`
2. Consulte também:
   - `docs/ARCHITECTURE.md`, quando a tarefa envolver arquitetura, integração, infraestrutura, modelo de dados, segurança, deploy ou escopo técnico;
   - o documento de planejamento aprovado, quando a tarefa depender de requisitos funcionais, escopo ou decisões previamente aprovadas.
3. Verifique automaticamente o estado do repositório:
   - `git status`
   - branch atual
   - commits recentes relevantes
   - existência de alterações locais não commitadas
4. Confirme internamente, antes de editar:
   - versão atual do projeto;
   - último commit validado registrado;
   - estado atual da implementação;
   - pendências abertas;
   - próximo passo registrado;
   - se a working tree está limpa ou contém alterações que precisam ser preservadas.
5. Preserve qualquer alteração existente. Nunca sobrescreva, descarte ou reverta trabalho local sem entender sua origem e sem autorização aplicável.
6. Não peça ao usuário para lembrar ou solicitar este protocolo. Ele deve ser executado automaticamente sempre que aplicável.
7. Não inicie alterações antes de concluir este protocolo.

---

## 2. Escopo e fonte de verdade

- Nome oficial do projeto: **Estúdio Criativo**.
- O documento de planejamento aprovado define o escopo funcional e arquitetural do projeto.
- Enquanto o planejamento aprovado não estiver disponível no contexto de execução, `docs/ARCHITECTURE.md` deve ser tratado como referência arquitetural inicial, sem substituir especificações aprovadas.
- `docs/PROJECT_STATE.md` é a fonte de verdade do estado atual do projeto.
- `docs/HANDOFF.md` é a fonte de verdade da continuidade entre sessões.
- O GitHub é a fonte de verdade do código-fonte e da documentação versionada.
- Não invente requisitos, contratos, modelos de dados, integrações ou decisões de implementação como se estivessem aprovados.
- Antes de alterar arquitetura ou decisões estruturais, consulte os ADRs existentes e crie ou atualize um ADR quando necessário.
- Mudanças funcionais devem respeitar o planejamento, as decisões registradas e o estado atual do projeto.

---

## 3. Política Git

### 3.1 Regras gerais

- Verifique `git status` antes de qualquer alteração relevante.
- Preserve o histórico e o trabalho existente.
- Prefira branches de feature para mudanças funcionais, estruturais ou de maior risco quando fizer sentido.
- Não misture alterações não relacionadas no mesmo commit.
- Mantenha commits pequenos, focados e descritivos.
- Revise o diff antes de preparar arquivos para commit.
- Revise os arquivos staged antes de cada commit.
- Evite `git add .` sem revisar exatamente o que será incluído.
- Nunca faça `push`, publicação, merge, deploy ou provisionamento externo sem autorização aplicável.
- Não configure remotes, branches remotas ou destinos de publicação por suposição.

### 3.2 Segurança

Nunca versionar:

- senhas;
- API keys;
- tokens;
- cookies;
- credenciais;
- certificados privados;
- secrets;
- dados de autenticação;
- arquivos `.env` reais;
- dumps contendo dados sensíveis;
- logs com credenciais.

Regras obrigatórias:

- `.env.example` deve conter apenas nomes de variáveis, valores vazios e comentários seguros.
- Valores reais devem permanecer em ambiente local ignorado ou no gerenciador de segredos do provedor.
- Mantenha `.gitignore` atualizado para impedir versionamento acidental de arquivos locais, temporários, builds e segredos.
- Se houver suspeita de exposição de segredo, interrompa o trabalho e registre o risco antes de continuar.

---

## 4. Política de desenvolvimento e validação

Antes de considerar uma tarefa concluída:

1. Execute os testes aplicáveis.
2. Execute validações de lint, typecheck, build ou verificações equivalentes quando existirem.
3. Confirme que não houve regressão conhecida.
4. Verifique `git status`.
5. Revise o diff final.
6. Não declare funcionalidade, teste, commit, integração ou deploy como concluído sem confirmação objetiva.
7. Se algum teste ou validação falhar:
   - não declare a tarefa concluída;
   - registre o problema;
   - descreva o impacto;
   - mantenha o estado do projeto coerente.

---

## 5. Protocolo automático de encerramento de sessão

Antes de considerar qualquer sessão ou tarefa encerrada, sempre que houver alteração em código, documentação, configuração ou estado do projeto:

1. Execute todos os testes e validações aplicáveis.
2. Verifique novamente:
   - `git status`
   - branch atual
   - alterações staged e unstaged
3. Atualize, conforme aplicável:
   - `docs/PROJECT_STATE.md`
   - `docs/CHANGELOG.md`
   - `docs/HANDOFF.md`
   - `docs/KNOWN_ISSUES.md`
   - `docs/LEARNINGS.md`
   - ADR relevante em `docs/DECISIONS/`
4. Registre no fechamento:
   - trabalho realizado;
   - o que foi efetivamente validado;
   - versão atual;
   - último commit validado;
   - pendências;
   - impedimentos;
   - próximo passo recomendado.
5. Crie um commit descritivo para as alterações concluídas quando houver trabalho versionável e a política da sessão permitir.
6. Não deixe alterações relevantes sem documentação de continuidade.
7. Não encerre com mudanças desconhecidas ou não explicadas na working tree.
8. Não declare a tarefa concluída se testes ou validações obrigatórias falharem.
9. Não peça ao usuário para lembrar ou solicitar este protocolo. Ele deve ser executado automaticamente.

---

## 6. Atualização dos arquivos de continuidade

### `docs/PROJECT_STATE.md`
Deve refletir somente o estado atual e válido do projeto, incluindo quando aplicável:

- versão atual;
- último commit validado;
- módulos implementados;
- módulos em desenvolvimento;
- pendências;
- ambiente atual;
- testes e validações;
- bloqueios.

Não usar como diário de conversa.

### `docs/CHANGELOG.md`
Registrar mudanças funcionais ou técnicas relevantes por versão ou marco.

### `docs/HANDOFF.md`
Deve ser curto, objetivo e suficiente para permitir que uma nova sessão continue sem consultar conversas anteriores.

Registrar:

- baseline atual;
- último commit validado;
- tarefa em andamento;
- decisões relevantes;
- pendências;
- próximos passos;
- arquivos que precisam ser lidos antes de continuar.

### `docs/KNOWN_ISSUES.md`
Registrar problemas conhecidos, limitações e riscos ainda não resolvidos.

### `docs/LEARNINGS.md`
Registrar apenas aprendizados reutilizáveis e validados que uma sessão futura não deveria precisar redescobrir.

Não registrar observações temporárias, hipóteses não validadas ou histórico irrelevante.

### ADRs
Criar ou atualizar ADR quando houver mudança arquitetural, decisão estrutural ou escolha tecnológica relevante cuja justificativa precise ser preservada.

---

## 7. Regra de continuidade entre máquinas e sessões

O projeto deve ser capaz de continuar corretamente em uma nova máquina ou nova sessão sem depender do histórico de chat.

Princípio obrigatório:

> Uma nova sessão deve conseguir entender o estado atual do Estúdio Criativo lendo o repositório e seu histórico versionado.

Para isso:

- código e documentação versionados devem permanecer no GitHub;
- estado atual deve permanecer em `docs/PROJECT_STATE.md`;
- continuidade imediata deve permanecer em `docs/HANDOFF.md`;
- regras permanentes devem permanecer em `AGENTS.md`;
- decisões arquiteturais devem permanecer nos ADRs;
- segredos nunca devem depender do repositório;
- arquivos locais não versionados não podem ser tratados como única fonte de verdade.

---

## 8. Regra de fechamento e comunicação

Ao finalizar uma tarefa, informe de forma objetiva:

- o que foi alterado;
- o que foi verificado;
- quais testes foram executados;
- qual é o estado do Git;
- qual é o commit final, quando houver;
- quais pendências permanecem;
- qual é o próximo passo recomendado.

Nunca afirme que algo foi commitado, testado, publicado, implantado ou homologado sem evidência objetiva.

---

## 9. Princípio operacional permanente

O fluxo padrão do Estúdio Criativo deve ser:

**Início**
1. Ler contexto persistente.
2. Verificar Git.
3. Confirmar estado atual.
4. Trabalhar.

**Encerramento**
1. Testar.
2. Validar.
3. Documentar.
4. Commitar quando aplicável.
5. Atualizar continuidade.
6. Informar estado final.

Esse protocolo é permanente e não depende de comando manual do usuário.
