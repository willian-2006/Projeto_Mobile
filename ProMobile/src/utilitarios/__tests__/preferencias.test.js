import { CATEGORIAS } from '../../dados/categorias';

import { PREFERENCIAS_PADRAO } from '../../dados/preferencias';

import {
  fotoValida,
  inicialDoNome,
  limitarMeta,
  normalizarFoto,
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
      foto: 'foto-perfil-1731900000000.jpg',
      meta: 120,
      lembretesAtivos: true,
      resumoDiario: false,
      horarioResumo: '21:30',
      onboardingConcluido: true,
    };

    expect(normalizarPreferencias(preferencias)).toEqual(preferencias);
  });

  it('descarta foto que não é um arquivo de perfil do app', () => {
    expect(normalizarPreferencias({ foto: 'https://x.com/a.jpg' }).foto).toBe(
      null
    );
    expect(normalizarPreferencias({ foto: 42 }).foto).toBe(null);
    expect(normalizarPreferencias({ foto: '' }).foto).toBe(null);
    expect(normalizarPreferencias({ foto: '../foto-perfil-1.jpg' }).foto).toBe(
      null
    );
  });
});

describe('fotoValida', () => {
  it('aceita só nomes de arquivo de foto de perfil', () => {
    expect(fotoValida('foto-perfil-1731900000000.jpg')).toBe(true);
    expect(fotoValida('foto-perfil-1.png')).toBe(true);
    expect(fotoValida('foto-perfil-1.exe')).toBe(false);
    expect(fotoValida('file:///foto-perfil-1.jpg')).toBe(false);
    expect(fotoValida(null)).toBe(false);
  });
});

describe('normalizarFoto', () => {
  it('converte o caminho completo antigo em nome de arquivo', () => {
    expect(
      normalizarFoto(
        'file:///var/mobile/Containers/Data/Application/ABC/Documents/foto-perfil-17.jpg'
      )
    ).toBe('foto-perfil-17.jpg');
  });

  it('mantém o nome e descarta o resto', () => {
    expect(normalizarFoto('foto-perfil-17.jpeg')).toBe('foto-perfil-17.jpeg');
    expect(normalizarFoto('file:///Documents/outra.jpg')).toBe(null);
    expect(normalizarFoto(undefined)).toBe(null);
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
