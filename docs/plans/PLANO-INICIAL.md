# Plano inicial de desenvolvimento — WillFlow

> Base: requisitos do [`PRD.md`](../../PRD.md) · Convenções: [`CLAUDE.md`](../../CLAUDE.md)
> Stack: Expo SDK 58 · React Native 0.88 · React 19 · JavaScript · AsyncStorage

Este documento organiza o desenvolvimento do WillFlow em fases lógicas e incrementais. Cada fase entrega algo utilizável, tem os requisitos que atende e um critério de saída verificável. A coluna **Status** registra o andamento real do repositório.

---

## Visão geral das fases

| Fase | Tema | Requisitos | Status |
|---|---|---|---|
| 0 | Configuração do ambiente Expo | RNF01 | ✅ Concluída |
| 1 | Fundação e ferramentas de qualidade | RNF07 | ✅ Concluída |
| 2 | Arquitetura: estado, persistência e navegação | RNF02, RNF03 | ✅ Concluída |
| 3 | Design system, temas e microinterações | RNF04, RNF05 | ✅ Concluída |
| 4 | Telas principais e gestão de tarefas | RF02, RF09 | ✅ Concluída |
| 5 | Meta diária, pontuação e estatísticas | RF04, RF05 | ✅ Concluída |
| 6 | Perfil, introdução, lembretes e exportação | RF01, RF06, RF07, RF08, RF10 | ✅ Concluída |
| 7 | Categorias personalizadas com limite | RF03 | ✅ Concluída |
| 8 | Testes, validação e entrega | RNF01–RNF07 | ✅ Concluída |

---

## Fase 0 — Configuração do ambiente Expo

**Objetivo:** ter o projeto rodando no celular pelo Expo Go.

- Criar o projeto Expo em `ProMobile/` com JavaScript.
- Configurar o `app.json`: nome **WillFlow**, `slug`, orientação retrato, `userInterfaceStyle: automatic`, identificador `com.willian.promobile`.
- Definir os scripts do `package.json`: `start`, `android`, `ios`.
- Instalar dependências sempre com `npx expo install` para manter a compatibilidade com o SDK.

**Critério de saída:** `npm start` gera o QR code e o app abre no Expo Go.

---

## Fase 1 — Fundação e ferramentas de qualidade

**Objetivo:** padronizar o código desde o início.

- **ESLint 9** com `eslint-config-expo` + `eslint-config-prettier` (`eslint.config.js`).
- **Prettier 3** (`.prettierrc`: aspas simples, `trailingComma: es5`, 80 colunas).
- **Jest 30** com preset `jest-expo` e mock global do AsyncStorage (`jest.setup.js`).
- Scripts `lint`, `format`, `format:check` e `test`.
- Convenções: código em português, sem comentários, lógica pura em `src/utilitarios/`.

**Critério de saída:** `npm run lint`, `npm run format:check` e `npm test` rodando sem erros.

---

## Fase 2 — Arquitetura: estado, persistência e navegação

**Objetivo:** a espinha dorsal do app, antes das telas finais.

**Estrutura de pastas**
`componentes/`, `contexto/`, `dados/`, `estilos/`, `hooks/`, `navegacao/`, `servicos/`, `telas/`, `utilitarios/`.

**Estado global (Context API + `useReducer`)**
- `TarefasContexto` com `dadosReducer` (adicionar, alternar, editar, excluir, reinserir, reordenar, restaurar, virar dia).
- `PreferenciasContexto` (nome, meta, categorias favoritas, lembretes, introdução concluída).
- Ids gerados por `gerarId()` no provider.

**Persistência (AsyncStorage)**
- Chaves `@promobile/dados`, `@promobile/preferencias` e `@promobile/tema`.
- Formato versionado (`versao: 2`) com `migrarDados()` para versões antigas.
- Proteções: descarte de itens inválidos, cópia de recuperação de dados ilegíveis e nunca salvar por cima quando a leitura falha.

**Navegação (React Navigation 7)**
- `NavegacaoRaiz`: native-stack com introdução condicional, telas de categoria, lembretes e editores.
- `AbasInferiores`: Início, Tarefas, Estatísticas e Perfil, com barra inferior customizada.

**Critério de saída:** dados sobrevivem ao fechar e reabrir o app; navegação entre abas funcionando; testes do reducer e do armazenamento passando.

---

## Fase 3 — Design system, temas e microinterações

**Objetivo:** identidade visual consistente e acessível.

- Paletas **escura e clara** em `estilos/cores.js` e `montarTema()` em `estilos/tema.js`; preferência Sistema/Escuro/Claro.
- Padrão `criarEstilos(tema)` + `useEstilos`; nenhuma cor solta em hex nos componentes.
- Tipografia **Space Grotesk** (títulos e números) e **Inter** (textos).
- Componentes base: `Tela`, `Cartao` (efeito vidro), `IconeGradiente`, `BotaoPrincipal`, `Chip`, `CabecalhoTela`, `EstadoVazio`, `Carregando`, `Aviso`.
- Animações com **Reanimated 4** respeitando "reduzir movimento"; vibrações com **expo-haptics**.
- **Teste automatizado de contraste WCAG AA** para todos os pares de cor, nos dois temas.

