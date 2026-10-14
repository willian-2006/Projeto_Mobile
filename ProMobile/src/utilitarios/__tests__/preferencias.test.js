import { CATEGORIAS } from '../../dados/categorias';

import { PREFERENCIAS_PADRAO } from '../../dados/preferencias';

import {
  inicialDoNome,
  limitarMeta,
  normalizarPreferencias,
  ordenarCategorias,
  sugerirMeta,
} from '../preferencias';

describe('limitarMeta', () => {
  it('mantém a meta entre 10 e 500, arredondada', () => {
    expect(limitarMeta(0)).toBe(10);
    expect(limitarMeta(9999)).toBe(500);
    expect(limitarMeta(72.4)).toBe(72);
    expect(limitarMeta('abc')).toBe(PREFERENCIAS_PADRAO.meta);
  });
});

describe('sugerirMeta', () => {
  it('sugere cerca de 70% dos pontos do dia, de 10 em 10', () => {
    expect(sugerirMeta(85)).toBe(60);
    expect(sugerirMeta(100)).toBe(70);
  });

  it('usa o padrão quando não há tarefas', () => {
    expect(sugerirMeta(0)).toBe(PREFERENCIAS_PADRAO.meta);
  });

  it('nunca sugere menos que o mínimo', () => {
    expect(sugerirMeta(5)).toBe(10);
  });
});

describe('normalizarPreferencias', () => {
  it('completa um objeto vazio com o padrão', () => {
    expect(normalizarPreferencias({})).toEqual(PREFERENCIAS_PADRAO);
    expect(normalizarPreferencias(null)).toEqual(PREFERENCIAS_PADRAO);
  });

  it('limpa o nome e remove categorias desconhecidas', () => {
    const resultado = normalizarPreferencias({
      nome: '  Ana  ',
      categoriasFavoritas: ['saude', 'lazer'],
    });

    expect(resultado.nome).toBe('Ana');
    expect(resultado.categoriasFavoritas).toEqual(['saude']);
  });

  it('mantém valores válidos', () => {
    const preferencias = {
      ...PREFERENCIAS_PADRAO,
      corAvatar: 'saude',
      meta: 120,
      lembretesAtivos: true,
      resumoDiario: false,
      horarioResumo: '21:30',
      onboardingConcluido: true,
    };

    expect(normalizarPreferencias(preferencias)).toEqual(preferencias);
  });
});

describe('ordenarCategorias', () => {
  it('coloca as favoritas primeiro, mantendo a ordem do resto', () => {
    const chaves = ordenarCategorias(CATEGORIAS, ['devocional', 'estudos']).map(
      categoria => categoria.chave
    );

    expect(chaves).toEqual(['estudos', 'devocional', 'saude', 'trabalho']);
  });
});

describe('inicialDoNome', () => {
  it('usa a primeira letra em maiúscula', () => {
    expect(inicialDoNome(' ana')).toBe('A');
    expect(inicialDoNome('')).toBe('?');
  });
});
