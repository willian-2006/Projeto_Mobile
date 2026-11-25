# PRD — WillFlow

> Documento de Requisitos do Produto (Product Requirements Document)
> Versão do app: 1.0.0 · Plataforma: Android e iOS (React Native + Expo SDK 58)

---

## 1. Visão geral

### 1.1 Nome do sistema

**WillFlow** — identificador técnico `com.willian.promobile` (o código vive na pasta `ProMobile/`).

### 1.2 Objetivo

Ajudar o usuário a **construir constância na rotina diária** transformando tarefas do dia a dia em **pontos**, com uma **meta diária** configurável, **sequência de dias** (streak) e **estatísticas visuais** que mostram a evolução ao longo do tempo.

### 1.3 Descrição

O WillFlow é um aplicativo mobile de produtividade gamificada. O usuário organiza suas tarefas em **categorias** (Saúde, Estudos, Trabalho, Devocional e até duas categorias personalizadas), define quantos pontos cada tarefa vale e acompanha o progresso do dia em direção à meta. Ao bater a meta, o app comemora com confete e vibração; dias seguidos com a meta batida formam a **sequência**, e o maior resultado vira o **recorde pessoal**.

O app é **offline-first**: não possui servidor nem conta de usuário. Todos os dados (tarefas, histórico, preferências e foto de perfil) ficam armazenados localmente no aparelho, e o usuário pode **exportá-los em um arquivo `.txt`** legível.

### 1.4 Público-alvo

- Estudantes e profissionais que querem organizar uma rotina equilibrada entre corpo, estudos, trabalho e vida espiritual.
- Pessoas que se motivam com **gamificação** (pontos, metas, sequências) para criar hábitos.
- Usuários que preferem um app **simples, sem cadastro e sem internet**, com foco em privacidade.

### 1.5 Problema que resolve

| Problema do dia a dia | Como o WillFlow resolve |
|---|---|
| Listas de tarefas comuns não mostram se o dia "foi bom" | Pontos por tarefa e uma meta diária com barra/anel de progresso |
| Falta de motivação para manter hábitos | Sequência de dias, recorde pessoal, confete ao bater a meta |
| Rotina desequilibrada (só trabalho, nada de saúde) | Categorias com cores próprias e gráfico de distribuição de pontos |
| Esquecer tarefas com horário | Lembretes locais no horário da tarefa e resumo diário |
| Tarefas que se repetem todo dia ou em dias específicos | Recorrência diária, semanal (dias escolhidos) ou única |
| Desconfiança em apps que coletam dados | Tudo fica no aparelho; exportação manual em `.txt` |

---

## 2. Telas e fluxos existentes

| Tela | Arquivo | Função |
|---|---|---|
| Introdução (Onboarding) | `src/telas/Onboarding.js` | 3 passos: nome (obrigatório), categorias favoritas (opcional) e meta diária |
| Início | `src/telas/Inicio.js` | Saudação com avatar, progresso da meta, grade de categorias, tarefas de hoje |
| Categoria | `src/telas/TelaCategoria.js` | Tarefas de uma categoria e campo de adição rápida |
| Tarefas | `src/telas/Tarefas.js` | Todas as tarefas, filtros por categoria, reordenação e exclusão por deslize |
| Editor de tarefa (modal) | `src/telas/EditorTarefa.js` | Criar/editar tarefa: título, categoria, pontos, prioridade, horário, lembrete, recorrência |
| Editor de categoria (bottom sheet) | `src/telas/EditorCategoria.js` | Criar/editar categoria personalizada com prévia ao vivo |
| Estatísticas | `src/telas/Estatisticas.js` | Sequência, recorde, gráfico da semana, pontos por categoria, calendário do mês |
| Perfil | `src/telas/Perfil.js` | Nome, foto, cor do avatar, meta, tema, lembretes, exportar e limpar dados |
| Lembretes | `src/telas/Lembretes.js` | Ativar lembretes, resumo diário e horário, lista de tarefas com lembrete |

Navegação: barra inferior com **Início, Tarefas, Estatísticas e Perfil**; as demais telas abrem empilhadas, em modal ou em bottom sheet.

---

