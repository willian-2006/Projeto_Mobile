import { Platform } from 'react-native';

// Brilho colorido nos elementos de destaque. No Android, `elevation`
// com `shadowColor` (API 28+) dá o equivalente; lá a sombra só aparece
// se a View tiver cor de fundo, por isso `fundoAndroid`.
export function brilho(cor, intensidade = 1, fundoAndroid) {
  return Platform.select({
    ios: {
      shadowColor: cor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35 * intensidade,
      shadowRadius: 14 * intensidade,
    },
    default: {
      shadowColor: cor,
      elevation: Math.round(8 * intensidade),
      backgroundColor: fundoAndroid,
    },
  });
}
