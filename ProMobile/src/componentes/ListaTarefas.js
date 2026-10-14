import React, { useCallback, useEffect, useState } from 'react';

import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ReorderableList, {
  useReorderableDrag,
} from 'react-native-reorderable-list';

import ItemTarefa from './ItemTarefa';

import { useTarefas } from '../contexto/TarefasContexto';

import { vibrarSelecao } from '../servicos/vibracao';

const DURACAO_ENTRADA = 1000;

function ItemReordenavel(propriedades) {
  const arrastar = useReorderableDrag();

  const aoSegurar = useCallback(() => {
    vibrarSelecao();
    arrastar();
  }, [arrastar]);

  return <ItemTarefa {...propriedades} aoSegurar={aoSegurar} />;
}

function extrairChave(tarefa) {
  return tarefa.id;
}

export default function ListaTarefas({ tarefas, reordenavel, ...resto }) {
  const navigation = useNavigation();

  const { aoAlternar, aoExcluir, aoReordenar } = useTarefas();

  const [animarEntrada, setAnimarEntrada] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(
      () => setAnimarEntrada(false),
      DURACAO_ENTRADA
    );

    return () => clearTimeout(temporizador);
  }, []);

  const aoAbrir = useCallback(
    id => navigation.navigate('EditorTarefa', { id }),
    [navigation]
  );

  const renderizarTarefa = useCallback(
    ({ item, index }) => {
      const Item = reordenavel ? ItemReordenavel : ItemTarefa;

      return (
        <Item
          tarefa={item}
          indice={index}
          aoAlternar={aoAlternar}
          aoExcluir={aoExcluir}
          aoAbrir={aoAbrir}
          animarEntrada={animarEntrada}
        />
      );
    },
    [reordenavel, aoAlternar, aoExcluir, aoAbrir, animarEntrada]
  );

  const aoSoltar = useCallback(
    ({ from, to }) => {
      if (from !== to) {
        aoReordenar(tarefas[from].id, tarefas[to].id);
      }
    },
    [tarefas, aoReordenar]
  );

  if (reordenavel) {
    return (
      <ReorderableList
        data={tarefas}
        keyExtractor={extrairChave}
        renderItem={renderizarTarefa}
        onReorder={aoSoltar}
        showsVerticalScrollIndicator={false}
        {...resto}
      />
    );
  }

  return (
    <FlatList
      data={tarefas}
      keyExtractor={extrairChave}
      renderItem={renderizarTarefa}
      showsVerticalScrollIndicator={false}
      {...resto}
    />
  );
}
