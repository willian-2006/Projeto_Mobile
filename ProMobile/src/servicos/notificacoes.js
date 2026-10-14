import { Platform } from 'react-native';

let modulo = null;

const CANAL = 'lembretes';

function notificacoes() {
  if (!modulo) {
    modulo = require('expo-notifications');

    modulo.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  return modulo;
}

async function criarCanal() {
  if (Platform.OS === 'android') {
    const Notificacoes = notificacoes();

    await Notificacoes.setNotificationChannelAsync(CANAL, {
      name: 'Lembretes',
      importance: Notificacoes.AndroidImportance.DEFAULT,
    });
  }
}

export async function pedirPermissao() {
  try {
    const Notificacoes = notificacoes();

    await criarCanal();

    const atual = await Notificacoes.getPermissionsAsync();

    if (atual.granted) {
      return true;
    }

    if (!atual.canAskAgain) {
      return false;
    }

    const resposta = await Notificacoes.requestPermissionsAsync();

    return resposta.granted;
  } catch (erro) {
    console.warn('Não foi possível pedir permissão de notificação.', erro);

    return false;
  }
}

export async function permissaoConcedida() {
  try {
    return (await notificacoes().getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

async function executarAgenda(agenda) {
  try {
    const Notificacoes = notificacoes();

    await Notificacoes.cancelAllScheduledNotificationsAsync();

    if (agenda.length === 0 || !(await permissaoConcedida())) {
      return;
    }

    await criarCanal();

    await Promise.all(
      agenda.map(lembrete =>
        Notificacoes.scheduleNotificationAsync({
          identifier: lembrete.id,
          content: { title: lembrete.titulo, body: lembrete.corpo },
          trigger: {
            type: Notificacoes.SchedulableTriggerInputTypes.DATE,
            date: lembrete.data,
            channelId: CANAL,
          },
        })
      )
    );
  } catch (erro) {
    console.warn('Não foi possível agendar os lembretes.', erro);
  }
}

async function executarCancelamento() {
  try {
    await notificacoes().cancelAllScheduledNotificationsAsync();
  } catch (erro) {
    console.warn('Não foi possível cancelar os lembretes.', erro);
  }
}

let fila = Promise.resolve();

function enfileirar(tarefa) {
  fila = fila.then(tarefa, tarefa);

  return fila;
}

export function agendarLembretes(agenda) {
  return enfileirar(() => executarAgenda(agenda));
}

export function cancelarLembretes() {
  return enfileirar(executarCancelamento);
}
