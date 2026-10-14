import { useEffect, useRef } from 'react';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { agendarLembretes, cancelarLembretes } from '../servicos/notificacoes';

import { montarAgenda } from '../utilitarios/agendaLembretes';

// Espera as mudanças pararem (ex.: várias tarefas marcadas seguidas)
// antes de refazer a agenda.
const ESPERA = 800;

// Mantém as notificações agendadas de acordo com as tarefas e as
// preferências. Com os lembretes desligados desde a abertura, o
// módulo de notificações nem é carregado.
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
