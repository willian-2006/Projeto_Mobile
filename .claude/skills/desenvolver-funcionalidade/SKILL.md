---
name: desenvolver-funcionalidade
description: Fluxo obrigatório para criar ou alterar funcionalidades no app mobile WillFlow (React Native + Expo). Use sempre que o pedido for implementar uma feature nova, mudar o comportamento de uma tela, adicionar campo, regra de negócio, tela, componente ou dependência no WillFlow. Conduz análise, levantamento de dúvidas, plano técnico alinhado ao CLAUDE.md, implementação nos padrões do app e verificação com testes, lint e Expo.
---

# Desenvolver funcionalidade no WillFlow

Siga as cinco etapas **na ordem**. Não pule para o código antes de terminar as etapas 1 a 3.

Leia antes de começar:
- [`CLAUDE.md`](../../../CLAUDE.md) — stack, arquitetura e convenções obrigatórias.
- [`PRD.md`](../../../PRD.md) — requisitos (RF/RNF), regras de negócio (RN) e critérios de aceitação (CA).

---

## Etapa 1 — Analisar a solicitação e o contexto

1. Reescreva o pedido em uma frase: **o que muda para o usuário** e em qual tela.
2. Relacione com o `PRD.md`: qual RF, RN ou CA é criado ou alterado? Se a mudança contradiz uma regra existente (ex.: limite de 6 categorias, nome obrigatório), registre isso.
3. Mapeie o código afetado com busca, não com suposição:
   - telas em `ProMobile/src/telas/`, componentes em `src/componentes/`;
   - estado em `src/contexto/` (reducer, providers) e hooks em `src/hooks/`;
   - regras puras em `src/utilitarios/` e constantes em `src/dados/`;
   - persistência em `src/servicos/armazenamento.js`.
4. Verifique **todos os consumidores** do que vai mudar (ex.: buscar por `CATEGORIAS`, `buscarCategoria`, `usePreferencias`). Uma mudança em dados costuma afetar Início, Tarefas, Estatísticas, editor de tarefa, lembretes e exportação ao mesmo tempo.
5. Verifique se a mudança **altera o formato salvo** (AsyncStorage). Se sim, ela exige migração.

## Etapa 2 — Identificar dúvidas e ambiguidades

Antes de codar, liste o que não está claro e **pergunte ao usuário** o que só ele pode decidir. Pontos que costumam ser ambíguos neste app:

- Comportamento ao excluir algo com dados vinculados (apagar junto, mover ou bloquear?).
- Se a regra vale para as 4 categorias fixas ou só para as personalizadas.
- Limites e valores (tamanho máximo de texto, quantidade máxima, valores padrão).
- O que acontece com dados já salvos de usuários antigos.
- Comportamento nos temas claro e escuro e com fonte do sistema aumentada.

Se o pedido conflita com uma regra do `CLAUDE.md` (ex.: pedir TypeScript, comentários no código ou cores soltas em hex), aponte o conflito e siga o padrão do projeto, a menos que o usuário confirme a exceção.

Decisões com padrão óbvio no projeto não precisam de pergunta: escolha o padrão e informe.

## Etapa 3 — Planejar a solução técnica

Escreva um plano curto, alinhado ao `CLAUDE.md`, com:

1. **Arquivos** a criar e a alterar, com o motivo de cada um.
2. **Lógica pura** que vai para `src/utilitarios/` (com os testes correspondentes em `__tests__/`).
3. **Estado:** novas ações no reducer ou novos campos em preferências; ids sempre via `gerarId()` no provider, nunca no reducer.
4. **Persistência:** se o formato salvo muda, incremente `VERSAO_ATUAL` e adicione um passo em `migrarDados()`; para preferências, trate o campo novo em `normalizarPreferencias()` com valor padrão em `PREFERENCIAS_PADRAO`.
5. **Navegação:** rota nova em `NavegacaoRaiz.js` (pilha, `modal` ou `formSheet`) ou aba em `AbasInferiores.js`.
6. **Dependências:** só se indispensável, instaladas com `npx expo install` e compatíveis com o Expo Go.
7. **Riscos:** desempenho de listas, contraste de cores, permissões, dados antigos.

Para mudanças grandes, salve o plano em `docs/plans/` e confirme com o usuário antes de implementar.

## Etapa 4 — Implementar nos padrões do WillFlow

Regras obrigatórias (detalhes no `CLAUDE.md`):

- **Português** em identificadores, textos de UI e nomes de arquivo; callbacks com prefixo `ao…`.
- **Nenhum comentário** no código (`//`, `/* */`, `{/* */}`).
- **JavaScript**, componentes funcionais com hooks; `memo` em itens de lista e `useCallback` para callbacks repassados.
- **Estilo:** `const criarEstilos = tema => StyleSheet.create({...})` no fim do arquivo e `useEstilos(criarEstilos)` no componente. Cores, espaçamentos, raios e fontes só via `tema` — nunca hex soltos. `fontFamily` em vez de `fontWeight`. Números com `tipografia.numeros`.
- **Cores de categoria** por `coresDaCategoria(tema, categoria)`; lista de categorias por `useListaCategorias()` (leitura) ou `useCategorias()` (criar/editar/excluir).
- **Componentes existentes primeiro:** `Tela`, `Cartao`, `CabecalhoTela`, `BotaoPrincipal`, `Chip`, `EstadoVazio`, `IconeGradiente`, `Avatar`, `Aviso` (via `useAviso`).
- **Ícones de dados** pelo componente `Icone` (prefixo `mci:` para MaterialCommunityIcons).
- **Textos de contagem** com `contar(n, singular, plural?)`.
- **Animações** com Reanimated 4 e os presets de `src/estilos/movimento.js`; shared values com `.set()`.
- **Acessibilidade:** `accessibilityRole`, `accessibilityLabel`, área de toque mínima `tema.areaToque` (44).
- **Vibrações** via `src/servicos/vibracao.js`; **permissões** pedidas só no momento do uso, com explicação.
- **RN 0.88:** não use `StyleSheet.absoluteFillObject` (não existe mais); use `StyleSheet.absoluteFill` ou `position: 'absolute', inset: 0`.
- Prefira mudanças pequenas e focadas; não refatore o que não faz parte do pedido.

## Etapa 5 — Verificar

Rode, de dentro de `ProMobile/`, e só considere pronto com tudo verde:

```bash
npm run lint           # zero erros e avisos
npm run format:check   # formatação do Prettier
npm test               # todos os testes do Jest passando
npx expo-doctor        # obrigatório se alguma dependência mudou
```

Depois:

1. **Testes novos:** toda regra de negócio nova em `src/utilitarios/` precisa de testes em `__tests__/`. Se mexeu em cores, o teste de contraste (`tema.test.js`) precisa continuar passando.
2. **Build:** confirme que o bundle compila — `npx expo export --platform android --output-dir <pasta temporária>`.
3. **Expo Go:** suba com `npx expo start -c` e confira o fluxo no celular, nos temas claro e escuro, incluindo o caso de dados vazios e o de dados já existentes.
4. **Critérios de aceitação:** confira um a um os CA do `PRD.md` afetados.
5. **Documentação:** atualize o `CLAUDE.md` (e o `PRD.md`, se uma regra de negócio mudou) para refletir o novo comportamento.

Ao final, informe ao usuário: o que mudou, quais arquivos foram alterados, o resultado de lint/testes/build e o que **não** foi verificado (por exemplo, se o fluxo não foi testado num aparelho real).
