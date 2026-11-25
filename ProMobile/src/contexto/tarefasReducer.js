import { moverTarefa } from '../utilitarios/tarefas';

import { virarDia } from '../utilitarios/viradaDoDia';

export const ACOES = {
  adicionar: 'adicionar',
  alternar: 'alternar',
  excluir: 'excluir',
  excluirDaCategoria: 'excluirDaCategoria',
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

    case ACOES.excluirDaCategoria: {
      const restantes = tarefas.filter(
        tarefa => tarefa.categoria !== acao.categoria
      );

      return restantes.length === tarefas.length ? tarefas : restantes;
    }

    case ACOES.editar:
      return tarefas.map(tarefa =>
        tarefa.id === acao.id
          ? { ...tarefa, ...acao.alteracoes, id: tarefa.id }
          : tarefa
      );

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

export function dadosReducer(dados, acao) {
  switch (acao.tipo) {
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
