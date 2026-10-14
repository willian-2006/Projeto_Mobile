# ProMobile

Aplicativo de **rotina diária gamificada** feito com React Native e Expo. Cada tarefa pertence a uma categoria (Saúde, Estudos, Trabalho ou Devocional) e vale pontos. Ao concluir tarefas você avança na meta diária, mantém uma sequência de dias e acompanha a evolução em gráficos.

## Funcionalidades

- **Tarefas completas:** criar, editar, concluir e excluir. Cada tarefa tem pontos (5, 10, 20 ou 30), prioridade, horário opcional e repetição (todo dia, em dias da semana ou uma vez).
- **Gestos:** segure e arraste para reordenar; deslize para a esquerda para excluir, com a opção **Desfazer**.
- **Meta diária configurável,** com confete e vibração quando é batida.
- **Sequência:** dias seguidos batendo a meta e o recorde pessoal.
- **Histórico automático:** a cada novo dia, o resultado do anterior é guardado e as tarefas recorrentes reabrem.
- **Estatísticas:** pontos dos últimos 7 dias, distribuição por categoria e um calendário (heatmap) do mês.
- **Lembretes:** notificação no horário de cada tarefa e um resumo diário.
- **Perfil:** nome, cor do avatar, meta, tema (sistema, escuro ou claro), exportar e limpar dados.
- **Onboarding** de 3 telas na primeira abertura.
- **Acessibilidade:** rótulos para leitor de tela, áreas de toque de 44 pt, contraste AA testado e respeito ao "reduzir movimento".
- **Os dados ficam só no aparelho** (AsyncStorage). O app não usa internet nem conta.

## Como rodar

Você precisa de:

- [Node.js](https://nodejs.org) 20.19.4 ou mais recente (recomendado: a versão LTS atual);
- o app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS](https://apps.apple.com/app/expo-go/id982107779)), atualizado para o **SDK 57**.

```bash
git clone https://github.com/willian-2006/Projeto_Mobile.git
cd Projeto_Mobile/ProMobile
npm install
npx expo start
```

Depois, leia o QR code com o Expo Go (no Android) ou com a câmera (no iPhone). O celular e o computador precisam estar na mesma rede Wi-Fi.

> O app fica na pasta `ProMobile/`. Rode todos os comandos de dentro dela.

### Problemas comuns

| Sintoma                                                                  | Solução                                                                                                                                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O celular não conecta ("Could not connect", tempo esgotado)              | Em redes de faculdade ou empresa, os aparelhos costumam não se enxergar. Use `npx expo start --tunnel`. No Windows, confira também se o Wi-Fi está como rede **Privada**. |
| "Project is incompatible with this version of Expo Go"                   | Atualize o Expo Go na loja de aplicativos.                                                                                                                                |
| Erro estranho depois de instalar uma biblioteca                          | Limpe o cache: `npx expo start -c`.                                                                                                                                       |
| Aviso amarelo sobre _push notifications_ ao ligar os lembretes (Android) | É esperado no Expo Go. Os lembretes locais funcionam normalmente; o aviso só diz que notificações _push_ (vindas de servidor) exigem um build próprio.                    |

## Comandos

Dentro de `ProMobile/`:

| Comando                | O que faz                                           |
| ---------------------- | --------------------------------------------------- |
| `npx expo start`       | Inicia o servidor de desenvolvimento (Expo Go)      |
| `npm test`             | Roda os testes (Jest)                               |
| `npm run lint`         | Verifica o código com ESLint                        |
| `npm run format:check` | Verifica a formatação (Prettier)                    |
| `npx expo-doctor`      | Confere dependências e configuração                 |
| `npm run build:apk`    | Gera um APK instalável pelo EAS Build (veja abaixo) |

## Gerar um APK (opcional)

Para instalar o app sem o Expo Go, é possível gerar um APK na nuvem com o [EAS Build](https://docs.expo.dev/build/introduction/). Isso exige uma conta gratuita na Expo:

```bash
npm install -g eas-cli
eas login
eas init            # vincula o projeto à sua conta (só na primeira vez)
npm run build:apk   # perfil "preview" do eas.json
```

No fim, o EAS mostra um link para baixar o APK. Os perfis ficam em `ProMobile/eas.json`:

- **preview:** APK para testes;
- **production:** versões para as lojas;
- **development:** build de desenvolvimento. Exige instalar antes o `expo-dev-client` (`npx expo install expo-dev-client`), que deixa de abrir o app no Expo Go.

## Tecnologias

- **Expo SDK 57**, React Native 0.86, React 19 e JavaScript (sem TypeScript);
- **React Navigation 7:** pilha nativa e abas inferiores com uma barra própria;
- **Reanimated 4 e Gesture Handler:** animações e gestos;
- **react-native-svg:** anel de progresso e gráficos, sem biblioteca de gráficos;
- **AsyncStorage:** dados versionados, com migração automática entre versões;
- **expo-notifications, expo-haptics, expo-blur, expo-linear-gradient e expo-splash-screen;**
- **Jest** (`jest-expo`), **ESLint** e **Prettier**.

## Estrutura

```
ProMobile/
├── App.js                 # provedores (tema, avisos, preferências, tarefas) e tratamento de erros
├── app.json               # nome, ícones, splash e plugins
├── eas.json               # perfis de build
└── src/
    ├── componentes/       # peças visuais reutilizáveis (Cartao, ItemTarefa, gráficos...)
    ├── contexto/          # estado global: tarefas (useReducer), preferências, tema, avisos
    ├── dados/             # categorias, tarefas iniciais e opções
    ├── estilos/           # cores dos dois temas, tipografia, espaçamentos, animações
    ├── hooks/             # data atual, comemoração da meta, lembretes
    ├── navegacao/         # pilha principal e abas
    ├── servicos/          # armazenamento, notificações, vibração
    ├── telas/             # Início, Tarefas, Estatísticas, Rotina, Perfil, Editor, Lembretes...
    └── utilitarios/       # lógica pura e testada: datas, pontuação, virada do dia, sequência...
```

Toda a regra de negócio (pontuação, repetição de tarefas, virada do dia, sequência, estatísticas e agenda de lembretes) fica em funções puras em `src/utilitarios/`, cobertas por testes. As telas só exibem e disparam ações.

## Observações

- **`npm audit`:** acusa vulnerabilidades em ferramentas de desenvolvimento (CLI do Expo e Jest), como `braces`, `node-forge` e `sprintf-js`. Esses pacotes **não vão para o app**, e ainda não existe versão corrigida de vários deles. **Não rode `npm audit fix --force`**: ele "corrige" voltando o Expo para a versão 44, o que quebra o projeto.
- **Web:** o app foi feito para Android e iOS. A versão web não é suportada.