## 3. Requisitos Funcionais (RF)

| ID | Requisito | Onde está implementado |
|---|---|---|
| **RF01** | O sistema deve exigir que o usuário informe um **nome** na primeira abertura antes de acessar o app, e permitir escolher categorias favoritas e a meta diária. | `Onboarding.js` |
| **RF02** | O usuário deve poder **criar, editar, concluir, reordenar e excluir tarefas**, informando título, categoria, pontos, prioridade, horário opcional, lembrete e recorrência (diária, semanal ou única). A exclusão deve oferecer **"Desfazer"**. | `EditorTarefa.js`, `Tarefas.js`, `TelaCategoria.js`, `ItemTarefa.js`, `TarefasContexto.js` |
| **RF03** | O sistema deve exibir as **4 categorias padrão** e permitir **criar, editar e excluir categorias personalizadas** (nome, ícone e cor), respeitando o limite total de categorias. | `dados/categorias.js`, `EditorCategoria.js`, `Inicio.js`, `useCategorias.js` |
| **RF04** | O sistema deve calcular e exibir o **progresso do dia** (pontos conquistados ÷ meta) e comemorar com confete e vibração ao atingir a meta. | `CartaoProgresso.js`, `useEstatisticas`, `useComemoracaoMeta.js`, `Confete.js` |
| **RF05** | O sistema deve exibir **estatísticas**: sequência atual, recorde pessoal, pontos dos últimos 7 dias com a linha da meta, distribuição de pontos por categoria (7 dias), calendário de calor do mês e progresso de hoje por categoria. | `Estatisticas.js`, `utilitarios/estatisticas.js`, `sequencia.js` |
| **RF06** | O usuário deve poder **personalizar o perfil**: alterar nome, escolher **foto de perfil da galeria** (recorte 1:1) ou cor do avatar, ajustar a meta diária e escolher o tema (sistema, escuro ou claro). | `Perfil.js`, `fotoPerfil.js`, `Avatar.js`, `TemaContexto.js` |
| **RF07** | O usuário deve poder **exportar seus dados** (perfil, tarefas e histórico) em um arquivo **`.txt`** legível e compartilhá-lo pelo menu nativo do aparelho. | `servicos/exportacao.js`, `utilitarios/exportacao.js` |
| **RF08** | O usuário deve poder ativar **lembretes locais** no horário das tarefas e um **resumo diário** em horário configurável. | `Lembretes.js`, `useLembretes.js`, `agendaLembretes.js`, `notificacoes.js` |
| **RF09** | O sistema deve realizar a **virada do dia** automaticamente: registrar o dia encerrado no histórico, reabrir as tarefas recorrentes e remover as tarefas únicas já concluídas. | `viradaDoDia.js`, `useHoje.js` |
| **RF10** | O usuário deve poder **limpar todos os dados** do app após confirmação, voltando ao estado inicial. | `Perfil.js`, `armazenamento.js` |

---

## 4. Requisitos Não Funcionais (RNF)

| ID | Categoria | Requisito |
|---|---|---|
| **RNF01** | Plataforma | O app deve rodar em **Android e iOS** a partir de uma única base de código em **React Native 0.88 + Expo SDK 58**, em JavaScript, testável no **Expo Go** e distribuível como **APK** via **EAS Build**. |
| **RNF02** | Persistência / Disponibilidade | O app deve funcionar **100% offline**, persistindo dados localmente com **AsyncStorage** (chaves `@promobile/dados`, `@promobile/preferencias`, `@promobile/tema`). Os dados devem sobreviver ao fechamento do app e a atualizações (com **versionamento e migração** do formato salvo). |
| **RNF03** | Confiabilidade | Dados corrompidos não podem derrubar o app: itens inválidos são descartados um a um, o conteúdo ilegível é copiado para `@promobile/dados-recuperacao`, e se a leitura falhar o app **não sobrescreve** os dados salvos. Erros de renderização são capturados por um *Error Boundary* (`LimiteErro`). |
| **RNF04** | Usabilidade / Acessibilidade | Interface em PT-BR, com tema claro e escuro, alvos de toque de no mínimo **44 pt**, rótulos de acessibilidade, limite de escala de fonte em números grandes e **contraste WCAG AA** verificado por testes automatizados em ambos os temas. Animações respeitam a opção "reduzir movimento" do sistema. |
| **RNF05** | Desempenho | Listas de tarefas devem usar componentes memoizados e callbacks estáveis; animações rodam na thread de UI (Reanimated 4); o app só esconde a splash quando dados, preferências, tema e fontes estão carregados. |
| **RNF06** | Privacidade | Nenhum dado sai do aparelho sem ação do usuário. Permissões (galeria, notificações) são pedidas **só quando necessárias**, com texto explicativo; câmera e microfone são bloqueados na configuração. |
| **RNF07** | Qualidade | O código deve passar no **ESLint** e no **Prettier**, e a lógica de negócio deve estar coberta por **testes automatizados (Jest)**. |

