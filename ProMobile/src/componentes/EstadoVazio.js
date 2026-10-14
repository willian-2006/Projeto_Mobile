import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

export default function EstadoVazio({ icone, cor, titulo, subtitulo }) {
  return (
    <View style={estilos.vazio}>
      <Ionicons name={icone} size={45} color={cor} />

      <Text style={estilos.textoVazio}>{titulo}</Text>

      {subtitulo ? (
        <Text style={estilos.subtextoVazio}>{subtitulo}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  vazio: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },

  textoVazio: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
    marginTop: 12,
    textAlign: 'center',
  },

  subtextoVazio: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 5,
    textAlign: 'center',
  },
});
