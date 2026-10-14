import React, { memo } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

function CartaoCategoria({
  chave,
  titulo,
  icone,
  tarefas,
  pontos,
  corFundo,
  corIcone,
  aoPressionar,
}) {
  return (
    <TouchableOpacity
      style={estilos.cartao}
      onPress={() => aoPressionar(chave)}
      activeOpacity={0.7}
    >
      <View
        style={[
          estilos.icone,
          {
            backgroundColor: corFundo,
          },
        ]}
      >
        <Ionicons name={icone} size={21} color={corIcone} />
      </View>

      <Text style={estilos.titulo}>{titulo}</Text>

      <Text style={estilos.tarefas}>
        {tarefas} {tarefas === 1 ? 'tarefa' : 'tarefas'}
      </Text>

      <Text style={estilos.pontos}>{pontos} pontos</Text>
    </TouchableOpacity>
  );
}

export default memo(CartaoCategoria);

const estilos = StyleSheet.create({
  cartao: {
    width: '48%',
    backgroundColor: cores.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  icone: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },

  tarefas: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 5,
  },

  pontos: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.principal,
    marginTop: 3,
  },
});
