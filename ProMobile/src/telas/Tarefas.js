import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import CabecalhoTela from '../componentes/CabecalhoTela';

import EstadoVazio from '../componentes/EstadoVazio';

import ListaTarefas from '../componentes/ListaTarefas';

import Tela from '../componentes/Tela';

import { useTarefas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { vibrarSelecao } from '../servicos/vibracao';

const TODAS = 'todas';

const filtros = [{ chave: TODAS, titulo: 'Todas' }, ...CATEGORIAS];

export default function Tarefas({ navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { tarefas } = useTarefas();

  const [filtro, setFiltro] = useState(TODAS);

  const tarefasFiltradas = useMemo(
    () =>
      filtro === TODAS
        ? tarefas
        : tarefas.filter(tarefa => tarefa.categoria === filtro),
    [tarefas, filtro]
  );

  function corDoFiltro(chave) {
    return chave === TODAS
      ? { cor: tema.cores.principal, corSuave: tema.cores.principalSuave }
      : tema.categorias[chave];
  }

  const cabecalhoLista = (
    <View>
      <CabecalhoTela
        titulo="Tarefas"
        subtitulo={`${tarefasFiltradas.length} ${
          tarefasFiltradas.length === 1 ? 'tarefa' : 'tarefas'
        }`}
        acao={{
          icone: 'add',
          rotulo: 'Nova tarefa',
          aoPressionar: () =>
            navigation.navigate('EditorTarefa', {
              categoria: filtro === TODAS ? undefined : filtro,
            }),
        }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.filtros}
      >
        {filtros.map(item => {
          const ativo = filtro === item.chave;

          const cores = corDoFiltro(item.chave);

          return (
            <TouchableOpacity
              key={item.chave}
              style={[
                estilos.pilula,
                ativo && {
                  backgroundColor: cores.corSuave,
                  borderColor: cores.cor,
                },
              ]}
              onPress={() => {
                vibrarSelecao();
                setFiltro(item.chave);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={`Filtrar: ${item.titulo}`}
            >
              <Text
                style={[
                  estilos.textoPilula,
                  ativo && [estilos.textoAtivo, { color: cores.cor }],
                ]}
              >
                {item.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {tarefasFiltradas.length > 1 ? (
        <Text style={estilos.dica}>
          Segure uma tarefa para reordenar • deslize para excluir
        </Text>
      ) : null}
    </View>
  );

  return (
    <Tela edges={['top']}>
      <ListaTarefas
        tarefas={tarefasFiltradas}
        reordenavel
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone="search-outline"
            titulo="Nada por aqui ainda"
            subtitulo="Escolha outro filtro ou toque em + para criar uma tarefa"
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

    filtros: {
      paddingBottom: tema.espaco.lg,
    },

    dica: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginBottom: tema.espaco.md,
    },

    pilula: {
      minHeight: tema.areaToque,
      paddingHorizontal: tema.espaco.lg,
      borderRadius: tema.raio.pilula,
      borderWidth: 1,
      borderColor: tema.cores.borda,
      backgroundColor: tema.cores.superficieVidro,
      justifyContent: 'center',
      marginRight: tema.espaco.sm,
    },

    textoPilula: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.textoSecundario,
    },

    textoAtivo: {
      fontFamily: tema.fontes.corpoNegrito,
    },
  });
