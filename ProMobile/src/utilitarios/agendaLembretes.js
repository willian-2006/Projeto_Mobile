import { buscarCategoria } from '../dados/categorias';

import { montarListaCategorias } from './categorias';

import { adicionarDias, chaveDia, dataComHorario } from './datas';

import { filtrarTarefasDoDia } from './tarefas';

import { contar } from './textos';

export const DIAS_AGENDADOS = 7;

export const LIMITE_NOTIFICACOES = 60;

function resumoDoDia(tarefasDoDia, meta, ehHoje) {
  if (!ehHoje) {
    return tarefasDoDia.length > 0
      ? `${contar(tarefasDoDia.length, 'tarefa')} para hoje. Meta: ${meta} pontos.`
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

  const falta = `${faltam === 1 ? 'Falta' : 'Faltam'} ${contar(faltam, 'ponto')}`;

  if (pendentes === 0) {
    return `${falta} para a meta de hoje.`;
  }

  return `${falta} para a meta. ${contar(pendentes, 'tarefa')} por fazer.`;
}

export function montarAgenda(tarefas, preferencias, agora = new Date()) {
  if (!preferencias.lembretesAtivos) {
    return [];
  }

  const hoje = chaveDia(agora);

  const categorias = montarListaCategorias(
    preferencias.categoriasPersonalizadas
  );

  const agenda = [];

  for (let indice = 0; indice < DIAS_AGENDADOS; indice += 1) {
    const dia = adicionarDias(hoje, indice);

    const ehHoje = indice === 0;

    const tarefasDoDia = filtrarTarefasDoDia(tarefas, dia).filter(
      tarefa =>
        ehHoje || !(tarefa.recorrencia?.tipo === 'unica' && tarefa.concluida)
    );

    tarefasDoDia.forEach(tarefa => {
      if (!tarefa.lembrete || !tarefa.horario || (ehHoje && tarefa.concluida)) {
        return;
      }

      const data = dataComHorario(dia, tarefa.horario);

      if (data > agora) {
        const categoria = buscarCategoria(tarefa.categoria, categorias);

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
