import { ACOES, dadosReducer, tarefasReducer } from '../tarefasReducer';

const tarefas = [
  {
    id: 'a',
    titulo: 'Beber água',
    categoria: 'saude',
    pontos: 10,
    concluida: false,
  },
  {
    id: 'b',
    titulo: 'Estudar',
    categoria: 'estudos',
    pontos: 20,
    concluida: true,
  },
];

describe('tarefasReducer', () => {
  it('adiciona uma tarefa ao final', () => {
    const nova = {
      id: 'c',
      titulo: 'Orar',
      categoria: 'devocional',
      pontos: 10,
      concluida: false,
    };

    const resultado = tarefasReducer(tarefas, {
      tipo: ACOES.adicionar,
      tarefa: nova,
    });

    expect(resultado).toHaveLength(3);
    expect(resultado[2]).toBe(nova);
  });

  it('exclui todas as tarefas de uma categoria', () => {
    const resultado = tarefasReducer(
      [...tarefas, { ...tarefas[0], id: 'c', categoria: 'pers-1' }],
      { tipo: ACOES.excluirDaCategoria, categoria: 'pers-1' }
    );

    expect(resultado.map(tarefa => tarefa.id)).toEqual(['a', 'b']);
  });

  it('mantém a mesma lista se a categoria não tem tarefas', () => {
    const resultado = tarefasReducer(tarefas, {
      tipo: ACOES.excluirDaCategoria,
      categoria: 'pers-9',
    });

    expect(resultado).toBe(tarefas);
  });

  it('alterna só a tarefa indicada', () => {
    const resultado = tarefasReducer(tarefas, {
      tipo: ACOES.alternar,
      id: 'a',
    });

    expect(resultado[0].concluida).toBe(true);
    expect(resultado[1]).toBe(tarefas[1]);
  });

  it('exclui a tarefa indicada', () => {
    const resultado = tarefasReducer(tarefas, { tipo: ACOES.excluir, id: 'a' });

    expect(resultado.map(tarefa => tarefa.id)).toEqual(['b']);
  });

  it('edita campos sem trocar o id', () => {
    const resultado = tarefasReducer(tarefas, {
      tipo: ACOES.editar,
      id: 'b',
      alteracoes: { titulo: 'Estudar Java', pontos: 30, id: 'outro' },
    });

    expect(resultado[1]).toEqual({
      ...tarefas[1],
      titulo: 'Estudar Java',
      pontos: 30,
    });
  });

  it('reinsere a tarefa excluída na mesma posição', () => {
    const semA = tarefasReducer(tarefas, { tipo: ACOES.excluir, id: 'a' });

    const resultado = tarefasReducer(semA, {
      tipo: ACOES.reinserir,
      tarefa: tarefas[0],
      indice: 0,
    });

    expect(resultado).toEqual(tarefas);
  });

  it('não duplica ao reinserir uma tarefa que já existe', () => {
    expect(
      tarefasReducer(tarefas, {
        tipo: ACOES.reinserir,
        tarefa: tarefas[0],
        indice: 1,
      })
    ).toBe(tarefas);
  });

  it('limita o índice ao reinserir', () => {
    const resultado = tarefasReducer([tarefas[1]], {
      tipo: ACOES.reinserir,
      tarefa: tarefas[0],
      indice: 99,
    });

    expect(resultado.map(tarefa => tarefa.id)).toEqual(['b', 'a']);
  });

  it('reordena movendo uma tarefa para a posição de outra', () => {
    const resultado = tarefasReducer(tarefas, {
      tipo: ACOES.reordenar,
      idOrigem: 'b',
      idDestino: 'a',
    });

    expect(resultado.map(tarefa => tarefa.id)).toEqual(['b', 'a']);
  });

  it('não altera o estado com ação desconhecida', () => {
    expect(tarefasReducer(tarefas, { tipo: 'outra' })).toBe(tarefas);
  });

  it('não modifica a lista original', () => {
    const copia = JSON.parse(JSON.stringify(tarefas));

    tarefasReducer(tarefas, { tipo: ACOES.alternar, id: 'a' });
    tarefasReducer(tarefas, { tipo: ACOES.excluir, id: 'b' });

    expect(tarefas).toEqual(copia);
  });
});

describe('dadosReducer', () => {
  const dados = { tarefas, historico: [], ultimoDia: '2026-10-13' };

  it('restaura os dados inteiros', () => {
    const salvos = { tarefas: [tarefas[1]], historico: [], ultimoDia: null };

    expect(dadosReducer(dados, { tipo: ACOES.restaurar, dados: salvos })).toBe(
      salvos
    );
  });

  it('repassa as ações de tarefa', () => {
    const resultado = dadosReducer(dados, { tipo: ACOES.excluir, id: 'a' });

    expect(resultado.tarefas.map(tarefa => tarefa.id)).toEqual(['b']);
    expect(resultado.historico).toBe(dados.historico);
  });

  it('não cria um estado novo com ação desconhecida', () => {
    expect(dadosReducer(dados, { tipo: 'outra' })).toBe(dados);
  });

  it('vira o dia: registra o histórico e reabre as tarefas', () => {
    const resultado = dadosReducer(dados, {
      tipo: ACOES.virarDia,
      hoje: '2026-10-14',
      meta: 20,
    });

    expect(resultado.ultimoDia).toBe('2026-10-14');
    expect(resultado.historico).toHaveLength(1);
    expect(resultado.historico[0]).toMatchObject({
      data: '2026-10-13',
      pontos: 20,
      meta: 20,
    });
    expect(resultado.tarefas.every(tarefa => !tarefa.concluida)).toBe(true);
  });
});
