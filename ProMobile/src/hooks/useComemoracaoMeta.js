import { useEffect, useRef, useState } from 'react';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { vibrarMeta } from '../servicos/vibracao';

export function useComemoracaoMeta() {
  const { carregando, hoje } = useTarefas();

  const { metaBatida } = useEstatisticas();

  const [comemoracao, setComemoracao] = useState(0);

  const anterior = useRef(null);

  const diaAnterior = useRef(hoje);

  useEffect(() => {
    if (carregando) {
      return;
    }

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
