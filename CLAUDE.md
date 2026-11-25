# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar neste repositório.

Os requisitos do produto estão em [`PRD.md`](PRD.md) e o planejamento em [`docs/plans/PLANO-INICIAL.md`](docs/plans/PLANO-INICIAL.md). Para criar funcionalidades novas, use a skill [`desenvolver-funcionalidade`](.claude/skills/desenvolver-funcionalidade/SKILL.md).

## Visão geral

O app se chama **WillFlow** (nome exibido, `name`/`slug` do `app.json`, introdução e README). É um app mobile **offline-first** de rotina gamificada: tarefas por categoria valem pontos, há uma meta diária, sequência de dias e estatísticas. Não existe back-end, API nem conta de usuário — todos os dados ficam no aparelho.

O código vive em `ProMobile/`. A pasta, as chaves de armazenamento `@promobile/...` e o identificador `com.willian.promobile` mantêm o nome antigo **de propósito**: renomear as chaves apagaria os dados salvos dos usuários. Não há `package.json` na raiz; rode todos os comandos de dentro de `ProMobile/`.

## Stack tecnológica

| Camada | Tecnologias |
|---|---|
| Base | **Expo SDK 58**, **React Native 0.88**, **React 19**, **JavaScript** (sem TypeScript) |
| Navegação | **React Navigation 7** — `native-stack` (pilha, modal e `formSheet`) e `bottom-tabs` com barra customizada |
| Estado | **Context API + `useReducer`** (`TemaProvider` > `AvisoProvider` > `PreferenciasProvider` > `TarefasProvider`) |
| Persistência | **AsyncStorage** (dados em JSON) e **expo-file-system** (foto de perfil e `.txt` exportado) |
| Animação e gestos | **react-native-reanimated 4** + **react-native-worklets**, **react-native-gesture-handler 3**, **react-native-reorderable-list** |
| Gráficos | **react-native-svg** (anel de progresso, gráfico da semana, rosca de categorias, calendário de calor) |
| UI | **expo-linear-gradient**, **expo-blur** (vidro no iOS), **@expo/vector-icons** (Ionicons e MaterialCommunityIcons), fontes **Inter** e **Space Grotesk** (`@expo-google-fonts`) |
| Recursos nativos | **expo-notifications** (lembretes), **expo-image-picker** (foto de perfil), **expo-sharing** (exportação), **expo-haptics** (vibração), **@react-native-community/datetimepicker**, **expo-splash-screen**, **expo-status-bar**, **expo-system-ui**, **react-native-safe-area-context**, **react-native-screens** |
| Qualidade | **Jest 30** + **jest-expo**, **ESLint 9** (`eslint-config-expo` + `eslint-config-prettier`), **Prettier 3** |
| Build | **EAS Build** (`eas.json`: `development`, `preview` → APK, `production`) e **Expo Go** para desenvolvimento |

## Comandos

De dentro de `ProMobile/`:

```bash
npm install                # instala as dependências
npm start                  # expo start (servidor de desenvolvimento + QR code para o Expo Go)
npx expo start -c          # mesmo, limpando o cache do Metro
npm run android            # expo start --android
npm run ios                # expo start --ios
npm test                   # Jest (preset jest-expo)
npx jest src/utilitarios/__tests__/pontuacao.test.js   # um arquivo de teste
npm run lint               # ESLint
npm run format             # Prettier --write  (format:check só verifica)
npx expo-doctor            # saúde das dependências e da configuração
npm run build:apk          # EAS Build: APK de teste (perfil preview)
npm run build:prod         # EAS Build: perfil production
```

- Instale dependências com `npx expo install <pacote>` para casar as versões com o SDK 58 (para ferramentas de dev, `-- --save-dev` e confira se foram para `devDependencies`).
- **Nunca** rode `npm audit fix --force` — ele propõe voltar para o Expo 44.
- Depois de instalar uma biblioteca nativa ou com plugin Babel, reinicie o Metro com `npx expo start -c` (um cache velho já quebrou o Expo Go).
- Rode `npm run build:apk` a partir de um terminal aberto exatamente em `ProMobile` (P e M maiúsculos): o servidor do EAS é Linux e diferencia maiúsculas; `cd promobile` já fez um build falhar.

## Estrutura de pastas

