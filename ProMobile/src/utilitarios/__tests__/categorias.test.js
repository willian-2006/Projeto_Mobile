import {
  CATEGORIAS,
  LIMITE_MAXIMO_CATEGORIAS,
  TAMANHO_MAXIMO_NOME_CATEGORIA,
} from '../../dados/categorias';

import {
  LIMITE_PERSONALIZADAS,
  contarCategorias,
  ehPersonalizada,
  limparNomeCategoria,
  montarListaCategorias,
  normalizarCategoriasPersonalizadas,
  podeCriarCategoria,
  removerCategoriaPersonalizada,
  salvarCategoriaPersonalizada,
  validarNomeCategoria,
} from '../categorias';

const financas = {
  chave: 'pers-1',
  titulo: 'Finanças',
  icone: 'wallet',
  paleta: 'lima',
};

const treino = {
  chave: 'pers-2',
  titulo: 'Treino',
  icone: 'barbell',
  paleta: 'coral',
};

describe('limite de categorias', () => {
  it('o limite total inclui as 4 padrão', () => {
    expect(LIMITE_MAXIMO_CATEGORIAS).toBe(6);
    expect(LIMITE_PERSONALIZADAS).toBe(
      LIMITE_MAXIMO_CATEGORIAS - CATEGORIAS.length
    );
  });

  it('permite criar até atingir o limite', () => {
    expect(podeCriarCategoria([])).toBe(true);
    expect(podeCriarCategoria([financas])).toBe(true);
    expect(podeCriarCategoria([financas, treino])).toBe(false);
    expect(contarCategorias([financas, treino])).toBe(6);
  });

  it('não salva uma categoria nova além do limite', () => {
    const cheia = [financas, treino];

    const resultado = salvarCategoriaPersonalizada(cheia, {
      chave: 'pers-3',
      titulo: 'Leitura',
      icone: 'book',
      paleta: 'ciano',
    });

    expect(resultado).toHaveLength(2);
  });

  it('edita mesmo com o limite atingido', () => {
    const resultado = salvarCategoriaPersonalizada([financas, treino], {
      ...treino,
      titulo: 'Academia',
    });

    expect(resultado[1].titulo).toBe('Academia');
  });

  it('excluir libera uma vaga', () => {
    const restante = removerCategoriaPersonalizada(
      [financas, treino],
      'pers-2'
    );

    expect(restante).toEqual([financas]);
    expect(podeCriarCategoria(restante)).toBe(true);
  });
});

describe('normalizarCategoriasPersonalizadas', () => {
  it('descarta itens inválidos, duplicados e o excesso', () => {
    const resultado = normalizarCategoriasPersonalizadas([
      null,
      { ...financas, chave: 'saude' },
      financas,
      { ...financas, chave: 'pers-9' },
      { ...treino, titulo: '   ' },
      { ...treino, titulo: 'saúde' },
      treino,
      { chave: 'pers-3', titulo: 'Extra', icone: 'book', paleta: 'ciano' },
    ]);

    expect(resultado).toEqual([financas, treino]);
  });

  it('corrige ícone e paleta desconhecidos', () => {
    const [categoria] = normalizarCategoriasPersonalizadas([
      { chave: 'pers-1', titulo: 'X', icone: 'nada', paleta: 'preto' },
    ]);

    expect(categoria.icone).toBe('wallet');
    expect(categoria.paleta).toBe('laranja');
  });

  it('não aceita algo que não é lista', () => {
    expect(normalizarCategoriasPersonalizadas(undefined)).toEqual([]);
    expect(normalizarCategoriasPersonalizadas('x')).toEqual([]);
  });
});

describe('montarListaCategorias', () => {
  it('mantém as padrão primeiro e completa as personalizadas', () => {
    const lista = montarListaCategorias([financas]);

    expect(lista.map(categoria => categoria.chave)).toEqual([
      ...CATEGORIAS.map(categoria => categoria.chave),
      'pers-1',
    ]);

    expect(lista[4]).toMatchObject({
      titulo: 'Finanças',
      iconeVazio: 'wallet-outline',
      textoVazio: 'Nenhuma tarefa em Finanças',
      personalizada: true,
    });
  });
});

describe('validarNomeCategoria', () => {
  const lista = montarListaCategorias([financas]);

  it('exige nome', () => {
    expect(validarNomeCategoria('   ', lista)).toBe(
      'Dê um nome para a categoria.'
    );
  });

  it('recusa nome repetido, ignorando acentos e maiúsculas', () => {
    expect(validarNomeCategoria('SAUDE', lista)).toBe(
      'Já existe uma categoria com esse nome.'
    );
    expect(validarNomeCategoria('financas', lista)).toBe(
      'Já existe uma categoria com esse nome.'
    );
  });

  it('aceita o próprio nome ao editar', () => {
    expect(validarNomeCategoria('Finanças', lista, 'pers-1')).toBeNull();
  });

  it('aceita um nome novo', () => {
    expect(validarNomeCategoria('Leitura', lista)).toBeNull();
  });
});

describe('textos', () => {
  it('limpa espaços e corta no tamanho máximo', () => {
    expect(limparNomeCategoria('  Meu   treino  ')).toBe('Meu treino');
    expect(limparNomeCategoria('a'.repeat(30))).toHaveLength(
      TAMANHO_MAXIMO_NOME_CATEGORIA
    );
  });

  it('reconhece chaves personalizadas', () => {
    expect(ehPersonalizada('pers-abc')).toBe(true);
    expect(ehPersonalizada('saude')).toBe(false);
  });
});
