import { useEffect, useRef, useState } from 'react';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { vibrarMeta } from '../servicos/vibracao';

// Quando a pontuação do dia alcança a meta: vibra e devolve um
// número novo (use como `key` do Confete). Vale para qualquer tela,
// por isso fica na navegação raiz. Não comemora ao abrir o app com
// a meta já batida: só compara depois do carregamento.
export function useComemoracaoMeta() {
  const { carregando, hoje } = useTarefas();

  const { metaBatida } = useEstatisticas();

  const [comemoracao, setComemoracao] = useState(0);

  // null = ainda não há estado carregado para comparar.
  const anterior = useRef(null);

  const diaAnterior = useRef(hoje);

  useEffect(() => {
    if (carregando) {
      return;
    }

    // Na virada do dia o progresso zera: não é uma nova meta batida.
    const mesmoDia = diaAnterior.current === hoje;

    if (mesmoDia && anterior.current === false && metaBatida) {
      vibrarMeta();
      setComemoracao(valor => valor + 1);
    }

    anterior.current = metaBatida;
    diaAnterior.current = hoje;
  }, [metaBatida, carregando, hoje]);

  return comemoracao;
}
