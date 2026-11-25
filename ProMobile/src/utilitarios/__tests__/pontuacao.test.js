import {
  RESUMO_CATEGORIA_VAZIO,
  calcularEstatisticas,
  calcularPorcentagem,
  resumoDaCategoria,
} from '../pontuacao';

const tarefas = [
  { id: 'a', categoria: 'saude', pontos: 10, concluida: true },
  { id: 'b', categoria: 'estudos', pontos: 20, concluida: false },
  { id: 'c', categoria: 'estudos', pontos: 15, concluida: true },
];

describe('calcularEstatisticas', () => {
  it('calcula os totais gerais', () => {
    const estatisticas = calcularEstatisticas(tarefas);

    expect(estatisticas.total).toBe(3);
    expect(estatisticas.concluidas).toBe(2);
    expect(estatisticas.pontosMaximos).toBe(45);
    expect(estatisticas.pontosAtuais).toBe(25);
  });

  it('resume cada categoria', () => {
    const { porCategoria } = calcularEstatisticas(tarefas);

    expect(porCategoria.estudos).toEqual({
      tarefas: 2,
      concluidas: 1,
      pontos: 35,
      pontosConcluidos: 15,
    });

    expect(porCategoria.saude.pontosConcluidos).toBe(10);
  });

  it('traz todas as categorias zeradas para lista vazia', () => {
    const estatisticas = calcularEstatisticas([]);

    expect(estatisticas.total).toBe(0);
    expect(estatisticas.pontosMaximos).toBe(0);
    expect(estatisticas.pontosAtuais).toBe(0);
    expect(Object.keys(estatisticas.porCategoria)).toEqual([
      'saude',
      'estudos',
      'trabalho',
      'devocional',
    ]);
    expect(estatisticas.porCategoria.trabalho.tarefas).toBe(0);
  });

  it('resume categorias personalizadas e as conta na meta', () => {
    const estatisticas = calcularEstatisticas([
      { id: 'x', categoria: 'pers-1', pontos: 5, concluida: true },
      { id: 'y', categoria: 'saude', pontos: 10, concluida: false },
    ]);

    expect(estatisticas.pontosAtuais).toBe(5);
    expect(estatisticas.pontosMaximos).toBe(15);
    expect(estatisticas.porCategoria['pers-1']).toEqual({
      tarefas: 1,
      concluidas: 1,
      pontos: 5,
      pontosConcluidos: 5,
    });
  });

  it('inicia zeradas as categorias pedidas', () => {
    const estatisticas = calcularEstatisticas([], ['saude', 'pers-2']);

    expect(Object.keys(estatisticas.porCategoria)).toEqual(['saude', 'pers-2']);
  });
});

describe('resumoDaCategoria', () => {
  it('devolve um resumo zerado para categoria sem tarefas', () => {
    expect(resumoDaCategoria(calcularEstatisticas([]), 'pers-9')).toEqual(
      RESUMO_CATEGORIA_VAZIO
    );
  });
});

describe('calcularPorcentagem', () => {
  it('arredonda a porcentagem', () => {
    expect(calcularPorcentagem(25, 45)).toBe(56);
  });

  it('retorna 100 quando tudo está concluído', () => {
    expect(calcularPorcentagem(45, 45)).toBe(100);
  });

  it('nunca passa de 100', () => {
    expect(calcularPorcentagem(60, 45)).toBe(100);
  });

  it('retorna 0 sem pontos possíveis (lista vazia)', () => {
    expect(calcularPorcentagem(0, 0)).toBe(0);
  });
});
