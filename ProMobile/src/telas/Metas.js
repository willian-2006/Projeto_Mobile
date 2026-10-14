import React from 'react';

import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import CartaoProgresso from '../componentes/CartaoProgresso';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { CATEGORIAS } from '../dados/categorias';

import { cores } from '../estilos/cores';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

export default function Metas() {
  const estatisticas = useEstatisticas();

  return (
    <SafeAreaView style={estilos.areaSegura} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela titulo="Metas" subtitulo="Seu progresso por categoria" />

        <CartaoProgresso
          pontosAtuais={estatisticas.pontosAtuais}
          pontosMaximos={estatisticas.pontosMaximos}
        />

        {CATEGORIAS.map(categoria => {
          const resumo = estatisticas.porCategoria[categoria.chave];

          const porcentagem = calcularPorcentagem(
            resumo.pontosConcluidos,
            resumo.pontos
          );

          return (
            <View key={categoria.chave} style={estilos.cartao}>
              <View style={estilos.topo}>
                <View
                  style={[
                    estilos.icone,
                    { backgroundColor: categoria.corFundo },
                  ]}
                >
                  <Ionicons
                    name={categoria.icone}
                    size={20}
                    color={categoria.cor}
                  />
                </View>

                <View style={estilos.textos}>
                  <Text style={estilos.titulo}>{categoria.titulo}</Text>

                  <Text style={estilos.detalhe}>
                    {resumo.concluidas} de {resumo.tarefas} concluídas •{' '}
                    {resumo.pontosConcluidos}/{resumo.pontos} pontos
                  </Text>
                </View>

                <Text style={[estilos.porcentagem, { color: categoria.cor }]}>
                  {porcentagem}%
                </Text>
              </View>

              <View style={estilos.fundoBarra}>
                <View
                  style={[
                    estilos.barra,
                    {
                      width: `${porcentagem}%`,
                      backgroundColor: categoria.cor,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
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

  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icone: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  textos: {
    flex: 1,
  },

  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },

  detalhe: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 3,
  },

  porcentagem: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },

  fundoBarra: {
    height: 8,
    backgroundColor: cores.borda,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 14,
  },

  barra: {
    height: '100%',
    borderRadius: 8,
  },
});
