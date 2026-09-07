import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

const itens = [
  {
    nome: 'Início',
    icone: 'home',
  },

  {
    nome: 'Tarefas',
    icone: 'checkmark-circle-outline',
  },

  {
    nome: 'Metas',
    icone: 'trophy-outline',
  },

  {
    nome: 'Rotina',
    icone: 'calendar-outline',
  },

  {
    nome: 'Perfil',
    icone: 'person-outline',
  },
];

export default function NavegacaoInferior() {

  return (
    <View style={estilos.container}>

      {itens.map((item, indice) => {

        const ativo = indice === 0;

        return (
          <TouchableOpacity
            key={item.nome}
            style={estilos.item}
            activeOpacity={0.7}
          >

            <Ionicons
              name={item.icone}
              size={22}
              color={
                ativo
                  ? cores.principal
                  : cores.textoSecundario
              }
            />

            <Text
              style={[
                estilos.texto,
                ativo && estilos.textoAtivo,
              ]}
            >
              {item.nome}
            </Text>

          </TouchableOpacity>
        );
      })}

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    height: 75,

    backgroundColor: cores.branco,

    borderTopWidth: 1,
    borderTopColor: cores.borda,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    paddingBottom: 8,
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
  },

  texto: {
    fontSize: 10,
    marginTop: 4,
    color: cores.textoSecundario,
  },

  textoAtivo: {
    color: cores.principal,
    fontWeight: '700',
  },
});