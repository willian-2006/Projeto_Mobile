export const ACOES = {
  adicionar: 'adicionar',
  alternar: 'alternar',
  excluir: 'excluir',
  editar: 'editar',
  restaurar: 'restaurar',
};

export function tarefasReducer(tarefas, acao) {
  switch (acao.tipo) {
    case ACOES.adicionar:
      return [...tarefas, acao.tarefa];

    case ACOES.alternar:
      return tarefas.map(tarefa =>
        tarefa.id === acao.id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      );

    case ACOES.excluir:
      return tarefas.filter(tarefa => tarefa.id !== acao.id);

    // O id nunca é alterado, mesmo que venha em `alteracoes`.
    case ACOES.editar:
      return tarefas.map(tarefa =>
        tarefa.id === acao.id
          ? { ...tarefa, ...acao.alteracoes, id: tarefa.id }
          : tarefa
      );

    // Substitui a lista inteira (ex.: dados carregados do armazenamento).
    case ACOES.restaurar:
      return acao.tarefas;

    default:
      return tarefas;
  }
}