```
ProMobile/
├── App.js                 # providers, GestureHandlerRootView, LimiteErro, splash
├── app.json / eas.json    # configuração do Expo e perfis de build
├── assets/                # ícones e splash
└── src/
    ├── componentes/       # blocos de UI reutilizáveis (Cartao, Chip, ItemTarefa, gráficos…)
    ├── contexto/          # providers de estado e o reducer das tarefas
    ├── dados/             # constantes e configuração (categorias, opções de tarefa, preferências)
    ├── estilos/           # cores (2 paletas), tema, tipografia, espaçamentos, movimento, sombras
    ├── hooks/             # useHoje, useLembretes, useCategorias, useComemoracaoMeta…
    ├── navegacao/         # NavegacaoRaiz (pilha) e AbasInferiores (abas)
    ├── servicos/          # efeitos colaterais: armazenamento, notificações, foto, exportação, vibração
    ├── telas/             # uma tela por arquivo
    └── utilitarios/       # lógica pura e testável (datas, pontuação, sequência, categorias…)
```

Testes ficam em pastas `__tests__/` ao lado do código. Lógica pura (cálculos, regras, formatação) vai em `src/utilitarios/` para ser testada sem renderizar.

## Convenções de código

- **Tudo em português:** identificadores, textos de UI e nomes de arquivo (`tarefas`, `telas`, `componentes`, `cores`; props de callback com prefixo `ao…`, ex.: `aoPressionar`). Mantenha o código novo em português.
- **Sem comentários no código, por escolha do usuário:** não adicione `//`, `/* */` nem `{/* */}`. Explique decisões no chat ou no README.
- **Prettier:** aspas simples, ponto e vírgula, `trailingComma: es5`, `arrowParens: avoid`, 80 colunas.
- **Componentes funcionais** com hooks. A única classe é `LimiteErro` (Error Boundaries exigem classe).
- **Callbacks estáveis** (`useCallback`) e itens de lista com `memo`.

## Arquitetura

