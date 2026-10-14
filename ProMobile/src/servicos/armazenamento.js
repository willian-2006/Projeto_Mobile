import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORIAS } from '../dados/categorias';

import { PREFERENCIAS_PADRAO } from '../dados/preferencias';

import { tarefasIniciais } from '../dados/tarefas';

import { chaveDia } from '../utilitarios/datas';

import { normalizarPreferencias } from '../utilitarios/preferencias';

import { normalizarTarefa } from '../utilitarios/tarefas';

export const CHAVE_ARMAZENAMENTO = '@promobile/dados';

export const CHAVE_RECUPERACAO = '@promobile/dados-recuperacao';

export const VERSAO_ATUAL = 2;

function ehObjeto(valor) {
  return Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor);
}

function listaDeObjetos(valor) {
  return Array.isArray(valor) ? valor.filter(ehObjeto) : [];
}

export function dadosIniciais(hoje = chaveDia()) {
  return {
    tarefas: tarefasIniciais.map(tarefa => normalizarTarefa(tarefa, hoje)),
    historico: [],
    ultimoDia: null,
    recorde: 0,
  };
}

function migrarDeV0(dados) {
  const lista = listaDeObjetos(Array.isArray(dados) ? dados : dados.tarefas);

  const tarefas = lista.map(tarefa => {
    const categoria = CATEGORIAS.find(
      item =>
        item.titulo === tarefa.categoria || item.chave === tarefa.categoria
    );

    return {
      ...tarefa,
      id: String(tarefa.id),
      categoria: categoria ? categoria.chave : tarefa.categoria,
    };
  });

  return { versao: 1, tarefas };
}

function migrarDeV1(dados, hoje) {
  return {
    versao: 2,
    tarefas: listaDeObjetos(dados.tarefas).map(tarefa =>
      normalizarTarefa({ ...tarefa, concluida: false }, hoje)
    ),
    historico: [],
    ultimoDia: null,
  };
}

export function migrarDados(dados, hoje = chaveDia()) {
  let atual = dados;

  let versao =
    dados && !Array.isArray(dados) && typeof dados.versao === 'number'
      ? dados.versao
      : 0;

  if (versao === 0) {
    atual = migrarDeV0(atual);
    versao = 1;
  }

  if (versao === 1) {
    atual = migrarDeV1(atual, hoje);
  }

  if (!ehObjeto(atual) || !Array.isArray(atual.tarefas)) {
    return null;
  }

  return {
    tarefas: listaDeObjetos(atual.tarefas).map(tarefa =>
      normalizarTarefa(tarefa, hoje)
    ),
    historico: listaDeObjetos(atual.historico).filter(
      registro => typeof registro.data === 'string'
    ),
    ultimoDia: typeof atual.ultimoDia === 'string' ? atual.ultimoDia : null,
    recorde: Number.isFinite(atual.recorde) ? atual.recorde : 0,
  };
}

async function guardarParaRecuperacao(texto) {
  try {
    await AsyncStorage.setItem(CHAVE_RECUPERACAO, texto);
  } catch (erro) {
    console.warn('Não foi possível guardar a cópia de recuperação.', erro);
  }
}

export async function carregarDados() {
  let texto;

  try {
    texto = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
  } catch (erro) {
    console.warn('Não foi possível ler os dados salvos.', erro);

    return { dados: dadosIniciais(), podeSalvar: false };
  }

  if (texto === null) {
    return { dados: dadosIniciais(), podeSalvar: true };
  }

  try {
    const dados = migrarDados(JSON.parse(texto));

    if (dados) {
      return { dados, podeSalvar: true };
    }
  } catch (erro) {
    console.warn('Os dados salvos estão corrompidos.', erro);
  }

  await guardarParaRecuperacao(texto);

  return { dados: dadosIniciais(), podeSalvar: true };
}

export async function salvarDados({ tarefas, historico, ultimoDia, recorde }) {
  try {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify({
        versao: VERSAO_ATUAL,
        tarefas,
        historico,
        ultimoDia,
        recorde,
      })
    );
  } catch (erro) {
    console.warn('Não foi possível salvar os dados.', erro);
  }
}

export const CHAVE_PREFERENCIAS = '@promobile/preferencias';

export async function carregarPreferencias() {
  let texto;

  try {
    texto = await AsyncStorage.getItem(CHAVE_PREFERENCIAS);
  } catch (erro) {
    console.warn('Não foi possível ler as preferências.', erro);

    return { preferencias: { ...PREFERENCIAS_PADRAO }, podeSalvar: false };
  }

  if (texto === null) {
    return { preferencias: { ...PREFERENCIAS_PADRAO }, podeSalvar: true };
  }

  try {
    return {
      preferencias: normalizarPreferencias(JSON.parse(texto)),
      podeSalvar: true,
    };
  } catch (erro) {
    console.warn('As preferências salvas estão corrompidas.', erro);

    return { preferencias: { ...PREFERENCIAS_PADRAO }, podeSalvar: true };
  }
}

export async function salvarPreferencias(preferencias) {
  try {
    await AsyncStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify(preferencias)
    );
  } catch (erro) {
    console.warn('Não foi possível salvar as preferências.', erro);
  }
}

export const CHAVE_TEMA = '@promobile/tema';

export const PREFERENCIAS_TEMA = ['sistema', 'escuro', 'claro'];

export async function carregarPreferenciaTema() {
  try {
    const preferencia = await AsyncStorage.getItem(CHAVE_TEMA);

    return PREFERENCIAS_TEMA.includes(preferencia) ? preferencia : 'sistema';
  } catch (erro) {
    console.warn('Não foi possível carregar o tema.', erro);

    return 'sistema';
  }
}

export async function salvarPreferenciaTema(preferencia) {
  try {
    await AsyncStorage.setItem(CHAVE_TEMA, preferencia);
  } catch (erro) {
    console.warn('Não foi possível salvar o tema.', erro);
  }
}

export async function limparDados() {
  try {
    await AsyncStorage.multiRemove([
      CHAVE_ARMAZENAMENTO,
      CHAVE_PREFERENCIAS,
      CHAVE_TEMA,
      CHAVE_RECUPERACAO,
    ]);
  } catch (erro) {
    console.warn('Não foi possível limpar os dados.', erro);
  }
}

export function montarExportacao(dados, preferencias) {
  return JSON.stringify(
    {
      app: 'WillFlow',
      versao: VERSAO_ATUAL,
      exportadoEm: new Date().toISOString(),
      preferencias,
      tarefas: dados.tarefas,
      historico: dados.historico,
    },
    null,
    2
  );
}
