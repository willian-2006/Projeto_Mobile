import { CATEGORIAS } from '../dados/categorias';

export const RESUMO_CATEGORIA_VAZIO = Object.freeze({
  tarefas: 0,
  concluidas: 0,
  pontos: 0,
  pontosConcluidos: 0,
});

export function resumoDaCategoria(estatisticas, chave) {
  return estatisticas.porCategoria[chave] ?? RESUMO_CATEGORIA_VAZIO;
}

export function calcularEstatisticas(
  tarefas,
  chaves = CATEGORIAS.map(categoria => categoria.chave)
) {
  const porCategoria = {};

  chaves.forEach(chave => {
    porCategoria[chave] = { ...RESUMO_CATEGORIA_VAZIO };
  });

  let pontosMaximos = 0;
  let pontosAtuais = 0;
  let concluidas = 0;

  tarefas.forEach(tarefa => {
    pontosMaximos += tarefa.pontos;

    if (tarefa.concluida) {
      pontosAtuais += tarefa.pontos;
      concluidas += 1;
    }

    if (typeof tarefa.categoria !== 'string') {
      return;
    }

    porCategoria[tarefa.categoria] ??= { ...RESUMO_CATEGORIA_VAZIO };

    const resumo = porCategoria[tarefa.categoria];

    resumo.tarefas += 1;
    resumo.pontos += tarefa.pontos;

    if (tarefa.concluida) {
      resumo.concluidas += 1;
      resumo.pontosConcluidos += tarefa.pontos;
    }
  });

  return {
    total: tarefas.length,
    concluidas,
    pontosMaximos,
    pontosAtuais,
    porCategoria,
  };
}

export function calcularPorcentagem(pontosAtuais, pontosMaximos) {
  if (pontosMaximos <= 0) {
    return 0;
  }

  return Math.min(Math.round((pontosAtuais / pontosMaximos) * 100), 100);
}
