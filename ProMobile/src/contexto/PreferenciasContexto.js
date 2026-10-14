import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PREFERENCIAS_PADRAO } from '../dados/preferencias';

import {
  carregarPreferencias,
  salvarPreferencias,
} from '../servicos/armazenamento';

import { normalizarPreferencias } from '../utilitarios/preferencias';

const PreferenciasContexto = createContext(null);

export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] = useState(PREFERENCIAS_PADRAO);

  const [carregando, setCarregando] = useState(true);

  const [podeSalvar, setPodeSalvar] = useState(false);

  useEffect(() => {
    let ativo = true;

    carregarPreferencias().then(resultado => {
      if (ativo) {
        setPreferencias(resultado.preferencias);
        setPodeSalvar(resultado.podeSalvar);
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!carregando && podeSalvar) {
      salvarPreferencias(preferencias);
    }
  }, [preferencias, carregando, podeSalvar]);

  const aoAtualizarPreferencias = useCallback(alteracoes => {
    setPreferencias(atuais =>
      normalizarPreferencias({ ...atuais, ...alteracoes })
    );
  }, []);

  const aoRedefinirPreferencias = useCallback(() => {
    setPreferencias({ ...PREFERENCIAS_PADRAO });
    setPodeSalvar(true);
  }, []);

  const valor = useMemo(
    () => ({
      preferencias,
      carregando,
      aoAtualizarPreferencias,
      aoRedefinirPreferencias,
    }),
    [preferencias, carregando, aoAtualizarPreferencias, aoRedefinirPreferencias]
  );

  return (
    <PreferenciasContexto.Provider value={valor}>
      {children}
    </PreferenciasContexto.Provider>
  );
}

export function usePreferencias() {
  const contexto = useContext(PreferenciasContexto);

  if (!contexto) {
    throw new Error(
      'usePreferencias deve ser usado dentro de PreferenciasProvider.'
    );
  }

  return contexto;
}