- **Estado:** `TarefasContexto.js` guarda `{ tarefas, historico, ultimoDia, recorde }` via `useReducer(dadosReducer)` (`tarefasReducer.js`: ações `adicionar`, `alternar`, `excluir`, `excluirDaCategoria`, `editar`, `reinserir`, `reordenar`, além de `restaurar` e `virarDia`). `useTarefas()` expõe `tarefas` (todas), `tarefasDeHoje` (filtradas pela recorrência), `historico`, `hoje` (`useHoje`: `AAAA-MM-DD`, atualiza à meia-noite e ao voltar para o app), `carregando` e callbacks estáveis `aoAdicionar({…campos})/aoAlternar/aoExcluir/aoEditar/aoExcluirTarefasDaCategoria/aoReordenar/aoRedefinirTarefas`; `aoExcluir` mostra um aviso com "Desfazer" via `useAviso()`. `useEstatisticas()` = totais de hoje + `meta`, `porcentagem`, `metaBatida` (o progresso é pontos ÷ meta diária, não a soma das tarefas); `useSequencia()` = `{ atual, recorde }`. `PreferenciasContexto` (`usePreferencias()`: nome, corAvatar, foto, meta, categoriasFavoritas, categoriasPersonalizadas, lembretes, onboardingConcluido) persiste em `@promobile/preferencias`. Toda a lógica de datas, recorrência, virada do dia, sequência, gráficos e lembretes é pura em `src/utilitarios/` e testada. Ids vêm de `gerarId()`, gerados no provider, nunca no reducer.
- **Persistência:** `src/servicos/armazenamento.js` grava `{ versao: 2, tarefas, historico, ultimoDia, recorde }` em `@promobile/dados`. `carregarDados()`/`carregarPreferencias()` retornam `{ dados|preferencias, podeSalvar }`: se a própria leitura falhar, os providers mantêm os padrões em memória mas nunca salvam por cima dos dados guardados; conteúdo ilegível é copiado para `@promobile/dados-recuperacao` antes do fallback. Itens inválidos são descartados um a um. `recorde` guarda a melhor sequência além do limite de 400 dias do histórico. Tarefas são normalizadas por `normalizarTarefa()` (prioridade, horario `HH:MM`|null, `recorrencia { tipo: diaria|semanal|unica, dias }`, lembrete, criadaEm). Quando o formato salvo mudar, incremente `VERSAO_ATUAL` e adicione um passo em `migrarDados()` (v0 = array simples com títulos acentuados/ids numéricos; v1 = `{ versao, tarefas }`). Migrações reabrem tarefas antigas (`concluida: false`). A virada do dia (`virarDia`) registra o dia encerrado em `historico`, reabre as tarefas e remove as `unica` concluídas; dias pulados ficam sem registro.
- **Navegação:** React Navigation 7. `NavegacaoRaiz.js` é uma native-stack que mostra só `Onboarding` até `preferencias.onboardingConcluido`; depois, `Abas`, `Categoria`, `Lembretes`, `EditorTarefa` (modal; params `{ id }` para editar ou `{ categoria, titulo }` para criar) e `EditorCategoria` (`formSheet`; params `{ chave }` para editar). Mostra `Carregando` até tarefas, preferências, tema e fontes carregarem, renderiza `Confete` a partir de `useComemoracaoMeta` e roda `useLembretes`. Abas de `AbasInferiores.js`: `Inicio`, `Tarefas`, `Estatisticas`, `Perfil` (`NavegacaoInferior` customizada como `tabBar`). Telas de aba usam `Tela edges={['top']}`.
- **Introdução:** o nome é obrigatório (sem "Pular"); o botão fica desativado com nome vazio ou só com espaços.
- **Categorias:** `src/dados/categorias.js` exporta as 4 `CATEGORIAS` fixas, `LIMITE_MAXIMO_CATEGORIAS` (6, contando as fixas), `ICONES_CATEGORIA`, `PALETAS_CATEGORIA` e `buscarCategoria(chave, lista?)`. O usuário pode criar categorias personalizadas (`chave` = `pers-<id>`, `{ titulo ≤15, icone, paleta }`) guardadas em `preferencias.categoriasPersonalizadas`; as regras puras (limite, nomes repetidos ignorando acentos, normalização) ficam em `src/utilitarios/categorias.js`. As telas obtêm a lista completa com `useListaCategorias()` (só leitura, depende só das preferências, seguro em itens de lista memoizados) ou `useCategorias()` (adiciona `aoSalvarCategoria`/`aoExcluirCategoria`); excluir uma categoria personalizada exclui também suas tarefas (`excluirDaCategoria`), com confirmação via `useExclusaoCategoria`. As fixas não podem ser editadas. As cores vêm de `coresDaCategoria(tema, categoria)` (`src/estilos/tema.js`), que lê `tema.paletasCategoria[categoria.paleta]`; `tema.categorias[chave]` continua existindo para as fixas. `EditorCategoria` é um `formSheet` nativo (bottom sheet) com prévia ao vivo; a grade do Início mostra um cartão tracejado "Nova categoria" até o limite e um selo `x/6 categorias`, e o toque longo num cartão personalizado oferece Editar/Excluir. Tarefas guardam a `chave` sem acento; `titulo` é só para exibição. Todas as telas de categoria são o único `src/telas/TelaCategoria.js`.
- **Listas:** listas de tarefas passam por `ListaTarefas` (cabeçalho da tela em `ListHeaderComponent`; `reordenavel` usa `react-native-reorderable-list`, segurar para arrastar, ordem aplicada à lista completa via ids). `ItemTarefa` (memo): o checkbox alterna, o texto abre o editor, deslizar para a esquerda exclui (`ReanimatedSwipeable`); tarefas fora do dia (`foraDoDia`) mostram "Hoje não" com checkbox tracejado bloqueado. O desfazer após uma virada de dia usa `tarefaParaDesfazer`. Passe callbacks estáveis.
- **Tema:** `TemaProvider` (`src/contexto/TemaContexto.js`) resolve a preferência (`sistema`/`escuro`/`claro`, em `@promobile/tema`; padrão do sistema, escuro quando desconhecido) num tema de `montarTema()` (`src/estilos/tema.js`), que reúne `cores` (as duas paletas ficam em `src/estilos/cores.js`, incluindo `paletasCategoria` e `categorias` com `cor`/`corSuave`/`gradiente`), `tipografia`/`fontes`, `espaco`, `raio` e `areaToque` (44). Componentes nunca usam hex soltos.
- **Padrão de estilo:** cada arquivo termina com `const criarEstilos = tema => StyleSheet.create({...})` e o componente chama `const estilos = useEstilos(criarEstilos)`; use `useTema()` para valores necessários no JSX (cores de ícone, gradientes, `coresDaCategoria`). Com fontes customizadas, defina `fontFamily` por `tema.fontes`/`tema.tipografia` e nunca `fontWeight`. Números usam `tipografia.numeros` (tabulares).
- **Contraste é testado:** `src/estilos/__tests__/tema.test.js` verifica WCAG AA para todo par texto/fundo nos dois temas (inclusive as 8 paletas de categoria), então mudar uma cor pode quebrar o `npm test`. `textoTerciario` é só para ícones e textos grandes.
- **Blocos de construção:** `Tela`, `Cartao` (vidro no iOS; `vidro={false}` para linhas de lista), `IconeGradiente`, `AnelProgresso`, `BarraProgresso`, `NumeroAnimado`, `CabecalhoTela` (botão `acao` opcional), `EstadoVazio`, `Carregando`, `Chip`, `BotaoPrincipal`, `Avatar`, `CartaoCategoria`, `CartaoNovaCategoria`, `SeletorHorario` (seletor nativo de horário), `SeletorMeta`, gráficos `GraficoSemana`/`DistribuicaoCategorias`/`CalendarioCalor` (react-native-svg puro), `Aviso` (toast) e `Confete`.
- **Movimento e vibração:** animações usam Reanimated 4 com os presets de `src/estilos/movimento.js` (todos respeitam o "reduzir movimento" do sistema); escreva shared values com `.set()` (a regra de lint do React Compiler rejeita `.value =` em handlers). Vibrações passam por `src/servicos/vibracao.js`; `useComemoracaoMeta` vibra e dispara o confete quando os pontos de hoje atingem a meta. Para sombras no Android, passe um fundo para `brilho(cor, intensidade, fundoAndroid)`.
- **Casca do app:** `App.js` chama `SplashScreen.preventAutoHideAsync()`; `NavegacaoRaiz` esconde a splash nativa quando dados, preferências, tema e fontes carregam. `LimiteErro` envolve todos os providers e mostra uma tela de erro sem contexto, montada com `montarTema()`; "Tentar de novo" remonta a árvore. Ícones e splash ficam em `assets/` e são configurados no `app.json` (`com.willian.promobile`); o `eas.json` tem `development` (precisa de `expo-dev-client`, propositalmente não instalado para o `expo start` continuar mirando o Expo Go), `preview` (APK) e `production`.
- **Textos:** use `contar(n, singular, plural?)` de `src/utilitarios/textos.js` para contagens ("1 ponto" / "2 pontos"). Números grandes e rótulos das abas limitam a escala de fonte do sistema com `maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}` (`src/estilos/espacamentos.js`).
- **Notificações:** `src/servicos/notificacoes.js` faz `require` tardio de `expo-notifications` (importá-lo no Expo Go no Android gera um aviso de push), então o módulo só carrega quando os lembretes são ativados. `useLembretes` refaz a agenda (`montarAgenda`: gatilhos com data exata para os próximos 7 dias, no máximo 60) a cada mudança; a permissão só é pedida na tela de Lembretes.
- **Ícones:** renderize ícones vindos de dados (categorias, chips, `IconeGradiente`) com `Icone` (`src/componentes/Icone.js`): nome simples usa `Ionicons`; o prefixo `mci:` usa `MaterialCommunityIcons` do mesmo pacote `@expo/vector-icons` (ex.: Devocional é `mci:hands-pray`, já que o Ionicons não tem mãos em oração). Ícones fixos da UI podem usar `Ionicons` direto.
- **Foto de perfil e exportação:** `src/servicos/fotoPerfil.js` copia a imagem escolhida (`expo-image-picker`, recorte 1:1) para `Paths.document` e as preferências guardam só o nome do arquivo (`foto-perfil-<timestamp>.<ext>`, validado por `fotoValida`), porque o caminho de documentos do iOS muda entre atualizações; `Avatar` resolve o caminho com `uriDaFotoPerfil` e volta para a inicial se o arquivo sumir. A exportação de dados (`src/servicos/exportacao.js`) grava um `.txt` legível (`montarTextoExportacao` em `src/utilitarios/exportacao.js`, `text/plain;charset=utf-8`) e abre o menu de compartilhamento via `expo-sharing`.
- **Pegadinha do RN 0.88:** `StyleSheet.absoluteFillObject` não existe mais (espalhá-lo não gera erro, simplesmente não aplica nada); use `StyleSheet.absoluteFill` ou `position: 'absolute', inset: 0`.
- **Testes:** `jest.setup.js` faz o mock global do AsyncStorage.

## Antes de entregar uma mudança

1. `npm run lint` sem erros.
2. `npm run format:check` sem avisos.
3. `npm test` com todos os testes passando.
4. Para mudanças visuais, conferir no Expo Go (`npx expo start -c`) nos temas claro e escuro.
5. Para dependências novas, `npx expo-doctor` sem falhas.
