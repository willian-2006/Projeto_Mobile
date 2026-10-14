import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Animated, {
  FadeInDown,
  FadeOutDown,
  ReduceMotion,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEstilos } from '../contexto/TemaContexto';

import { brilho } from '../estilos/sombras';

// Fica acima da barra de abas flutuante.
const DISTANCIA_BARRA = 96;

const entrada = FadeInDown.duration(250).reduceMotion(ReduceMotion.System);

const saidaAviso = FadeOutDown.duration(200).reduceMotion(ReduceMotion.System);

export default function Aviso({ mensagem, rotuloAcao, aoAcionar }) {
  const estilos = useEstilos(criarEstilos);

  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={entrada}
      exiting={saidaAviso}
      style={[estilos.posicao, { bottom: insets.bottom + DISTANCIA_BARRA }]}
      pointerEvents="box-none"
    >
      <View style={estilos.aviso} accessibilityLiveRegion="polite">
        <Text style={estilos.mensagem} numberOfLines={2}>
          {mensagem}
        </Text>

        {rotuloAcao ? (
          <TouchableOpacity
            style={estilos.botao}
            onPress={aoAcionar}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={rotuloAcao}
          >
            <Text style={estilos.textoBotao}>{rotuloAcao}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    posicao: {
      position: 'absolute',
      left: tema.espaco.lg,
      right: tema.espaco.lg,
    },

    aviso: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      paddingLeft: tema.espaco.lg,
      paddingRight: tema.espaco.xs,
      borderRadius: tema.raio.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      backgroundColor: tema.cores.superficieElevada,
      ...brilho(tema.cores.sombra, 0.6, tema.cores.superficieElevada),
    },

    mensagem: {
      ...tema.tipografia.corpo,
      flex: 1,
      color: tema.cores.texto,
      paddingVertical: tema.espaco.sm,
    },

    botao: {
      minHeight: tema.areaToque,
      paddingHorizontal: tema.espaco.md,
      justifyContent: 'center',
    },

    textoBotao: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 14,
      color: tema.cores.principal,
    },
  });
