import React, { useEffect, useId } from 'react';

import { View, StyleSheet } from 'react-native';

import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient as GradienteSvg,
  Stop,
} from 'react-native-svg';

import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTema } from '../contexto/TemaContexto';

import { transicao } from '../estilos/movimento';

const CirculoAnimado = Animated.createAnimatedComponent(Circle);

export default function AnelProgresso({
  porcentagem,
  gradiente,
  tamanho = 112,
  espessura = 12,
  children,
}) {
  const { tema } = useTema();

  const cores = gradiente || tema.cores.gradientePrincipal;

  const idGradiente = `anel${useId().replace(/:/g, '')}`;

  const raioCirculo = (tamanho - espessura) / 2;

  const circunferencia = 2 * Math.PI * raioCirculo;

  const progresso = useSharedValue(0);

  useEffect(() => {
    progresso.set(withTiming(porcentagem / 100, transicao));
  }, [porcentagem, progresso]);

  const propriedadesAnimadas = useAnimatedProps(() => ({
    strokeDashoffset: circunferencia * (1 - progresso.value),
    strokeOpacity: progresso.value > 0.005 ? 1 : 0,
  }));

  return (
    <View
      style={{ width: tamanho, height: tamanho }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: porcentagem }}
    >
      <Svg width={tamanho} height={tamanho}>
        <Defs>
          <GradienteSvg id={idGradiente} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={cores[0]} />
            <Stop offset="1" stopColor={cores[1]} />
          </GradienteSvg>
        </Defs>

        <G rotation={-90} origin={`${tamanho / 2}, ${tamanho / 2}`}>
          <Circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raioCirculo}
            stroke={tema.cores.superficieElevada}
            strokeWidth={espessura}
            fill="none"
          />

          <CirculoAnimado
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raioCirculo}
            stroke={`url(#${idGradiente})`}
            strokeWidth={espessura}
            strokeLinecap="round"
            strokeDasharray={`${circunferencia} ${circunferencia}`}
            fill="none"
            animatedProps={propriedadesAnimadas}
          />
        </G>
      </Svg>

      <View style={estilos.centro} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
