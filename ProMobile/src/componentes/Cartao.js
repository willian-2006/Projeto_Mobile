import React from 'react';

import { View, Platform, StyleSheet } from 'react-native';

import { BlurView } from 'expo-blur';

import { useEstilos, useTema } from '../contexto/TemaContexto';

// Cartão com efeito vidro. O blur real só é usado no iOS; no
// Android (onde é experimental e pesado) fica a superfície
// translúcida com a mesma borda. `vidro={false}` dá um cartão sólido,
// mais leve para itens de lista.
export default function Cartao({ children, style, vidro = true, ...resto }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  if (vidro && Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={40}
        tint={tema.escuro ? 'dark' : 'light'}
        style={[estilos.cartao, estilos.vidro, style]}
        {...resto}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[estilos.cartao, vidro ? estilos.vidro : estilos.solido, style]}
      {...resto}
    >
      {children}
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    cartao: {
      borderRadius: tema.raio.md + 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      overflow: 'hidden',
    },

    vidro: {
      backgroundColor: tema.cores.superficieVidro,
    },

    solido: {
      backgroundColor: tema.cores.superficie,
      borderColor: tema.cores.borda,
    },
  });
