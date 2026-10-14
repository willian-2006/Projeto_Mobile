import React from 'react';

import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { cores } from '../estilos/cores';

// Nome e avatar ainda fixos: perfil e configurações chegam na Fase 4.
const recursosFuturos = [
  { icone: 'person-circle-outline', texto: 'Nome e avatar' },
  { icone: 'color-palette-outline', texto: 'Tema claro e escuro' },
  { icone: 'flag-outline', texto: 'Meta diária' },
  { icone: 'notifications-outline', texto: 'Lembretes' },
  { icone: 'download-outline', texto: 'Exportar e limpar dados' },
];

export default function Perfil() {
  const estatisticas = useEstatisticas();

  return (
    <SafeAreaView style={estilos.areaSegura} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela titulo="Perfil" />

        <View style={estilos.cartaoPerfil}>
          <View style={estilos.avatar}>
            <Text style={estilos.letraAvatar}>W</Text>
          </View>

          <Text style={estilos.nome}>Willian</Text>

          <Text style={estilos.resumo}>
            {estatisticas.pontosAtuais} pontos hoje • {estatisticas.concluidas}{' '}
            {estatisticas.concluidas === 1
              ? 'tarefa concluída'
              : 'tarefas concluídas'}
          </Text>
        </View>

        <Text style={estilos.tituloSecao}>Em breve</Text>

        <View style={estilos.cartao}>
          {recursosFuturos.map(recurso => (
            <View key={recurso.texto} style={estilos.linha}>
              <Ionicons
                name={recurso.icone}
                size={20}
                color={cores.textoSecundario}
              />

              <Text style={estilos.textoLinha}>{recurso.texto}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudoRolagem: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  cartaoPerfil: {
    backgroundColor: cores.branco,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.principal,
    justifyContent: 'center',
    alignItems: 'center',
  },

  letraAvatar: {
    color: cores.branco,
    fontSize: 28,
    fontWeight: '700',
  },

  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto,
    marginTop: 12,
  },

  resumo: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 4,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 15,
  },

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 18,
    paddingHorizontal: 16,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  textoLinha: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginLeft: 12,
  },
});
