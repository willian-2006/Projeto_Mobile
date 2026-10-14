import React, { useCallback } from 'react';

import { View, Text, FlatList, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Cabecalho from '../componentes/Cabecalho';

import CartaoProgresso from '../componentes/CartaoProgresso';

import CartaoCategoria from '../componentes/CartaoCategoria';

import EstadoVazio from '../componentes/EstadoVazio';

import ItemTarefa from '../componentes/ItemTarefa';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { CATEGORIAS } from '../dados/categorias';

import { cores } from '../estilos/cores';

export default function Inicio({ navigation }) {
  const { tarefas, aoAlternar, aoExcluir } = useTarefas();

  const estatisticas = useEstatisticas();

  const abrirCategoria = useCallback(
    chave => navigation.navigate('Categoria', { chave }),
    [navigation]
  );

  const renderizarTarefa = useCallback(
    ({ item }) => (
      <ItemTarefa tarefa={item} aoAlternar={aoAlternar} aoExcluir={aoExcluir} />
    ),
    [aoAlternar, aoExcluir]
  );

  const cabecalhoLista = (
    <View>
      <Cabecalho />

      <CartaoProgresso
        pontosAtuais={estatisticas.pontosAtuais}
        pontosMaximos={estatisticas.pontosMaximos}
      />

      <View style={estilos.cabecalhoSecao}>
        <Text style={estilos.tituloSecao}>Sua rotina de hoje</Text>

        <Text style={estilos.contador}>
          {estatisticas.concluidas}/{estatisticas.total}
        </Text>
      </View>

      <View style={estilos.categorias}>
        {CATEGORIAS.map(categoria => (
          <CartaoCategoria
            key={categoria.chave}
            chave={categoria.chave}
            titulo={categoria.titulo}
            icone={categoria.icone}
            tarefas={estatisticas.porCategoria[categoria.chave].tarefas}
            pontos={estatisticas.porCategoria[categoria.chave].pontos}
            corFundo={categoria.corFundo}
            corIcone={categoria.cor}
            aoPressionar={abrirCategoria}
          />
        ))}
      </View>

      <View style={estilos.cabecalhoTarefas}>
        <Text style={estilos.tituloSecao}>Tarefas de hoje</Text>

        <Text style={estilos.contadorTarefas}>
          {estatisticas.concluidas} concluídas
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.areaSegura} edges={['top']}>
      <FlatList
        data={tarefas}
        keyExtractor={tarefa => tarefa.id}
        renderItem={renderizarTarefa}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone="checkmark-done-outline"
            cor={cores.principal}
            titulo="Nenhuma tarefa por aqui"
            subtitulo="Toque em uma categoria para adicionar"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      />
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

  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: '700',
    color: cores.texto,
  },

  contador: {
    fontSize: 13,
    color: cores.principal,
    fontWeight: '600',
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  cabecalhoTarefas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  contadorTarefas: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
});
