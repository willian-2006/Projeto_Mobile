import { useEffect, useState } from 'react';

import { AppState } from 'react-native';

import { chaveDia, msAteMeiaNoite } from '../utilitarios/datas';

// Data de hoje ('AAAA-MM-DD'). Atualiza à meia-noite (com o app
// aberto) e quando o app volta do segundo plano.
export function useHoje() {
  const [hoje, setHoje] = useState(() => chaveDia());

  useEffect(() => {
    let temporizador;

    function agendarMeiaNoite() {
      clearTimeout(temporizador);

      // +1s de folga para já estar no dia seguinte.
      temporizador = setTimeout(() => {
        setHoje(chaveDia());
        agendarMeiaNoite();
      }, msAteMeiaNoite() + 1000);
    }

    agendarMeiaNoite();

    const assinatura = AppState.addEventListener('change', estado => {
      if (estado === 'active') {
        setHoje(chaveDia());
        agendarMeiaNoite();
      }
    });

    return () => {
      clearTimeout(temporizador);
      assinatura.remove();
    };
  }, []);

  return hoje;
}
