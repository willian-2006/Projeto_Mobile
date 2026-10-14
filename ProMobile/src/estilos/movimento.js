import {
  Easing,
  FadeInDown,
  FadeOut,
  ReduceMotion,
} from 'react-native-reanimated';

// Todas as animações respeitam "reduzir movimento" do sistema:
// com ele ativo, viram transições instantâneas.
export const transicao = {
  duration: 600,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
};

export const transicaoRapida = {
  duration: 220,
  easing: Easing.out(Easing.quad),
  reduceMotion: ReduceMotion.System,
};

export const mola = {
  damping: 14,
  stiffness: 180,
  reduceMotion: ReduceMotion.System,
};

// Entrada em cascata das listas (atraso limitado para listas longas).
export function entradaCascata(indice = 0) {
  return FadeInDown.delay(Math.min(indice, 8) * 50)
    .duration(350)
    .reduceMotion(ReduceMotion.System);
}

export const saida = FadeOut.duration(200).reduceMotion(ReduceMotion.System);
