import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

export default function CabecalhoTela({ titulo, subtitulo, aoVoltar }) {
  return (
    <View style={estilos.cabecalho}>
      {aoVoltar && (
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={aoVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={23} color={cores.texto} />
        </TouchableOpacity>
      )}

      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>

        {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  textos: {
    flex: 1,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: cores.texto,
  },

  subtitulo: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 3,
  },
});
