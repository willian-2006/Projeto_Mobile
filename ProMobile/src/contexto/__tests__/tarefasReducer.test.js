import { ACOES, tarefasReducer } from '../tarefasReducer';

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

  it('restaura a lista inteira', () => {
    const salvas = [tarefas[1]];

    expect(
      tarefasReducer(tarefas, { tipo: ACOES.restaurar, tarefas: salvas })
    ).toBe(salvas);
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
