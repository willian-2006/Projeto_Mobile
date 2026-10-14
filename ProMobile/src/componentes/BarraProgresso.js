import React, { useEffect } from 'react';

import { View, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { transicao } from '../estilos/movimento';

export default function BarraProgresso({ porcentagem, gradiente }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const progresso = useSharedValue(0);

  useEffect(() => {
    progresso.set(withTiming(porcentagem, transicao));
  }, [porcentagem, progresso]);

  const estiloAnimado = useAnimatedStyle(() => ({
    width: `${progresso.value}%`,
  }));

  return (
    <View
      style={estilos.fundo}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: porcentagem }}
    >
      <Animated.View style={[estilos.preenchimento, estiloAnimado]}>
        <LinearGradient
          colors={gradiente || tema.cores.gradientePrincipal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    fundo: {
      height: 8,
      backgroundColor: tema.cores.superficieElevada,
      borderRadius: tema.raio.pilula,
      overflow: 'hidden',
    },

    preenchimento: {
      height: '100%',
      borderRadius: tema.raio.pilula,
      overflow: 'hidden',
    },
  });
