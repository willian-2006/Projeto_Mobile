import React, { useCallback, useMemo, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CabecalhoTela from '../componentes/CabecalhoTela';

import EstadoVazio from '../componentes/EstadoVazio';

import ItemTarefa from '../componentes/ItemTarefa';

import { useTarefas } from '../contexto/TarefasContexto';

import { CATEGORIAS } from '../dados/categorias';

import { cores } from '../estilos/cores';

const TODAS = 'todas';

const filtros = [
  { chave: TODAS, titulo: 'Todas', cor: cores.principal },
  ...CATEGORIAS,
];

export default function Tarefas() {
  const { tarefas, aoAlternar, aoExcluir } = useTarefas();

  const [filtro, setFiltro] = useState(TODAS);

  const tarefasFiltradas = useMemo(
    () =>
      filtro === TODAS
        ? tarefas
        : tarefas.filter(tarefa => tarefa.categoria === filtro),
    [tarefas, filtro]
  );

  const renderizarTarefa = useCallback(
    ({ item }) => (
      <ItemTarefa tarefa={item} aoAlternar={aoAlternar} aoExcluir={aoExcluir} />
    ),
    [aoAlternar, aoExcluir]
  );

  const cabecalhoLista = (
    <View>
      <CabecalhoTela
        titulo="Tarefas"
        subtitulo={`${tarefasFiltradas.length} ${
          tarefasFiltradas.length === 1 ? 'tarefa' : 'tarefas'
        }`}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.filtros}
      >
        {filtros.map(item => {
          const ativo = filtro === item.chave;

          return (
            <TouchableOpacity
              key={item.chave}
              style={[
                estilos.pilula,
                ativo && { backgroundColor: item.cor, borderColor: item.cor },
              ]}
              onPress={() => setFiltro(item.chave)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
            >
              <Text style={[estilos.textoPilula, ativo && estilos.textoAtivo]}>
                {item.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={estilos.areaSegura} edges={['top']}>
      <FlatList
        data={tarefasFiltradas}
        keyExtractor={tarefa => tarefa.id}
        renderItem={renderizarTarefa}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone="list-outline"
            cor={cores.principal}
            titulo="Nenhuma tarefa encontrada"
            subtitulo="Escolha outra categoria ou adicione uma tarefa"
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

  filtros: {
    paddingBottom: 20,
  },

  pilula: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    marginRight: 8,
  },

  textoPilula: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
  },

  textoAtivo: {
    color: cores.branco,
  },
});
