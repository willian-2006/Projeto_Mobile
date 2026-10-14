import {
  calendarioDoMes,
  distribuicaoPorCategoria,
  pontosDaSemana,
} from '../estatisticas';

const registroHoje = {
  data: '2026-10-14',
  pontos: 30,
  meta: 60,
  porCategoria: { saude: 20, estudos: 10 },
};

const historico = [
  {
    data: '2026-10-01',
    pontos: 60,
    meta: 60,
    porCategoria: { saude: 60 },
  },
  {
    data: '2026-10-12',
    pontos: 40,
    meta: 50,
    porCategoria: { trabalho: 40 },
  },
  {
    data: '2026-10-13',
    pontos: 80,
    meta: 50,
    porCategoria: { saude: 30, devocional: 50 },
  },
];

describe('pontosDaSemana', () => {
  it('traz os 7 últimos dias terminando hoje', () => {
    const semana = pontosDaSemana(historico, registroHoje);

    expect(semana).toHaveLength(7);
    expect(semana[0].data).toBe('2026-10-08');
    expect(semana[6]).toMatchObject({
      data: '2026-10-14',
      pontos: 30,
      hoje: true,
      rotulo: 'Q',
    });
  });

  it('dias sem registro valem zero', () => {
    const semana = pontosDaSemana(historico, registroHoje);

    expect(semana[0]).toMatchObject({ pontos: 0, meta: 0, hoje: false });
    expect(semana[5].pontos).toBe(80);
  });
});

describe('distribuicaoPorCategoria', () => {
  it('soma os pontos dos últimos 7 dias, com hoje', () => {
    expect(distribuicaoPorCategoria(historico, registroHoje)).toEqual({
      saude: 50,
      estudos: 10,
      trabalho: 40,
      devocional: 50,
    });
  });

  it('aceita outro período', () => {
    expect(distribuicaoPorCategoria(historico, registroHoje, 1)).toEqual({
      saude: 20,
      estudos: 10,
    });
  });
});

describe('calendarioDoMes', () => {
  const calendario = calendarioDoMes(historico, registroHoje);

  it('tem todos os dias do mês e o deslocamento do dia 1', () => {
    expect(calendario.titulo).toBe('Outubro de 2026');
    expect(calendario.dias).toHaveLength(31);
    expect(calendario.vazios).toBe(4);
  });

  it('calcula a porcentagem da meta em cada dia com registro', () => {
    expect(calendario.dias[0].porcentagem).toBe(100);
    expect(calendario.dias[11].porcentagem).toBe(80);
    expect(calendario.dias[13]).toMatchObject({ porcentagem: 50, hoje: true });
  });

  it('dias sem registro e dias futuros ficam sem valor', () => {
    expect(calendario.dias[1].porcentagem).toBeNull();
    expect(calendario.dias[20].porcentagem).toBeNull();
  });
});
