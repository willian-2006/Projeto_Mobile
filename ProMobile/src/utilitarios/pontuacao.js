export function calcularPontosMaximos(tarefas) {
  return tarefas.reduce((total, tarefa) => total + tarefa.pontos, 0);
}

export function calcularPontosAtuais(tarefas) {
  return tarefas
    .filter(tarefa => tarefa.concluida)
    .reduce((total, tarefa) => total + tarefa.pontos, 0);
}

export function contarConcluidas(tarefas) {
  return tarefas.filter(tarefa => tarefa.concluida).length;
}

// Sem pontos possíveis (lista vazia), o progresso é 0%.
export function calcularPorcentagem(pontosAtuais, pontosMaximos) {
  if (pontosMaximos <= 0) {
    return 0;
  }

  return Math.min(Math.round((pontosAtuais / pontosMaximos) * 100), 100);
}
