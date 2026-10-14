import React, { useCallback } from 'react';

import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ReorderableList, {
  useReorderableDrag,
} from 'react-native-reorderable-list';

import ItemTarefa from './ItemTarefa';

import { useTarefas } from '../contexto/TarefasContexto';

import { vibrarSelecao } from '../servicos/vibracao';

// Só pode ser renderizado dentro da ReorderableList (usa o contexto dela).
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

// Lista de tarefas com o cabeçalho da tela em `ListHeaderComponent`.
// Com `reordenavel`, segurar e arrastar muda a ordem (a ordem vale
// para a lista completa, mesmo quando `tarefas` está filtrada).
export default function ListaTarefas({ tarefas, reordenavel, ...resto }) {
  const navigation = useNavigation();

  const { aoAlternar, aoExcluir, aoReordenar } = useTarefas();

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
        />
      );
    },
    [reordenavel, aoAlternar, aoExcluir, aoAbrir]
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
