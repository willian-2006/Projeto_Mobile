import {
  PONTOS_PADRAO,
  PRIORIDADES,
  PRIORIDADE_PADRAO,
  RECORRENCIA_PADRAO,
  TIPOS_RECORRENCIA,
} from '../dados/opcoesTarefa';

import { diaDaSemana, horarioValido, NOMES_DIAS } from './datas';

function normalizarRecorrencia(recorrencia) {
  const tipo = TIPOS_RECORRENCIA.some(item => item.chave === recorrencia?.tipo)
    ? recorrencia.tipo
    : RECORRENCIA_PADRAO.tipo;

  if (tipo !== 'semanal') {
    return { tipo, dias: [] };
  }

  const dias = [...new Set(recorrencia.dias || [])]
    .filter(dia => Number.isInteger(dia) && dia >= 0 && dia <= 6)
    .sort((a, b) => a - b);

  // "Dias da semana" sem nenhum dia vira "todo dia".
  return dias.length > 0 ? { tipo, dias } : { ...RECORRENCIA_PADRAO };
}

// Completa os campos que faltam (tarefas antigas ou dados
// incompletos) e descarta valores inválidos.
export function normalizarTarefa(tarefa, hoje) {
  const pontos = Number(tarefa.pontos);

  const horario = horarioValido(tarefa.horario) ? tarefa.horario : null;

  return {
    id: String(tarefa.id),
    titulo: String(tarefa.titulo ?? '').trim(),
    categoria: tarefa.categoria,
    pontos: Number.isFinite(pontos) && pontos > 0 ? pontos : PONTOS_PADRAO,
    concluida: Boolean(tarefa.concluida),
    prioridade: PRIORIDADES.some(item => item.chave === tarefa.prioridade)
      ? tarefa.prioridade
      : PRIORIDADE_PADRAO,
    horario,
    recorrencia: normalizarRecorrencia(tarefa.recorrencia),
    // Sem horário não há quando avisar.
    lembrete: horario !== null && Boolean(tarefa.lembrete),
    criadaEm: tarefa.criadaEm || hoje,
  };
}

// A tarefa aparece (e conta para a meta) no dia `chave`?
export function tarefaDoDia(tarefa, chave) {
  if (tarefa.recorrencia?.tipo === 'semanal') {
    return tarefa.recorrencia.dias.includes(diaDaSemana(chave));
  }

  return true;
}

export function filtrarTarefasDoDia(tarefas, chave) {
  return tarefas.filter(tarefa => tarefaDoDia(tarefa, chave));
}

// Move a tarefa `idOrigem` para a posição da tarefa `idDestino`.
// Funciona com listas filtradas: só a ordem relativa importa.
export function moverTarefa(tarefas, idOrigem, idDestino) {
  const origem = tarefas.findIndex(tarefa => tarefa.id === idOrigem);

  const destino = tarefas.findIndex(tarefa => tarefa.id === idDestino);

  if (origem === -1 || destino === -1 || origem === destino) {
    return tarefas;
  }

  const resultado = [...tarefas];

  const [movida] = resultado.splice(origem, 1);

  resultado.splice(destino, 0, movida);

  return resultado;
}

export function descreverRecorrencia(recorrencia) {
  if (recorrencia?.tipo === 'unica') {
    return 'Uma vez';
  }

  if (recorrencia?.tipo === 'semanal') {
    const dias = recorrencia.dias;

    if (dias.length === 5 && dias.every(dia => dia >= 1 && dia <= 5)) {
      return 'Dias úteis';
    }

    if (dias.length === 2 && dias[0] === 0 && dias[1] === 6) {
      return 'Fins de semana';
    }

    return dias.map(dia => NOMES_DIAS[dia]).join(', ');
  }

  return 'Todo dia';
}
