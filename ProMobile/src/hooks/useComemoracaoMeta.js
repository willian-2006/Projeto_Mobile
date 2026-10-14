import { useEffect, useRef, useState } from 'react';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { vibrarMeta } from '../servicos/vibracao';

export function useComemoracaoMeta() {
  const { carregando, hoje } = useTarefas();

  const { metaBatida, pontosAtuais } = useEstatisticas();

  const [comemoracao, setComemoracao] = useState(0);

  const anterior = useRef(null);

  const diaAnterior = useRef(hoje);

  const pontosAnteriores = useRef(pontosAtuais);

  useEffect(() => {
    if (carregando) {
      return;
    }

    const mesmoDia = diaAnterior.current === hoje;

    const ganhouPontos = pontosAtuais > pontosAnteriores.current;

    if (mesmoDia && ganhouPontos && anterior.current === false && metaBatida) {
      vibrarMeta();
      setComemoracao(valor => valor + 1);
    }

    anterior.current = metaBatida;
    diaAnterior.current = hoje;
    pontosAnteriores.current = pontosAtuais;
  }, [metaBatida, pontosAtuais, carregando, hoje]);

  return comemoracao;
}
