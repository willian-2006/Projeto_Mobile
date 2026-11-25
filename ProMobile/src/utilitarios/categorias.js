import {
  CATEGORIAS,
  ICONES_CATEGORIA,
  LIMITE_MAXIMO_CATEGORIAS,
  PALETAS_CATEGORIA,
  TAMANHO_MAXIMO_NOME_CATEGORIA,
} from '../dados/categorias';

export const PREFIXO_CATEGORIA_PERSONALIZADA = 'pers-';

export const LIMITE_PERSONALIZADAS = Math.max(
  LIMITE_MAXIMO_CATEGORIAS - CATEGORIAS.length,
  0
);

const CHAVES_ICONES = ICONES_CATEGORIA.map(icone => icone.chave);

const CHAVES_PALETAS = PALETAS_CATEGORIA.map(paleta => paleta.chave);

export function limparNomeCategoria(nome) {
  return typeof nome === 'string'
    ? nome.replace(/\s+/g, ' ').trim().slice(0, TAMANHO_MAXIMO_NOME_CATEGORIA)
    : '';
}

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function ehPersonalizada(chave) {
  return (
    typeof chave === 'string' &&
    chave.startsWith(PREFIXO_CATEGORIA_PERSONALIZADA)
  );
}

export function montarCategoriaPersonalizada({ chave, titulo, icone, paleta }) {
  return {
    chave,
    titulo,
    subtitulo: 'Sua categoria personalizada',
    icone,
    iconeVazio: `${icone}-outline`,
    textoVazio: `Nenhuma tarefa em ${titulo}`,
    paleta,
    personalizada: true,
  };
}

export function normalizarCategoriasPersonalizadas(lista) {
  if (!Array.isArray(lista)) {
    return [];
  }

  const vistas = new Set(CATEGORIAS.map(categoria => categoria.chave));

  const nomes = new Set(
    CATEGORIAS.map(categoria => normalizarTexto(categoria.titulo))
  );

  const resultado = [];

  lista.forEach(item => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const titulo = limparNomeCategoria(item.titulo);

    const nomeNormalizado = normalizarTexto(titulo);

    if (
      resultado.length >= LIMITE_PERSONALIZADAS ||
      !ehPersonalizada(item.chave) ||
      vistas.has(item.chave) ||
      !titulo ||
      nomes.has(nomeNormalizado)
    ) {
      return;
    }

    vistas.add(item.chave);
    nomes.add(nomeNormalizado);

    resultado.push({
      chave: item.chave,
      titulo,
      icone: CHAVES_ICONES.includes(item.icone) ? item.icone : CHAVES_ICONES[0],
      paleta: CHAVES_PALETAS.includes(item.paleta)
        ? item.paleta
        : CHAVES_PALETAS[0],
    });
  });

  return resultado;
}

export function montarListaCategorias(personalizadas) {
  return [
    ...CATEGORIAS,
    ...normalizarCategoriasPersonalizadas(personalizadas).map(
      montarCategoriaPersonalizada
    ),
  ];
}

export function contarCategorias(personalizadas) {
  return (
    CATEGORIAS.length +
    normalizarCategoriasPersonalizadas(personalizadas).length
  );
}

export function podeCriarCategoria(personalizadas) {
  return contarCategorias(personalizadas) < LIMITE_MAXIMO_CATEGORIAS;
}

export function validarNomeCategoria(nome, categorias, chaveAtual = null) {
  const titulo = limparNomeCategoria(nome);

  if (!titulo) {
    return 'Dê um nome para a categoria.';
  }

  const repetida = categorias.some(
    categoria =>
      categoria.chave !== chaveAtual &&
      normalizarTexto(categoria.titulo) === normalizarTexto(titulo)
  );

  return repetida ? 'Já existe uma categoria com esse nome.' : null;
}

export function salvarCategoriaPersonalizada(personalizadas, dados) {
  const lista = normalizarCategoriasPersonalizadas(personalizadas);

  const categoria = {
    chave: dados.chave,
    titulo: limparNomeCategoria(dados.titulo),
    icone: dados.icone,
    paleta: dados.paleta,
  };

  const existe = lista.some(item => item.chave === categoria.chave);

  if (existe) {
    return lista.map(item =>
      item.chave === categoria.chave ? categoria : item
    );
  }

  return podeCriarCategoria(lista) ? [...lista, categoria] : lista;
}

export function removerCategoriaPersonalizada(personalizadas, chave) {
  return normalizarCategoriasPersonalizadas(personalizadas).filter(
    categoria => categoria.chave !== chave
  );
}
