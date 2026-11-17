# POLIVENDA Visual — configuração Claude, candidata em 17/11/2026

**Status:** candidata a homologação. Esta branch é somente revisão documental; NÃO substitui as skills em produção, não instala habilidades em contas Claude e não executa geração de imagens ou vídeos.

## Escopo

- Skill `polivenda-fotos-produto` v2.1.0-candidate: Claude define prompts e QA; GPT/ChatGPT gera/edita fotos. Mudança crítica é HERO preserva-foto-primeiro; fundo `#F4F4F4` tem validação espacial em áreas livres; escala física informada prevalece sobre estética.
- Skill `polivenda-video-higgsfield` v1.1.0-candidate: Higgsfield executa vídeo apenas a partir de fotografia comercialmente aprovada; câmera move, produto não se transforma.
- As skills foram empacotadas em ZIPs separados contendo `<nome-da-skill>/SKILL.md` e referências, conforme o formato atual documentado pela Anthropic.
- Instruções de Projeto, primeiros testes e checklist acompanham o pacote completo.

## Pacotes — Drive POLIVENDA

- Fotos Claude v2.1: https://drive.google.com/file/d/1pq9I9aMYldxBVIwp8Ll8_LEXhGrNHaK2/view
- Higgsfield Claude v1.1: https://drive.google.com/file/d/192qvywEODEH489RkXlaxTwqpKx6wFyHq/view
- Kit completo + instruções do Projeto + exemplos e QA: https://drive.google.com/file/d/16cXiY2h3KeWFZ0rHpLaHQfvBN_R1lv0c/view

Arquivos enviados em 17/11/2026 para a pasta Estudio_Criativo do Drive Polivenda_IA. Confirmados por metadados remotos: 30.737 bytes, 12.886 bytes e 100.071 bytes, respectivamente. Não se afirma comparação criptográfica com os bytes remotos.

## Problemas reais que motivaram esta revisão

1. Hero de orquídea branca com cinza pesado, vinheta e produto redesenhado.
2. Hero com pétalas excessivamente perfeitas, folha/vidro/lascas com aparência de render.
3. Mini-orquídea amarela com degradê de fundo: teste local de amostragem periférica contra F4F4F4 resultou `REWORK_BG` (p95 distância 23); pacote inclui validador read-only.
4. Ambientação com escala equivocada; mini-orquídea de banheiro tem **15 cm de altura total**, incluindo vaso.
5. ZIPs candidatos anteriores continham SKILL.md diretamente na raiz, enquanto instruções atuais do Claude exigem pasta da skill dentro do ZIP.

## Limites, riscos e pendências

- **Não homologado no Claude nem por benchmark A/B visual.**
- `claude/POLIVENDA_PADRAO-VIGENTE.md` citado na skill antiga não foi localizado na base acessível; reconciliar antes de afirmar conformidade com ele.
- O código-fonte textual das skills ainda **não foi promovido** nesta branch; os pacotes-fonte verificáveis permanecem no Drive acima. Próximo passo versionar arquivos descompactados no repositório responsável após verificação da versão canônica e aprovação.
- Não houve merge, deploy, mudança de automação ou sincronização do Claude.
- Para instalação: importar os dois ZIPs separadamente em Personalizar → Habilidades e colar as instruções do Projeto contidas no pacote.

## Próximo passo

Instalar no Claude sem manter skills antigas conflitantes ativas. Executar T0 descoberta de skills, T1 Hero mini-orquídea, T2 banheiro em escala 15 cm e T3 vídeo com still aprovado. Registrar falhas; somente após aprovação do operador liberar atualização oficial.
