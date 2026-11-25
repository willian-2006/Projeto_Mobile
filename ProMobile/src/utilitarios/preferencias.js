import { CATEGORIAS } from '../dados/categorias';

import {
  CORES_AVATAR,
  META_MAXIMA,
  META_MINIMA,
  PASSO_META,
  PREFERENCIAS_PADRAO,
  TAMANHO_MAXIMO_NOME,
} from '../dados/preferencias';

import { normalizarCategoriasPersonalizadas } from './categorias';

import { horarioValido } from './datas';

const PADRAO_FOTO = /^foto-perfil-\d{1,15}\.(jpe?g|png|heic|webp)$/;

export function limitarMeta(meta) {
  const numero = Math.round(Number(meta));

  if (!Number.isFinite(numero)) {
    return PREFERENCIAS_PADRAO.meta;
  }

  return Math.min(Math.max(numero, META_MINIMA), META_MAXIMA);
}

export function sugerirMeta(pontosDoDia) {
  if (!pontosDoDia) {
    return PREFERENCIAS_PADRAO.meta;
  }

  return limitarMeta(Math.round((pontosDoDia * 0.7) / PASSO_META) * PASSO_META);
}

export function fotoValida(foto) {
  return typeof foto === 'string' && PADRAO_FOTO.test(foto);
}

export function normalizarFoto(foto) {
  if (typeof foto !== 'string') {
    return null;
  }

  const nome = foto.startsWith('file://') ? foto.split('/').pop() : foto;

  return fotoValida(nome) ? nome : null;
}

export function normalizarPreferencias(salvas) {
  const dados = salvas && typeof salvas === 'object' ? salvas : {};

  const categoriasPersonalizadas = normalizarCategoriasPersonalizadas(
    dados.categoriasPersonalizadas
  );

  const chavesCategorias = [...CATEGORIAS, ...categoriasPersonalizadas].map(
    categoria => categoria.chave
  );

  return {
    nome:
      typeof dados.nome === 'string'
        ? dados.nome.trim().slice(0, TAMANHO_MAXIMO_NOME)
        : PREFERENCIAS_PADRAO.nome,
    corAvatar: CORES_AVATAR.includes(dados.corAvatar)
      ? dados.corAvatar
      : PREFERENCIAS_PADRAO.corAvatar,
    foto: normalizarFoto(dados.foto),
    meta:
      dados.meta === undefined
        ? PREFERENCIAS_PADRAO.meta
        : limitarMeta(dados.meta),
    categoriasFavoritas: Array.isArray(dados.categoriasFavoritas)
      ? dados.categoriasFavoritas.filter(chave =>
          chavesCategorias.includes(chave)
        )
      : [],
    categoriasPersonalizadas,
    lembretesAtivos: Boolean(dados.lembretesAtivos),
    resumoDiario:
      typeof dados.resumoDiario === 'boolean'
        ? dados.resumoDiario
        : PREFERENCIAS_PADRAO.resumoDiario,
    horarioResumo: horarioValido(dados.horarioResumo)
      ? dados.horarioResumo
      : PREFERENCIAS_PADRAO.horarioResumo,
    onboardingConcluido: Boolean(dados.onboardingConcluido),
  };
}

export function ordenarCategorias(categorias, favoritas) {
  return [
    ...categorias.filter(categoria => favoritas.includes(categoria.chave)),
    ...categorias.filter(categoria => !favoritas.includes(categoria.chave)),
  ];
}

export function inicialDoNome(nome) {
  const limpo = (nome || '').trim();

  return limpo ? limpo[0].toUpperCase() : '?';
}
