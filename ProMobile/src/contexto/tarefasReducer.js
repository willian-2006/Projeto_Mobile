import { moverTarefa } from '../utilitarios/tarefas';

import { virarDia } from '../utilitarios/viradaDoDia';

export const ACOES = {
  adicionar: 'adicionar',
  alternar: 'alternar',
  excluir: 'excluir',
  editar: 'editar',
  reinserir: 'reinserir',
  reordenar: 'reordenar',
  restaurar: 'restaurar',
  virarDia: 'virarDia',
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

    // Desfazer exclusão: devolve a tarefa à posição em que estava.
    case ACOES.reinserir: {
      if (tarefas.some(tarefa => tarefa.id === acao.tarefa.id)) {
        return tarefas;
      }

      const indice = Math.min(Math.max(acao.indice, 0), tarefas.length);

      return [
        ...tarefas.slice(0, indice),
        acao.tarefa,
        ...tarefas.slice(indice),
      ];
    }

    case ACOES.reordenar:
      return moverTarefa(tarefas, acao.idOrigem, acao.idDestino);

    default:
      return tarefas;
  }
}

// Estado completo: { tarefas, historico, ultimoDia }.
export function dadosReducer(dados, acao) {
  switch (acao.tipo) {
    // Substitui tudo (ex.: dados carregados do armazenamento).
    case ACOES.restaurar:
      return acao.dados;

    case ACOES.virarDia:
      return virarDia(dados, acao.hoje, acao.meta);

    default: {
      const tarefas = tarefasReducer(dados.tarefas, acao);

      return tarefas === dados.tarefas ? dados : { ...dados, tarefas };
    }
  }
}
