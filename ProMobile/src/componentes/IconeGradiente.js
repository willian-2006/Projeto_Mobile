import React from 'react';

import { StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { useTema } from '../contexto/TemaContexto';

export default function IconeGradiente({
  icone,
  gradiente,
  tamanho = 42,
  tamanhoIcone = 20,
  redondo = false,
}) {
  const { tema } = useTema();

  return (
    <LinearGradient
      colors={gradiente || tema.cores.gradientePrincipal}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        estilos.icone,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: redondo ? tamanho / 2 : tema.raio.sm,
        },
      ]}
    >
      <Ionicons
        name={icone}
        size={tamanhoIcone}
        color={tema.cores.textoSobreDestaque}
      />
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  icone: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
