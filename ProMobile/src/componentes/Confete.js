import React, { useEffect } from 'react';

import { StyleSheet, useWindowDimensions, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useTema } from '../contexto/TemaContexto';

const QUANTIDADE = 40;

const DURACAO = 2600;

// Pseudoaleatório determinístico (mesma sequência a cada render).
function aleatorio(indice, semente) {
  const valor = Math.sin(indice * 12.9898 + semente * 78.233) * 43758.5453;

  return valor - Math.floor(valor);
}

function Particula({ indice, largura, altura, cor }) {
  const progresso = useSharedValue(0);

  const inicioX = aleatorio(indice, 1) * largura;

  const deriva = (aleatorio(indice, 2) - 0.5) * 160;

  const giros = 2 + aleatorio(indice, 3) * 4;

  const atraso = aleatorio(indice, 4) * 500;

  const tamanho = 6 + aleatorio(indice, 5) * 6;

  useEffect(() => {
    progresso.set(
      withDelay(
        atraso,
        withTiming(1, {
          duration: DURACAO - atraso,
          easing: Easing.in(Easing.quad),
        })
      )
    );
  }, [progresso, atraso]);

  const estiloAnimado = useAnimatedStyle(() => ({
    opacity: progresso.value < 0.85 ? 1 : (1 - progresso.value) / 0.15,
    transform: [
      { translateX: inicioX + deriva * progresso.value },
      { translateY: -20 + (altura + 40) * progresso.value },
      { rotate: `${giros * 360 * progresso.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        estilos.particula,
        {
          width: tamanho,
          height: tamanho * 0.6,
          backgroundColor: cor,
        },
        estiloAnimado,
      ]}
    />
  );
}

// Chuva de confete que cai uma vez por toda a tela. Não aparece com
// "reduzir movimento" ativo. Para repetir, troque a `key`.
export default function Confete() {
  const { tema } = useTema();

  const { width, height } = useWindowDimensions();

  const movimentoReduzido = useReducedMotion();

  if (movimentoReduzido) {
    return null;
  }

  const cores = [
    ...tema.cores.gradientePrincipal,
    ...Object.values(tema.categorias).map(categoria => categoria.cor),
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: QUANTIDADE }, (_, indice) => (
        <Particula
          key={indice}
          indice={indice}
          largura={width}
          altura={height}
          cor={cores[indice % cores.length]}
        />
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  particula: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 2,
  },
});