---

## 5. Regras de negócio

### 5.1 Identificação inicial

- **RN01** — O nome é **obrigatório** na introdução: o botão "Continuar" fica desativado enquanto o campo estiver vazio ou só com espaços. Não existe opção de pular.
- **RN02** — O nome é salvo sem espaços nas pontas e com no máximo **30 caracteres**. No Perfil, apagar o nome não é aceito: o valor anterior é restaurado.

### 5.2 Tarefas

- **RN03** — Título obrigatório, com até **80 caracteres**.
- **RN04** — Pontos sugeridos: **5, 10, 20 ou 30** (padrão 10). Prioridade: baixa, média (padrão) ou alta.
- **RN05** — Recorrência: **diária** (aparece todo dia), **semanal** (só nos dias escolhidos — exige ao menos um dia) ou **única** (removida na virada do dia depois de concluída).
- **RN06** — Lembrete só é permitido se a tarefa tiver **horário** no formato `HH:MM`.

### 5.3 Pontuação, meta e sequência

- **RN07** — **Progresso do dia = pontos das tarefas concluídas ÷ meta diária** (e não a soma de todas as tarefas). Tarefas de qualquer categoria, inclusive personalizadas, contam para a meta.
- **RN08** — A meta diária vai de **10 a 500 pontos**, em passos de 10 (padrão 50). A **meta sugerida** é cerca de 70% dos pontos das tarefas de hoje, arredondada para múltiplos de 10.
- **RN09** — Um dia conta como **meta batida** quando os pontos concluídos são maiores ou iguais à meta daquele dia.
- **RN10** — A **sequência atual** conta dias consecutivos com meta batida até hoje (ou até ontem, se hoje ainda não bateu). O **recorde** é a maior sequência já alcançada e é preservado mesmo além do limite de histórico.
- **RN11** — O histórico guarda no máximo **400 dias**. Dias em que o app não foi aberto ficam sem registro.

### 5.4 Categorias

- **RN12** — Existem **4 categorias fixas** (Saúde, Estudos, Trabalho, Devocional), que não podem ser editadas nem excluídas.
- **RN13** — O total de categorias é limitado a **6** (`LIMITE_MAXIMO_CATEGORIAS`), ou seja, até **2 personalizadas**. Ao atingir o limite, o cartão "Nova categoria" some e o selo mostra `6/6 categorias`.
- **RN14** — O nome da categoria personalizada é obrigatório, tem até **15 caracteres** e não pode repetir o nome de outra categoria (a comparação ignora acentos e maiúsculas: "saude" = "Saúde").
- **RN15** — Ícone escolhido entre **16 opções** e cor entre **8 paletas**; todas as paletas passam no teste de contraste nos dois temas.
- **RN16** — Excluir uma categoria personalizada **exclui também as tarefas vinculadas** (após confirmação que informa a quantidade) e libera uma vaga.

### 5.5 Perfil, foto e exportação

- **RN17** — A foto de perfil é copiada para a pasta permanente do app; nas preferências fica **só o nome do arquivo**. Se o arquivo sumir, o avatar volta a mostrar a inicial do nome.
- **RN18** — A exportação gera `willflow-AAAA-MM-DD.txt` (tipo `text/plain;charset=utf-8`) com seções Perfil, Tarefas e Histórico. Se o aparelho não puder compartilhar arquivos, o conteúdo é compartilhado como texto.
- **RN19** — "Limpar dados" apaga tarefas, histórico, preferências, tema e a foto de perfil, sempre após confirmação.

