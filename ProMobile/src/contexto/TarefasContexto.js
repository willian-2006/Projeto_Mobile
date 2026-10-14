import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { useAviso } from './AvisoContexto';

import { usePreferencias } from './PreferenciasContexto';

import { ACOES, dadosReducer } from './tarefasReducer';

import { useHoje } from '../hooks/useHoje';

import {
  carregarDados,
  dadosIniciais,
  salvarDados,
} from '../servicos/armazenamento';

import { gerarId } from '../utilitarios/gerarId';

import {
  calcularPorcentagem,
  calcularEstatisticas,
} from '../utilitarios/pontuacao';

import { calcularSequencia } from '../utilitarios/sequencia';

import {
  filtrarTarefasDoDia,
  normalizarTarefa,
  tarefaParaDesfazer,
} from '../utilitarios/tarefas';

const TarefasContexto = createContext(null);

const DADOS_VAZIOS = {
  tarefas: [],
  historico: [],
  ultimoDia: null,
  recorde: 0,
};

export function TarefasProvider({ children }) {
  const { preferencias, carregando: carregandoPreferencias } =
    usePreferencias();

  const { mostrarAviso } = useAviso();

  const hoje = useHoje();

  const [dados, despachar] = useReducer(dadosReducer, DADOS_VAZIOS);

  const [carregando, setCarregando] = useState(true);

  const [podeSalvar, setPodeSalvar] = useState(false);

  const dadosAtuais = useRef(dados);

  useEffect(() => {
    dadosAtuais.current = dados;
  }, [dados]);

  useEffect(() => {
    let ativo = true;

    carregarDados().then(resultado => {
      if (ativo) {
        despachar({ tipo: ACOES.restaurar, dados: resultado.dados });
        setPodeSalvar(resultado.podeSalvar);
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!carregando && !carregandoPreferencias) {
      despachar({ tipo: ACOES.virarDia, hoje, meta: preferencias.meta });
    }
  }, [hoje, carregando, carregandoPreferencias, preferencias.meta]);

  useEffect(() => {
    if (!carregando && podeSalvar) {
      salvarDados(dados);
    }
  }, [dados, carregando, podeSalvar]);

  const aoAdicionar = useCallback(
    novaTarefa => {
      despachar({
        tipo: ACOES.adicionar,
        tarefa: normalizarTarefa(
          { pontos: 10, ...novaTarefa, id: gerarId(), concluida: false },
          hoje
        ),
      });
    },
    [hoje]
  );

  const aoAlternar = useCallback(id => {
    despachar({ tipo: ACOES.alternar, id });
  }, []);

  const aoExcluir = useCallback(
    id => {
      const indice = dadosAtuais.current.tarefas.findIndex(
        tarefa => tarefa.id === id
      );

      if (indice === -1) {
        return;
      }

      const tarefa = dadosAtuais.current.tarefas[indice];

      const diaDaExclusao = dadosAtuais.current.ultimoDia;

      despachar({ tipo: ACOES.excluir, id });

      mostrarAviso({
        mensagem: `"${tarefa.titulo}" excluída`,
        rotuloAcao: 'Desfazer',
        aoAcionar: () => {
          const restaurada = tarefaParaDesfazer(
            tarefa,
            diaDaExclusao,
            dadosAtuais.current.ultimoDia
          );

          if (restaurada) {
            despachar({ tipo: ACOES.reinserir, tarefa: restaurada, indice });
          }
        },
      });
    },
    [mostrarAviso]
  );

  const aoEditar = useCallback(
    (id, alteracoes) => {
      const atual = dadosAtuais.current.tarefas.find(
        tarefa => tarefa.id === id
      );

      if (!atual) {
        return;
      }

      despachar({
        tipo: ACOES.editar,
        id,
        alteracoes: normalizarTarefa({ ...atual, ...alteracoes }, hoje),
      });
    },
    [hoje]
  );

  const aoReordenar = useCallback((idOrigem, idDestino) => {
    despachar({ tipo: ACOES.reordenar, idOrigem, idDestino });
  }, []);

  const aoRedefinirTarefas = useCallback(() => {
    despachar({
      tipo: ACOES.restaurar,
      dados: { ...dadosIniciais(hoje), ultimoDia: hoje },
    });
    setPodeSalvar(true);
  }, [hoje]);

  const tarefasDeHoje = useMemo(
    () => filtrarTarefasDoDia(dados.tarefas, hoje),
    [dados.tarefas, hoje]
  );

  const valor = useMemo(
    () => ({
      tarefas: dados.tarefas,
      tarefasDeHoje,
      historico: dados.historico,
      recordeSalvo: dados.recorde,
      hoje,
      carregando,
      aoAdicionar,
      aoAlternar,
      aoExcluir,
      aoEditar,
      aoReordenar,
      aoRedefinirTarefas,
    }),
    [
      dados,
      tarefasDeHoje,
      hoje,
      carregando,
      aoAdicionar,
      aoAlternar,
      aoExcluir,
      aoEditar,
      aoReordenar,
      aoRedefinirTarefas,
    ]
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
  const { tarefasDeHoje } = useTarefas();

  const { preferencias } = usePreferencias();

  const meta = preferencias.meta;

  return useMemo(() => {
    const estatisticas = calcularEstatisticas(tarefasDeHoje);

    return {
      ...estatisticas,
      meta,
      porcentagem: calcularPorcentagem(estatisticas.pontosAtuais, meta),
      metaBatida: estatisticas.pontosAtuais >= meta,
    };
  }, [tarefasDeHoje, meta]);
}

export function useSequencia() {
  const { historico, hoje, recordeSalvo } = useTarefas();

  const { metaBatida } = useEstatisticas();

  return useMemo(
    () => calcularSequencia(historico, hoje, metaBatida, recordeSalvo),
    [historico, hoje, metaBatida, recordeSalvo]
  );
}
