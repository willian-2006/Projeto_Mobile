import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

export default function ItemTarefa({
  tarefa,
  aoAlternar,
}) {

  return (
    <TouchableOpacity
      style={estilos.container}
      onPress={() => aoAlternar(tarefa.id)}
      activeOpacity={0.7}
    >

      <View
        style={[
          estilos.checkbox,
          tarefa.concluida &&
            estilos.checkboxConcluido,
        ]}
      >

        {tarefa.concluida && (
          <Ionicons
            name="checkmark"
            size={16}
            color={cores.branco}
          />
        )}

      </View>

      <View style={estilos.conteudo}>

        <Text
          style={[
            estilos.titulo,
            tarefa.concluida &&
              estilos.tituloConcluido,
          ]}
        >
          {tarefa.titulo}
        </Text>

        <View style={estilos.informacoes}>

          <Text style={estilos.categoria}>
            {tarefa.categoria}
          </Text>

          <Text style={estilos.separador}>
            •
          </Text>

          <Text style={estilos.pontos}>
            +{tarefa.pontos} pontos
          </Text>

        </View>

      </View>

    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: cores.borda,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  checkboxConcluido: {
    backgroundColor: cores.sucesso,
    borderColor: cores.sucesso,
  },

  conteudo: {
    flex: 1,
  },

  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
  },

  tituloConcluido: {
    textDecorationLine: 'line-through',
    color: cores.textoSecundario,
  },

  informacoes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  categoria: {
    fontSize: 12,
    color: cores.textoSecundario,
  },

  separador: {
    marginHorizontal: 5,
    color: cores.textoSecundario,
  },

  pontos: {
    fontSize: 12,
    color: cores.principal,
    fontWeight: '600',
  },
});