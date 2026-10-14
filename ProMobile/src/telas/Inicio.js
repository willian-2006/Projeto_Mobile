import React, { useCallback } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';

import CartaoProgresso from '../componentes/CartaoProgresso';

import CartaoCategoria from '../componentes/CartaoCategoria';

import EstadoVazio from '../componentes/EstadoVazio';

import ListaTarefas from '../componentes/ListaTarefas';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { useEstilos } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { ordenarCategorias } from '../utilitarios/preferencias';

import { contar } from '../utilitarios/textos';

export default function Inicio({ navigation }) {
  const estilos = useEstilos(criarEstilos);

  const { tarefasDeHoje } = useTarefas();

  const estatisticas = useEstatisticas();

  const { preferencias } = usePreferencias();

  const categorias = ordenarCategorias(
    CATEGORIAS,
    preferencias.categoriasFavoritas
  );

  const abrirCategoria = useCallback(
    chave => navigation.navigate('Categoria', { chave }),
    [navigation]
  );

  const cabecalhoLista = (
    <View>
      <Cabecalho />

      <CartaoProgresso
        pontosAtuais={estatisticas.pontosAtuais}
        meta={estatisticas.meta}
      />

      <View style={estilos.cabecalhoSecao}>
        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Sua rotina de hoje
        </Text>

        <Text style={estilos.contador}>
          {estatisticas.concluidas}/{estatisticas.total}
        </Text>
      </View>

      <View style={estilos.categorias}>
        {categorias.map((categoria, indice) => (
          <CartaoCategoria
            key={categoria.chave}
            chave={categoria.chave}
            titulo={categoria.titulo}
            icone={categoria.icone}
            tarefas={estatisticas.porCategoria[categoria.chave].tarefas}
            pontos={estatisticas.porCategoria[categoria.chave].pontos}
            indice={indice}
            aoPressionar={abrirCategoria}
          />
        ))}
      </View>

      <View style={estilos.cabecalhoSecao}>
        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Tarefas de hoje
        </Text>

        <Text style={estilos.contadorTarefas}>
          {contar(estatisticas.concluidas, 'concluída', 'concluídas')}
        </Text>
      </View>
    </View>
  );

  return (
    <Tela edges={['top']}>
      <ListaTarefas
        tarefas={tarefasDeHoje}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone="sparkles-outline"
            titulo="Dia livre por aqui"
            subtitulo="Toque em uma categoria e crie sua primeira tarefa"
          />
        }
        contentContainerStyle={estilos.conteudoRolagem}
      />
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

    cabecalhoSecao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tema.espaco.lg,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
    },

    contador: {
      ...tema.tipografia.legendaDestaque,
      ...tema.tipografia.numeros,
      fontSize: 13,
      color: tema.cores.principal,
    },

    categorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: tema.espaco.md,
    },

    contadorTarefas: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
    },
  });
