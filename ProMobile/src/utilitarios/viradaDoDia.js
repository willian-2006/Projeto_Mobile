import { calcularEstatisticas } from './pontuacao';

import { filtrarTarefasDoDia } from './tarefas';

// Mais de um ano de histórico já basta para sequência e heatmap.
export const LIMITE_HISTORICO = 400;

// Resultado de um dia, como fica guardado no histórico.
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

// Fecha o dia `ultimoDia` quando a data muda: grava o resultado no
// histórico, reabre as tarefas recorrentes e tira as tarefas de
// "uma vez" já concluídas. Dias em que o app não foi aberto ficam
// sem registro (contam como meta não batida).
export function virarDia(dados, hoje, meta) {
  const { tarefas, historico, ultimoDia } = dados;

  if (ultimoDia === hoje) {
    return dados;
  }

  // Primeira abertura, ou relógio do aparelho voltou no tempo:
  // só atualiza a data, sem mexer no histórico.
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
