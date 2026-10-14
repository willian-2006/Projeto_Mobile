import { LIMITE_HISTORICO, registrarDia, virarDia } from '../viradaDoDia';

const diaria = (id, pontos, concluida, categoria = 'saude') => ({
  id,
  titulo: id,
  categoria,
  pontos,
  concluida,
  recorrencia: { tipo: 'diaria', dias: [] },
});

const tarefas = [
  diaria('a', 10, true),
  diaria('b', 20, false, 'estudos'),
  {
    ...diaria('c', 30, true, 'trabalho'),
    recorrencia: { tipo: 'semanal', dias: [4] },
  },
  { ...diaria('d', 5, true), recorrencia: { tipo: 'unica', dias: [] } },
  { ...diaria('e', 5, false), recorrencia: { tipo: 'unica', dias: [] } },
];

describe('registrarDia', () => {
  it('conta só as tarefas daquele dia', () => {
    expect(registrarDia(tarefas, '2026-10-14', 20)).toEqual({
      data: '2026-10-14',
      pontos: 15,
      meta: 20,
      concluidas: 2,
      total: 4,
      porCategoria: { saude: 15, estudos: 0, trabalho: 0, devocional: 0 },
    });
  });
});

describe('virarDia', () => {
  const dados = { tarefas, historico: [], ultimoDia: '2026-10-14' };

  it('não muda nada no mesmo dia', () => {
    expect(virarDia(dados, '2026-10-14', 20)).toBe(dados);
  });

  it('na primeira abertura só guarda a data', () => {
    const resultado = virarDia({ ...dados, ultimoDia: null }, '2026-10-14', 20);

    expect(resultado.ultimoDia).toBe('2026-10-14');
    expect(resultado.historico).toEqual([]);
    expect(resultado.tarefas).toBe(tarefas);
  });

  it('se o relógio voltou no tempo, não registra nada', () => {
    const resultado = virarDia(dados, '2026-10-10', 20);

    expect(resultado.ultimoDia).toBe('2026-10-10');
    expect(resultado.historico).toEqual([]);
  });

  it('fecha o dia anterior e reabre as tarefas', () => {
    const resultado = virarDia(dados, '2026-10-15', 20);

    expect(resultado.ultimoDia).toBe('2026-10-15');
    expect(resultado.historico).toHaveLength(1);
    expect(resultado.historico[0]).toMatchObject({
      data: '2026-10-14',
      pontos: 15,
    });
    expect(resultado.tarefas.some(tarefa => tarefa.concluida)).toBe(false);
  });

  it('remove as tarefas de uma vez já concluídas', () => {
    const ids = virarDia(dados, '2026-10-15', 20).tarefas.map(t => t.id);

    expect(ids).toEqual(['a', 'b', 'c', 'e']);
  });

  it('dias pulados ficam sem registro', () => {
    const resultado = virarDia(dados, '2026-10-20', 20);

    expect(resultado.historico.map(registro => registro.data)).toEqual([
      '2026-10-14',
    ]);
  });

  it('substitui um registro repetido do mesmo dia e mantém a ordem', () => {
    const historico = [
      { data: '2026-10-14', pontos: 0, meta: 20 },
      { data: '2026-10-12', pontos: 5, meta: 20 },
    ];

    const resultado = virarDia({ ...dados, historico }, '2026-10-15', 20);

    expect(resultado.historico.map(registro => registro.data)).toEqual([
      '2026-10-12',
      '2026-10-14',
    ]);
    expect(resultado.historico[1].pontos).toBe(15);
  });

  it('limita o tamanho do histórico', () => {
    const historico = Array.from({ length: LIMITE_HISTORICO }, (_, i) => ({
      data: `2020-01-${String((i % 28) + 1).padStart(2, '0')}-${i}`,
      pontos: 0,
      meta: 20,
    }));

    const resultado = virarDia({ ...dados, historico }, '2026-10-15', 20);

    expect(resultado.historico).toHaveLength(LIMITE_HISTORICO);
    expect(resultado.historico.at(-1).data).toBe('2026-10-14');
  });
});
