import { useEffect, useRef } from 'react';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { agendarLembretes, cancelarLembretes } from '../servicos/notificacoes';

import { montarAgenda } from '../utilitarios/agendaLembretes';

const ESPERA = 800;

export function useLembretes() {
  const { tarefas, hoje, carregando } = useTarefas();

  const { preferencias, carregando: carregandoPreferencias } =
    usePreferencias();

  const estavamAtivos = useRef(false);

  useEffect(() => {
    if (carregando || carregandoPreferencias) {
      return undefined;
    }

    if (!preferencias.lembretesAtivos) {
      if (estavamAtivos.current) {
        cancelarLembretes();
      }

      estavamAtivos.current = false;

      return undefined;
    }

    estavamAtivos.current = true;

    const temporizador = setTimeout(() => {
      agendarLembretes(montarAgenda(tarefas, preferencias));
    }, ESPERA);

    return () => clearTimeout(temporizador);
  }, [tarefas, preferencias, hoje, carregando, carregandoPreferencias]);
}
