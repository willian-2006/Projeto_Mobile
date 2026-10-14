import { useEffect, useState } from 'react';

import { AppState } from 'react-native';

import { chaveDia, msAteMeiaNoite } from '../utilitarios/datas';

export function useHoje() {
  const [hoje, setHoje] = useState(() => chaveDia());

  useEffect(() => {
    let temporizador;

    function agendarMeiaNoite() {
      clearTimeout(temporizador);

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
