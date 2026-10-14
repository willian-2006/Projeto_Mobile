import { calcularSequencia, metaBatida } from '../sequencia';

const HOJE = '2026-10-14';

const dia = (data, pontos, meta = 50) => ({ data, pontos, meta });

describe('metaBatida', () => {
  it('compara pontos com a meta do dia', () => {
    expect(metaBatida(dia(HOJE, 50))).toBe(true);
    expect(metaBatida(dia(HOJE, 49))).toBe(false);
    expect(metaBatida(dia(HOJE, 10, 0))).toBe(false);
  });
});

describe('calcularSequencia', () => {
  const historico = [
    dia('2026-10-08', 60),
    dia('2026-10-09', 60),
    dia('2026-10-10', 60),
    dia('2026-10-11', 10), // quebrou
    dia('2026-10-12', 50),
    dia('2026-10-13', 70),
  ];

  it('sem histórico tudo é zero', () => {
    expect(calcularSequencia([], HOJE, false)).toEqual({
      atual: 0,
      recorde: 0,
    });
  });

  it('a sequência de ontem continua valendo enquanto hoje não acaba', () => {
    expect(calcularSequencia(historico, HOJE, false)).toEqual({
      atual: 2,
      recorde: 3,
    });
  });

  it('hoje entra na conta quando a meta é batida', () => {
    expect(calcularSequencia(historico, HOJE, true).atual).toBe(3);
  });

  it('o recorde inclui a sequência atual', () => {
    expect(
      calcularSequencia(
        [...historico, dia('2026-10-14', 50)],
        '2026-10-15',
        true
      )
    ).toEqual({ atual: 4, recorde: 4 });
  });

  it('um dia sem registro quebra a sequência', () => {
    const comBuraco = [dia('2026-10-11', 60), dia('2026-10-13', 60)];

    expect(calcularSequencia(comBuraco, HOJE, false)).toEqual({
      atual: 1,
      recorde: 1,
    });
  });

  it('a sequência zera se ontem a meta não foi batida', () => {
    expect(calcularSequencia([dia('2026-10-13', 10)], HOJE, false).atual).toBe(
      0
    );
  });
});
