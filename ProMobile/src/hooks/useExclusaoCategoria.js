import { useCallback } from 'react';

import { Alert } from 'react-native';

import { useAviso } from '../contexto/AvisoContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { useCategorias } from './useCategorias';

import { vibrarExclusao } from '../servicos/vibracao';

import { contar } from '../utilitarios/textos';

export function useExclusaoCategoria() {
  const { tarefas } = useTarefas();

  const { aoExcluirCategoria } = useCategorias();

  const { mostrarAviso } = useAviso();

  return useCallback(
    (categoria, aoConcluir) => {
      const vinculadas = tarefas.filter(
        tarefa => tarefa.categoria === categoria.chave
      ).length;

      function excluir() {
        vibrarExclusao();
        aoConcluir?.();
        aoExcluirCategoria(categoria.chave);
        mostrarAviso({ mensagem: `Categoria "${categoria.titulo}" excluída.` });
      }

      Alert.alert(
        `Excluir "${categoria.titulo}"?`,
        vinculadas > 0
          ? `${contar(vinculadas, 'tarefa vinculada', 'tarefas vinculadas')} a esta categoria também ${
              vinculadas === 1 ? 'será excluída' : 'serão excluídas'
            }. Isso não pode ser desfeito.`
          : 'A categoria não tem tarefas. Isso libera uma vaga para uma nova categoria.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: excluir },
        ]
      );
    },
    [tarefas, aoExcluirCategoria, mostrarAviso]
  );
}
