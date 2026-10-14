import React from 'react';

import { Text, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useTema } from '../contexto/TemaContexto';

import { inicialDoNome } from '../utilitarios/preferencias';

export function gradienteAvatar(tema, cor) {
  return tema.categorias[cor]?.gradiente || tema.cores.gradientePrincipal;
}

export default function Avatar({ nome, cor, tamanho = 44 }) {
  const { tema } = useTema();

  return (
    <LinearGradient
      colors={gradienteAvatar(tema, cor)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        estilos.avatar,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
      ]}
    >
      <Text
        style={{
          fontFamily: tema.fontes.titulo,
          fontSize: Math.round(tamanho * 0.4),
          color: tema.cores.textoSobreDestaque,
        }}
      >
        {inicialDoNome(nome)}
      </Text>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
