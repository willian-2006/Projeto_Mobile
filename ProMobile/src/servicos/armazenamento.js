import AsyncStorage from '@react-native-async-storage/async-storage';

import { CATEGORIAS } from '../dados/categorias';

import { tarefasIniciais } from '../dados/tarefas';

export const CHAVE_ARMAZENAMENTO = '@promobile/dados';

export const VERSAO_ATUAL = 1;

// Versão 0 (antes do esquema): lista solta de tarefas, com
// `categoria` pelo título ('Saúde') e ids numéricos.
function migrarDeV0(dados) {
  const lista = Array.isArray(dados) ? dados : dados.tarefas || [];

  return lista.map(tarefa => {
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
}

// Recebe o que estava salvo (já convertido de JSON) e devolve a
// lista de tarefas no formato da versão atual.
export function migrarDados(dados) {
  const versao =
    dados && !Array.isArray(dados) && typeof dados.versao === 'number'
      ? dados.versao
      : 0;

  if (versao === 0) {
    return migrarDeV0(dados);
  }

  return dados.tarefas;
}

export async function carregarDados() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);

    if (texto === null) {
      return tarefasIniciais;
    }

    const tarefas = migrarDados(JSON.parse(texto));

    return Array.isArray(tarefas) ? tarefas : tarefasIniciais;
  } catch (erro) {
    console.warn('Não foi possível carregar os dados salvos.', erro);

    return tarefasIniciais;
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

export async function salvarDados(tarefas) {
  try {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify({ versao: VERSAO_ATUAL, tarefas })
    );
  } catch (erro) {
    console.warn('Não foi possível salvar os dados.', erro);
  }
}
