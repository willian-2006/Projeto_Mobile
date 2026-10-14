import React from 'react';

import { View, Text, ScrollView, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import BarraProgresso from '../componentes/BarraProgresso';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import CartaoProgresso from '../componentes/CartaoProgresso';

import IconeGradiente from '../componentes/IconeGradiente';

import Tela from '../componentes/Tela';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { entradaCascata } from '../estilos/movimento';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

export default function Metas() {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const estatisticas = useEstatisticas();

  return (
    <Tela edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela titulo="Metas" subtitulo="Seu progresso por categoria" />

        <CartaoProgresso
          pontosAtuais={estatisticas.pontosAtuais}
          pontosMaximos={estatisticas.pontosMaximos}
        />

        {CATEGORIAS.map((categoria, indice) => {
          const resumo = estatisticas.porCategoria[categoria.chave];

          const coresCategoria = tema.categorias[categoria.chave];

          const porcentagem = calcularPorcentagem(
            resumo.pontosConcluidos,
            resumo.pontos
          );

          return (
            <Animated.View
              key={categoria.chave}
              entering={entradaCascata(indice)}
            >
              <Cartao style={estilos.cartao}>
                <View style={estilos.topo}>
                  <IconeGradiente
                    icone={categoria.icone}
                    gradiente={coresCategoria.gradiente}
                  />

                  <View style={estilos.textos}>
                    <Text style={estilos.titulo}>{categoria.titulo}</Text>

                    <Text style={estilos.detalhe}>
                      {resumo.concluidas} de {resumo.tarefas} concluídas •{' '}
                      {resumo.pontosConcluidos}/{resumo.pontos} pts
                    </Text>
                  </View>

                  <Text
                    style={[estilos.porcentagem, { color: coresCategoria.cor }]}
                  >
                    {porcentagem}%
                  </Text>
                </View>

                <View style={estilos.barra}>
                  <BarraProgresso
                    porcentagem={porcentagem}
                    gradiente={coresCategoria.gradiente}
                  />
                </View>
              </Cartao>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Tela>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    conteudoRolagem: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xl - 4,
      paddingBottom: tema.espaco.xl - 4,
    },

    cartao: {
      padding: tema.espaco.lg,
      marginBottom: tema.espaco.md,
    },

    topo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    textos: {
      flex: 1,
      marginLeft: tema.espaco.md,
    },

    titulo: {
      ...tema.tipografia.tituloCartao,
      color: tema.cores.texto,
    },

    detalhe: {
      ...tema.tipografia.legenda,
      ...tema.tipografia.numeros,
      fontFamily: tema.fontes.corpo,
      color: tema.cores.textoSecundario,
      marginTop: 2,
    },

    porcentagem: {
      ...tema.tipografia.numeros,
      fontSize: 18,
      marginLeft: tema.espaco.sm,
    },

    barra: {
      marginTop: tema.espaco.md + 2,
    },
  });
