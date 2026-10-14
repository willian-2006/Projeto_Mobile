import { calcularEstatisticas } from './pontuacao';

import { filtrarTarefasDoDia } from './tarefas';

export const LIMITE_HISTORICO = 400;

export function registrarDia(tarefas, chave, meta) {
  const estatisticas = calcularEstatisticas(
    filtrarTarefasDoDia(tarefas, chave)
  );

  const porCategoria = {};

  Object.entries(estatisticas.porCategoria).forEach(([categoria, resumo]) => {
    porCategoria[categoria] = resumo.pontosConcluidos;
  });

  return {
    data: chave,
    pontos: estatisticas.pontosAtuais,
    meta,
    concluidas: estatisticas.concluidas,
    total: estatisticas.total,
    porCategoria,
  };
}

export function virarDia(dados, hoje, meta) {
  const { tarefas, historico, ultimoDia } = dados;

  if (ultimoDia === hoje) {
    return dados;
  }

  if (!ultimoDia || ultimoDia > hoje) {
    return { ...dados, ultimoDia: hoje };
  }

  const registro = registrarDia(tarefas, ultimoDia, meta);

  const novoHistorico = [
    ...historico.filter(item => item.data !== ultimoDia),
    registro,
  ]
    .sort((a, b) => (a.data < b.data ? -1 : 1))
    .slice(-LIMITE_HISTORICO);

  const novasTarefas = tarefas
    .filter(
      tarefa => !(tarefa.recorrencia?.tipo === 'unica' && tarefa.concluida)
    )
    .map(tarefa =>
      tarefa.concluida ? { ...tarefa, concluida: false } : tarefa
    );

  return {
    tarefas: novasTarefas,
    historico: novoHistorico,
    ultimoDia: hoje,
  };
}
