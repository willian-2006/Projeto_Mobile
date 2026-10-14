import { Platform } from 'react-native';

// O expo-notifications só é carregado quando os lembretes são usados:
// no Expo Go (Android) a importação já mostra um aviso sobre push.
let modulo = null;

const CANAL = 'lembretes';

function notificacoes() {
  if (!modulo) {
    modulo = require('expo-notifications');

    // Com o app aberto, a notificação também aparece.
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

// Pede a permissão (só quando o usuário liga os lembretes).
// Devolve true se as notificações estão liberadas.
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

// Troca tudo o que estava agendado pela `agenda` nova
// (veja montarAgenda em utilitarios/agendaLembretes.js).
export async function agendarLembretes(agenda) {
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

export async function cancelarLembretes() {
  // Sem o módulo carregado, nada foi agendado nesta sessão; mas pode
  // haver agendamentos antigos, então carrega e cancela mesmo assim.
  try {
    await notificacoes().cancelAllScheduledNotificationsAsync();
  } catch (erro) {
    console.warn('Não foi possível cancelar os lembretes.', erro);
  }
}
