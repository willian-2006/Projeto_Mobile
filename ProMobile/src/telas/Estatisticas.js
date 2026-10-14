import React, { useMemo } from 'react';

import { View, Text, ScrollView, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import BarraProgresso from '../componentes/BarraProgresso';

import CabecalhoTela from '../componentes/CabecalhoTela';

import CalendarioCalor from '../componentes/CalendarioCalor';

import Cartao from '../componentes/Cartao';

import CartaoProgresso from '../componentes/CartaoProgresso';

import DistribuicaoCategorias from '../componentes/DistribuicaoCategorias';

import GraficoSemana from '../componentes/GraficoSemana';

import IconeGradiente from '../componentes/IconeGradiente';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import {
  useEstatisticas,
  useSequencia,
  useTarefas,
} from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { entradaCascata } from '../estilos/movimento';

import {
  calendarioDoMes,
  distribuicaoPorCategoria,
  pontosDaSemana,
} from '../utilitarios/estatisticas';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

import { ordenarCategorias } from '../utilitarios/preferencias';

import { registrarDia } from '../utilitarios/viradaDoDia';

function textoDias(quantidade) {
  return quantidade === 1 ? '1 dia' : `${quantidade} dias`;
}

export default function Estatisticas() {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { tarefas, historico, hoje } = useTarefas();

  const { preferencias } = usePreferencias();

  const estatisticas = useEstatisticas();

  const sequencia = useSequencia();

  const { semana, distribuicao, calendario } = useMemo(() => {
    const registroHoje = registrarDia(tarefas, hoje, preferencias.meta);

    return {
      semana: pontosDaSemana(historico, registroHoje),
      distribuicao: distribuicaoPorCategoria(historico, registroHoje),
      calendario: calendarioDoMes(historico, registroHoje),
    };
  }, [tarefas, historico, hoje, preferencias.meta]);

  const mediaSemana = Math.round(
    semana.reduce((soma, dia) => soma + dia.pontos, 0) / semana.length
  );

  const categorias = ordenarCategorias(
    CATEGORIAS,
    preferencias.categoriasFavoritas
  );

  return (
    <Tela edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela
          titulo="Estatísticas"
          subtitulo="Seu progresso e sua constância"
        />

        <CartaoProgresso
          pontosAtuais={estatisticas.pontosAtuais}
          meta={estatisticas.meta}
        />

        <View style={estilos.linhaSequencia}>
          <Cartao style={estilos.cartaoSequencia}>
            <IconeGradiente
              icone="flame"
              gradiente={tema.categorias.trabalho.gradiente}
              tamanho={38}
              tamanhoIcone={18}
            />

            <Text style={estilos.numeroSequencia}>
              {textoDias(sequencia.atual)}
            </Text>

            <Text style={estilos.rotuloSequencia}>Sequência atual</Text>
          </Cartao>

          <Cartao style={estilos.cartaoSequencia}>
            <IconeGradiente icone="trophy" tamanho={38} tamanhoIcone={18} />

            <Text style={estilos.numeroSequencia}>
              {textoDias(sequencia.recorde)}
            </Text>

            <Text style={estilos.rotuloSequencia}>Recorde pessoal</Text>
          </Cartao>
        </View>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Últimos 7 dias
        </Text>

        <Cartao style={estilos.cartao}>
          <GraficoSemana dias={semana} meta={estatisticas.meta} />

          <Text style={estilos.legenda}>
            Média de {mediaSemana} pts por dia • linha verde: meta
          </Text>
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Pontos por categoria
        </Text>

        <Cartao style={estilos.cartao}>
          <DistribuicaoCategorias totais={distribuicao} />

          <Text style={estilos.legenda}>Somando os últimos 7 dias</Text>
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          {calendario.titulo}
        </Text>

        <Cartao style={estilos.cartao}>
          <CalendarioCalor calendario={calendario} />
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Hoje por categoria
        </Text>

        {categorias.map((categoria, indice) => {
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
              <Cartao style={estilos.cartaoCategoria}>
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

    linhaSequencia: {
      flexDirection: 'row',
      gap: tema.espaco.md,
      marginBottom: tema.espaco.xxl - 4,
    },

    cartaoSequencia: {
      flex: 1,
      padding: tema.espaco.lg,
    },

    numeroSequencia: {
      ...tema.tipografia.numeros,
      fontSize: 22,
      color: tema.cores.texto,
      marginTop: tema.espaco.md,
    },

    rotuloSequencia: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: 2,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
      marginBottom: tema.espaco.md,
    },

    cartao: {
      padding: tema.espaco.lg,
      marginBottom: tema.espaco.xxl - 4,
    },

    legenda: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.md,
    },

    cartaoCategoria: {
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
