import * as Haptics from 'expo-haptics';

function executar(acao) {
  acao().catch(() => {});
}

export function vibrarConclusao() {
  executar(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function vibrarMeta() {
  executar(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
}

export function vibrarExclusao() {
  executar(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  );
}

export function vibrarSelecao() {
  executar(() => Haptics.selectionAsync());
}
