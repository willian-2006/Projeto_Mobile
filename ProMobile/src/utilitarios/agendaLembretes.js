import { buscarCategoria } from '../dados/categorias';

import { adicionarDias, chaveDia, dataComHorario } from './datas';

import { filtrarTarefasDoDia } from './tarefas';

// Agenda notificações com data exata para os próximos dias (em vez
// de repetições do sistema) para poder pular a tarefa já concluída
// hoje e o resumo de um dia com a meta batida. Ela é refeita a cada
// mudança e ao abrir o app.
export const DIAS_AGENDADOS = 7;

// O iOS guarda no máximo 64 notificações agendadas por app.
export const LIMITE_NOTIFICACOES = 60;

function textoTarefas(quantidade) {
  return quantidade === 1 ? '1 tarefa' : `${quantidade} tarefas`;
}

function resumoDoDia(tarefasDoDia, meta, ehHoje) {
  if (!ehHoje) {
    return tarefasDoDia.length > 0
      ? `${textoTarefas(tarefasDoDia.length)} para hoje. Meta: ${meta} pontos.`
      : `Que tal planejar o dia? Sua meta é de ${meta} pontos.`;
  }

  const pontos = tarefasDoDia
    .filter(tarefa => tarefa.concluida)
    .reduce((soma, tarefa) => soma + tarefa.pontos, 0);

  const faltam = meta - pontos;

  if (faltam <= 0) {
    return null;
  }

  const pendentes = tarefasDoDia.filter(tarefa => !tarefa.concluida).length;

  if (pendentes === 0) {
    return `Faltam ${faltam} pontos para a meta de hoje.`;
  }

  return `Faltam ${faltam} pontos para a meta. ${textoTarefas(pendentes)} por fazer.`;
}

// Lista de { id, titulo, corpo, data } a agendar, em ordem de data.
export function montarAgenda(tarefas, preferencias, agora = new Date()) {
  if (!preferencias.lembretesAtivos) {
    return [];
  }

  const hoje = chaveDia(agora);

  const agenda = [];

  for (let indice = 0; indice < DIAS_AGENDADOS; indice += 1) {
    const dia = adicionarDias(hoje, indice);

    const ehHoje = indice === 0;

    const tarefasDoDia = filtrarTarefasDoDia(tarefas, dia);

    tarefasDoDia.forEach(tarefa => {
      // `concluida` só vale para hoje; nos outros dias ela reabre.
      if (!tarefa.lembrete || !tarefa.horario || (ehHoje && tarefa.concluida)) {
        return;
      }

      const data = dataComHorario(dia, tarefa.horario);

      if (data > agora) {
        const categoria = buscarCategoria(tarefa.categoria);

        agenda.push({
          id: `tarefa-${tarefa.id}-${dia}`,
          titulo: tarefa.titulo,
          corpo: categoria
            ? `+${tarefa.pontos} pontos em ${categoria.titulo}`
            : `+${tarefa.pontos} pontos`,
          data,
        });
      }
    });

    if (preferencias.resumoDiario) {
      const data = dataComHorario(dia, preferencias.horarioResumo);

      const corpo = resumoDoDia(tarefasDoDia, preferencias.meta, ehHoje);

      if (data > agora && corpo) {
        agenda.push({
          id: `resumo-${dia}`,
          titulo: 'Resumo do dia',
          corpo,
          data,
        });
      }
    }
  }

  return agenda.sort((a, b) => a.data - b.data).slice(0, LIMITE_NOTIFICACOES);
}
