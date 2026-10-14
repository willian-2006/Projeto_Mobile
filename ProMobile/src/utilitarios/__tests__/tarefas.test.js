import {
  descreverRecorrencia,
  filtrarTarefasDoDia,
  moverTarefa,
  normalizarTarefa,
  tarefaDoDia,
} from '../tarefas';

const HOJE = '2026-10-14';

describe('normalizarTarefa', () => {
  it('completa os campos que faltam', () => {
    expect(
      normalizarTarefa(
        { id: 3, titulo: ' Ler ', categoria: 'estudos', pontos: 20 },
        HOJE
      )
    ).toEqual({
      id: '3',
      titulo: 'Ler',
      categoria: 'estudos',
      pontos: 20,
      concluida: false,
      prioridade: 'media',
      horario: null,
      recorrencia: { tipo: 'diaria', dias: [] },
      lembrete: false,
      criadaEm: HOJE,
    });
  });

  it('descarta valores inválidos', () => {
    const tarefa = normalizarTarefa(
      {
        id: 'a',
        titulo: 'X',
        categoria: 'saude',
        pontos: -3,
        prioridade: 'urgente',
        horario: '99:00',
        lembrete: true,
        recorrencia: { tipo: 'mensal' },
      },
      HOJE
    );

    expect(tarefa.pontos).toBe(10);
    expect(tarefa.prioridade).toBe('media');
    expect(tarefa.horario).toBeNull();
    expect(tarefa.recorrencia).toEqual({ tipo: 'diaria', dias: [] });
  });

  it('desliga o lembrete quando não há horário', () => {
    expect(
      normalizarTarefa({ id: 'a', titulo: 'X', lembrete: true }, HOJE).lembrete
    ).toBe(false);
  });

  it('ordena e limpa os dias da semana', () => {
    expect(
      normalizarTarefa(
        { id: 'a', recorrencia: { tipo: 'semanal', dias: [5, 1, 1, 9] } },
        HOJE
      ).recorrencia
    ).toEqual({ tipo: 'semanal', dias: [1, 5] });
  });

  it('"dias da semana" sem dias vira "todo dia"', () => {
    expect(
      normalizarTarefa(
        { id: 'a', recorrencia: { tipo: 'semanal', dias: [] } },
        HOJE
      ).recorrencia
    ).toEqual({ tipo: 'diaria', dias: [] });
  });

  it('mantém criadaEm já existente', () => {
    expect(
      normalizarTarefa({ id: 'a', criadaEm: '2026-01-01' }, HOJE).criadaEm
    ).toBe('2026-01-01');
  });
});

describe('tarefaDoDia', () => {
  it('diárias e de uma vez aparecem todo dia', () => {
    expect(tarefaDoDia({ recorrencia: { tipo: 'diaria' } }, HOJE)).toBe(true);
    expect(tarefaDoDia({ recorrencia: { tipo: 'unica' } }, HOJE)).toBe(true);
  });

  it('semanais só nos dias escolhidos', () => {
    const tarefa = { recorrencia: { tipo: 'semanal', dias: [1, 3, 5] } };

    expect(tarefaDoDia(tarefa, HOJE)).toBe(true);
    expect(tarefaDoDia(tarefa, '2026-10-15')).toBe(false);
  });

  it('filtra a lista do dia', () => {
    const tarefas = [
      { id: 'a', recorrencia: { tipo: 'diaria', dias: [] } },
      { id: 'b', recorrencia: { tipo: 'semanal', dias: [0] } },
    ];

    expect(filtrarTarefasDoDia(tarefas, HOJE).map(t => t.id)).toEqual(['a']);
  });
});

describe('moverTarefa', () => {
  const tarefas = ['a', 'b', 'c', 'd'].map(id => ({ id }));

  const ids = lista => lista.map(tarefa => tarefa.id);

  it('move para baixo', () => {
    expect(ids(moverTarefa(tarefas, 'a', 'c'))).toEqual(['b', 'c', 'a', 'd']);
  });

  it('move para cima', () => {
    expect(ids(moverTarefa(tarefas, 'd', 'b'))).toEqual(['a', 'd', 'b', 'c']);
  });

  it('funciona com ids de uma lista filtrada', () => {
    expect(ids(moverTarefa(tarefas, 'a', 'd'))).toEqual(['b', 'c', 'd', 'a']);
  });

  it('ignora ids inexistentes ou iguais', () => {
    expect(moverTarefa(tarefas, 'a', 'x')).toBe(tarefas);
    expect(moverTarefa(tarefas, 'b', 'b')).toBe(tarefas);
  });
});

describe('descreverRecorrencia', () => {
  it('descreve cada tipo', () => {
    expect(descreverRecorrencia({ tipo: 'diaria', dias: [] })).toBe('Todo dia');
    expect(descreverRecorrencia({ tipo: 'unica', dias: [] })).toBe('Uma vez');
    expect(
      descreverRecorrencia({ tipo: 'semanal', dias: [1, 2, 3, 4, 5] })
    ).toBe('Dias úteis');
    expect(descreverRecorrencia({ tipo: 'semanal', dias: [0, 6] })).toBe(
      'Fins de semana'
    );
    expect(descreverRecorrencia({ tipo: 'semanal', dias: [1, 3] })).toBe(
      'Seg, Qua'
    );
  });
});
