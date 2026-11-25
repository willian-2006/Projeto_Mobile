import React, { useState } from 'react';

import { Image, Text, View, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useTema } from '../contexto/TemaContexto';

import { uriDaFotoPerfil } from '../servicos/fotoPerfil';

import { inicialDoNome } from '../utilitarios/preferencias';

export function gradienteAvatar(tema, cor) {
  return tema.categorias[cor]?.gradiente || tema.cores.gradientePrincipal;
}

export default function Avatar({ nome, cor, foto = null, tamanho = 44 }) {
  const { tema } = useTema();

  const [fotoComErro, setFotoComErro] = useState(null);

  const formato = {
    width: tamanho,
    height: tamanho,
    borderRadius: tamanho / 2,
  };

  const uri = foto ? uriDaFotoPerfil(foto) : null;

  if (uri && uri !== fotoComErro) {
    return (
      <View
        style={[
          estilos.avatar,
          formato,
          { backgroundColor: tema.cores.superficieElevada },
        ]}
      >
        <Image
          source={{ uri }}
          style={formato}
          onError={() => setFotoComErro(uri)}
          accessibilityIgnoresInvertColors
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradienteAvatar(tema, cor)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[estilos.avatar, formato]}
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
    overflow: 'hidden',
  },
});
