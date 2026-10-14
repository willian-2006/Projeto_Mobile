import { CATEGORIAS } from '../dados/categorias';

export function calcularEstatisticas(tarefas) {
  const porCategoria = {};

  CATEGORIAS.forEach(categoria => {
    porCategoria[categoria.chave] = {
      tarefas: 0,
      concluidas: 0,
      pontos: 0,
      pontosConcluidos: 0,
    };
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

    const resumo = porCategoria[tarefa.categoria];

    if (resumo) {
      resumo.tarefas += 1;
      resumo.pontos += tarefa.pontos;

      if (tarefa.concluida) {
        resumo.concluidas += 1;
        resumo.pontosConcluidos += tarefa.pontos;
      }
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
