import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

export default function Cabecalho() {
  return (
    <View style={estilos.container}>

      <View>
        <Text style={estilos.saudacao}>
          Olá, Willian
        </Text>

        <Text style={estilos.subtitulo}>
          Vamos cumprir suas metas de hoje?
        </Text>
      </View>

      <View style={estilos.acoes}>

        <TouchableOpacity style={estilos.botaoNotificacao}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={cores.texto}
          />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.avatar}>
          <Text style={estilos.letraAvatar}>
            W
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  saudacao: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.texto,
  },

  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 5,
  },

  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  botaoNotificacao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: cores.principal,
    justifyContent: 'center',
    alignItems: 'center',
  },

  letraAvatar: {
    color: cores.branco,
    fontSize: 17,
    fontWeight: '700',
  },
});