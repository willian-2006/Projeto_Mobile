import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

const itens = {
  Inicio: {
    nome: 'Início',
    icone: 'home',
  },

  Tarefas: {
    nome: 'Tarefas',
    icone: 'checkmark-circle-outline',
  },

  Metas: {
    nome: 'Metas',
    icone: 'trophy-outline',
  },

  Rotina: {
    nome: 'Rotina',
    icone: 'calendar-outline',
  },

  Perfil: {
    nome: 'Perfil',
    icone: 'person-outline',
  },
};

// Barra usada pelo bottom-tabs (prop `tabBar`): recebe o estado
// da navegação e as margens seguras da tela.
export default function NavegacaoInferior({ state, navigation, insets }) {
  return (
    <View
      style={[estilos.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {state.routes.map((rota, indice) => {
        const item = itens[rota.name];

        const ativo = state.index === indice;

        function aoPressionar() {
          const evento = navigation.emit({
            type: 'tabPress',
            target: rota.key,
            canPreventDefault: true,
          });

          if (!ativo && !evento.defaultPrevented) {
            navigation.navigate(rota.name);
          }
        }

        return (
          <TouchableOpacity
            key={rota.key}
            style={estilos.item}
            activeOpacity={0.7}
            onPress={aoPressionar}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={item.nome}
          >
            <Ionicons
              name={item.icone}
              size={22}
              color={ativo ? cores.principal : cores.textoSecundario}
            />

            <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>
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
    minHeight: 75,

    backgroundColor: cores.branco,

    borderTopWidth: 1,
    borderTopColor: cores.borda,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    paddingTop: 8,
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    minHeight: 44,
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
