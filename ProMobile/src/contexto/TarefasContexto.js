import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { ACOES, tarefasReducer } from './tarefasReducer';

import { carregarDados, salvarDados } from '../servicos/armazenamento';

import { gerarId } from '../utilitarios/gerarId';

import { calcularEstatisticas } from '../utilitarios/pontuacao';

const TarefasContexto = createContext(null);

export function TarefasProvider({ children }) {
  const [tarefas, despachar] = useReducer(tarefasReducer, []);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    carregarDados().then(tarefasSalvas => {
      if (ativo) {
        despachar({ tipo: ACOES.restaurar, tarefas: tarefasSalvas });
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  // Só salva depois do primeiro carregamento, para não
  // sobrescrever os dados salvos com a lista vazia inicial.
  useEffect(() => {
    if (!carregando) {
      salvarDados(tarefas);
    }
  }, [tarefas, carregando]);

  const aoAdicionar = useCallback((categoria, titulo, pontos = 10) => {
    despachar({
      tipo: ACOES.adicionar,
      tarefa: {
        id: gerarId(),
        titulo: titulo.trim(),
        categoria,
        pontos,
        concluida: false,
      },
    });
  }, []);

  const aoAlternar = useCallback(id => {
    despachar({ tipo: ACOES.alternar, id });
  }, []);

  const aoExcluir = useCallback(id => {
    despachar({ tipo: ACOES.excluir, id });
  }, []);

  const aoEditar = useCallback((id, alteracoes) => {
    despachar({ tipo: ACOES.editar, id, alteracoes });
  }, []);

  const valor = useMemo(
    () => ({
      tarefas,
      carregando,
      aoAdicionar,
      aoAlternar,
      aoExcluir,
      aoEditar,
    }),
    [tarefas, carregando, aoAdicionar, aoAlternar, aoExcluir, aoEditar]
  );

  return (
    <TarefasContexto.Provider value={valor}>
      {children}
    </TarefasContexto.Provider>
  );
}

export function useTarefas() {
  const contexto = useContext(TarefasContexto);

  if (!contexto) {
    throw new Error('useTarefas deve ser usado dentro de TarefasProvider.');
  }

  return contexto;
}

export function useEstatisticas() {
  const { tarefas } = useTarefas();

  return useMemo(() => calcularEstatisticas(tarefas), [tarefas]);
}
