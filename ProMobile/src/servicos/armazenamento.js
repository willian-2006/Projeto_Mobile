import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORIAS } from '../dados/categorias';

import { PREFERENCIAS_PADRAO } from '../dados/preferencias';

import { tarefasIniciais } from '../dados/tarefas';

import { chaveDia } from '../utilitarios/datas';

import { normalizarPreferencias } from '../utilitarios/preferencias';

import { normalizarTarefa } from '../utilitarios/tarefas';

export const CHAVE_ARMAZENAMENTO = '@promobile/dados';

export const VERSAO_ATUAL = 2;

export function dadosIniciais(hoje = chaveDia()) {
  return {
    tarefas: tarefasIniciais.map(tarefa => normalizarTarefa(tarefa, hoje)),
    historico: [],
    ultimoDia: null,
  };
}

function migrarDeV0(dados) {
  const lista = Array.isArray(dados) ? dados : dados.tarefas || [];

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
    tarefas: (dados.tarefas || []).map(tarefa =>
      normalizarTarefa(tarefa, hoje)
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

  if (!Array.isArray(atual.tarefas)) {
    return null;
  }

  return {
    tarefas: atual.tarefas.map(tarefa => normalizarTarefa(tarefa, hoje)),
    historico: Array.isArray(atual.historico) ? atual.historico : [],
    ultimoDia: typeof atual.ultimoDia === 'string' ? atual.ultimoDia : null,
  };
}

export async function carregarDados() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);

    if (texto === null) {
      return dadosIniciais();
    }

    return migrarDados(JSON.parse(texto)) || dadosIniciais();
  } catch (erro) {
    console.warn('Não foi possível carregar os dados salvos.', erro);

    return dadosIniciais();
  }
}

export async function salvarDados({ tarefas, historico, ultimoDia }) {
  try {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify({ versao: VERSAO_ATUAL, tarefas, historico, ultimoDia })
    );
  } catch (erro) {
    console.warn('Não foi possível salvar os dados.', erro);
  }
}

export const CHAVE_PREFERENCIAS = '@promobile/preferencias';

export async function carregarPreferencias() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_PREFERENCIAS);

    if (texto === null) {
      return { ...PREFERENCIAS_PADRAO };
    }

    return normalizarPreferencias(JSON.parse(texto));
  } catch (erro) {
    console.warn('Não foi possível carregar as preferências.', erro);

    return { ...PREFERENCIAS_PADRAO };
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
    await AsyncStorage.multiRemove([CHAVE_ARMAZENAMENTO, CHAVE_PREFERENCIAS]);
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
