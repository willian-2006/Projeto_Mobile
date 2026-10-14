import React, { useEffect } from 'react';

import { View, StyleSheet } from 'react-native';

import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import Tela from './Tela';

import { useEstilos } from '../contexto/TemaContexto';

export default function Carregando() {
  const estilos = useEstilos(criarEstilos);

  const opacidade = useSharedValue(0.45);

  useEffect(() => {
    opacidade.set(
      withRepeat(
        withTiming(1, { duration: 800, reduceMotion: ReduceMotion.System }),
        -1,
        true,
        undefined,
        ReduceMotion.System
      )
    );
  }, [opacidade]);

  const pulsar = useAnimatedStyle(() => ({ opacity: opacidade.value }));

  return (
    <Tela edges={['top']}>
      <Animated.View
        style={[estilos.conteudo, pulsar]}
        accessibilityLabel="Carregando"
        accessibilityRole="progressbar"
      >
        <View style={estilos.linhaTopo}>
          <View>
            <View style={[estilos.bloco, estilos.tituloFalso]} />
            <View style={[estilos.bloco, estilos.subtituloFalso]} />
          </View>

          <View style={[estilos.bloco, estilos.avatarFalso]} />
        </View>

        <View style={[estilos.bloco, estilos.cartaoProgresso]} />

        <View style={estilos.grade}>
          {[0, 1, 2, 3].map(indice => (
            <View
              key={indice}
              style={[estilos.bloco, estilos.cartaoCategoria]}
            />
          ))}
        </View>

        {[0, 1, 2].map(indice => (
          <View key={indice} style={[estilos.bloco, estilos.itemTarefa]} />
        ))}
      </Animated.View>
    </Tela>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    conteudo: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xl - 4,
    },

    bloco: {
      backgroundColor: tema.cores.superficieElevada,
      borderRadius: tema.raio.sm,
    },

    linhaTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tema.espaco.xl,
    },

    tituloFalso: {
      width: 160,
      height: 24,
      marginBottom: tema.espaco.sm,
    },

    subtituloFalso: {
      width: 220,
      height: 14,
    },

    avatarFalso: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
    },

    cartaoProgresso: {
      height: 150,
      borderRadius: tema.raio.lg,
      marginBottom: tema.espaco.xl,
    },

    grade: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: tema.espaco.lg,
    },

    cartaoCategoria: {
      width: '48%',
      height: 120,
      borderRadius: tema.raio.md + 4,
      marginBottom: tema.espaco.md,
    },

    itemTarefa: {
      height: 68,
      borderRadius: tema.raio.md,
      marginBottom: tema.espaco.sm + 2,
    },
  });