**Critério de saída:** todas as telas usam o tema; teste de contraste passando.

---

## Fase 4 — Telas principais e gestão de tarefas

**Objetivo:** o usuário consegue gerenciar a rotina completa.

- **Início:** saudação, progresso do dia, grade de categorias, tarefas de hoje.
- **Categoria:** tarefas da categoria e adição rápida.
- **Tarefas:** lista completa, filtros por categoria, **reordenar segurando** e **excluir deslizando** com "Desfazer".
- **Editor de tarefa (modal):** título (até 80 caracteres), categoria, pontos (5/10/20/30), prioridade, horário, lembrete e recorrência (diária, semanal ou única).
- **Virada do dia:** registro no histórico, reabertura das tarefas e remoção das únicas concluídas (`viradaDoDia.js`, `useHoje`).

**Critério de saída:** CA02 do PRD atendido; testes de tarefas, datas e virada do dia passando.

---

## Fase 5 — Meta diária, pontuação e estatísticas

**Objetivo:** transformar a rotina em progresso visível.

- **Pontuação** (`pontuacao.js`): progresso = pontos concluídos ÷ meta diária.
- **Meta configurável** de 10 a 500 pontos, com sugestão de ~70% dos pontos do dia.
- **Comemoração** com confete e vibração ao bater a meta (`useComemoracaoMeta`).
- **Sequência e recorde** (`sequencia.js`), com o recorde preservado além dos 400 dias de histórico.
- **Tela de Estatísticas** com gráficos em **react-native-svg**: semana com linha da meta, rosca de pontos por categoria (7 dias), calendário de calor do mês e progresso de hoje por categoria.

**Critério de saída:** CA04 e CA05 do PRD atendidos; testes de pontuação, sequência e estatísticas passando.

---

## Fase 6 — Perfil, introdução, lembretes e exportação

**Objetivo:** personalização, engajamento e posse dos dados.

- **Introdução** em 3 passos com **nome obrigatório**, categorias favoritas e meta.
- **Perfil:** nome, **foto de perfil** (`expo-image-picker`, recorte 1:1, arquivo salvo na pasta do app), cor do avatar, meta, tema.
- **Lembretes** (`expo-notifications`): avisos no horário das tarefas e resumo diário; agenda dos próximos 7 dias, até 60 notificações; permissão pedida só na tela de Lembretes.
- **Exportação `.txt`** (`expo-file-system` + `expo-sharing`) com perfil, tarefas e histórico.
- **Limpar dados** com confirmação.

**Critério de saída:** CA01, CA06 e CA07 do PRD atendidos; testes de preferências, agenda e exportação passando.

---

## Fase 7 — Categorias personalizadas com limite

**Objetivo:** permitir que o usuário adapte o app à própria rotina.

- Limite total de **6 categorias** (`LIMITE_MAXIMO_CATEGORIAS`): 4 fixas + até 2 personalizadas.
- Cartão tracejado **"+ Nova categoria"** e selo **`x/6 categorias`** no Início.
- **Editor em bottom sheet** (`formSheet` nativo) com prévia ao vivo, nome até 15 caracteres, 16 ícones e 8 paletas de cor testadas para contraste.
- Toque longo para **editar ou excluir**; a exclusão apaga as tarefas vinculadas após confirmação.
- Integração com editor de tarefas, filtros, estatísticas, lembretes e exportação.

**Critério de saída:** CA03 do PRD atendido; testes de categorias e de contraste das paletas passando.

---

## Fase 8 — Testes, validação e entrega

**Objetivo:** garantir qualidade e distribuir o app.

- Suíte **Jest** cobrindo a lógica de negócio (pontuação, sequência, datas, tarefas, virada do dia, categorias, preferências, agenda de lembretes, exportação, armazenamento, reducer e contraste).
- `npm run lint`, `npm run format:check` e `npx expo-doctor` sem falhas.
- Build do bundle para Android e iOS (`npx expo export`).
- Ícones, splash, tela de erro (`LimiteErro`) e README.
- **APK de teste** gerado com **EAS Build** (`npm run build:apk`, perfil `preview`) e QR code para instalação.

**Critério de saída:** todos os critérios de aceitação do PRD conferidos e APK instalável no Android.

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Perda de dados em atualizações | Formato versionado com migração e cópia de recuperação |
| Incompatibilidade de dependências com o SDK | `npx expo install` e `npx expo-doctor` |
| Cache do Metro desatualizado após instalar bibliotecas nativas | `npx expo start -c` |
| Cores ilegíveis num dos temas | Teste automatizado de contraste WCAG AA |
| Listas lentas com muitas tarefas | `memo`, callbacks estáveis e hook de categorias só de leitura |
| Build EAS falhando por nome de pasta | Rodar o build a partir de `ProMobile` com a grafia exata |

## Próximos passos possíveis (fora do escopo atual)

- Back-end opcional para sincronização entre aparelhos.
- Edição das categorias padrão.
- Publicação na Google Play e na App Store (perfil `production` do EAS).
