import { useEffect, useRef } from 'react';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { vibrarMeta } from '../servicos/vibracao';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

// Vibra quando o progresso do dia passa a 100% (vale para qualquer
// tela, por isso fica na navegação raiz). Não vibra ao abrir o app
// com a meta já batida: só compara depois do carregamento.
export function useAvisoMeta() {
  const { carregando } = useTarefas();

  const { pontosAtuais, pontosMaximos } = useEstatisticas();

  const metaBatida =
    pontosMaximos > 0 &&
    calcularPorcentagem(pontosAtuais, pontosMaximos) === 100;

  // null = ainda não há estado carregado para comparar.
  const anterior = useRef(null);

  useEffect(() => {
    if (carregando) {
      return;
    }

    if (anterior.current === false && metaBatida) {
      vibrarMeta();
    }

    anterior.current = metaBatida;
  }, [metaBatida, carregando]);
}
