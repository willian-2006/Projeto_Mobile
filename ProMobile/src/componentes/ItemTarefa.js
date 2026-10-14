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
  aoExcluir,
}) {
  return (
    <View style={estilos.container}>
      <TouchableOpacity
        style={estilos.areaTarefa}
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

      <TouchableOpacity
        style={estilos.botaoExcluir}
        onPress={() => aoExcluir(tarefa.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={cores.textoSecundario}
        />
      </TouchableOpacity>
    </View>
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

  areaTarefa: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

  botaoExcluir: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});