### 5.6 Lembretes

- **RN20** — Os lembretes são reagendados a cada mudança, cobrindo os **próximos 7 dias**, com no máximo **60 notificações** agendadas. A permissão só é pedida na tela de Lembretes.

---

## 6. Critérios de aceitação

### CA01 — Introdução com nome obrigatório (RF01)

- **Dado** que é a primeira abertura do app, **quando** o campo de nome está vazio ou só com espaços, **então** o botão "Continuar" fica desativado e não há botão "Pular".
- **Dado** um nome válido, **quando** o usuário conclui os 3 passos, **então** o app abre na aba Início com a saudação usando o nome informado.

### CA02 — Gestão de tarefas (RF02)

- **Quando** o usuário cria uma tarefa com título e categoria, **então** ela aparece na categoria, na aba Tarefas e (se for do dia) em "Tarefas de hoje".
- **Quando** o usuário desliza uma tarefa para a esquerda, **então** ela é excluída e um aviso com "Desfazer" permite restaurá-la na mesma posição.
- **Dado** recorrência semanal sem nenhum dia marcado, **então** não é possível salvar.

### CA03 — Categorias personalizadas (RF03)

- **Dado** 4 categorias, **então** o selo mostra `4/6 categorias` e aparece o cartão tracejado "+ Nova categoria".
- **Quando** o usuário digita o nome, escolhe ícone e cor, **então** a prévia do cartão atualiza em tempo real; o botão "Criar categoria" fica desativado com nome vazio ou repetido.
- **Dado** 6 categorias, **então** o cartão "+ Nova categoria" não aparece e o selo indica o limite.
- **Quando** o usuário segura uma categoria personalizada, **então** aparecem as opções Editar e Excluir; nas categorias padrão aparece um aviso de que não podem ser alteradas.
- **Quando** o usuário exclui uma categoria com tarefas, **então** o alerta informa quantas tarefas serão excluídas, e após confirmar a categoria e suas tarefas somem e a vaga é liberada.
- A nova categoria aparece como opção no editor de tarefas, nos filtros da aba Tarefas e nas Estatísticas.

### CA04 — Meta diária e progresso (RF04)

- **Dado** meta de 50 pontos, **quando** o usuário conclui tarefas que somam 50 pontos ou mais, **então** o progresso chega a 100%, o confete aparece e o aparelho vibra no momento em que a meta passa de "não batida" para "batida".
- Abrir o app com a meta já batida não repete a comemoração.

### CA05 — Estatísticas (RF05)

- O gráfico "Pontos por categoria" mostra o total dos últimos 7 dias **centralizado dentro do anel**, sem sobrepor a frase "Somando os últimos 7 dias".
- A sequência aumenta em 1 a cada dia consecutivo com meta batida e zera após um dia sem bater a meta; o recorde nunca diminui.

### CA06 — Foto de perfil (RF06)

- **Quando** o usuário toca no avatar do Perfil, **então** abre a galeria com recorte quadrado; a foto escolhida aparece no Perfil e no cabeçalho do Início e permanece após fechar e reabrir o app.
- **Dado** permissão negada, **então** um alerta explica o motivo e oferece "Permitir" ou "Abrir ajustes".
- **Quando** o usuário toca em "Remover foto" e confirma, **então** o avatar volta à inicial do nome.

### CA07 — Exportação (RF07)

- **Quando** o usuário toca em "Exportar dados", **então** é gerado um arquivo `.txt` com perfil, tarefas (com `[x]` para concluídas) e histórico, e abre o menu de compartilhamento; um aviso confirma o nome do arquivo.

### CA08 — Persistência (RNF02)

- **Dado** qualquer alteração (tarefa, categoria, meta, foto, tema), **quando** o app é fechado e reaberto, **então** o estado é exatamente o mesmo.

---

## 7. Fora do escopo (versão atual)

- Conta de usuário, login e sincronização entre aparelhos (não há back-end).
- Publicação nas lojas (o app é distribuído como APK de teste).
- Edição das 4 categorias padrão.
