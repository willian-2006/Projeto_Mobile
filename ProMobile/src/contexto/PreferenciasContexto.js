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

// Perfil e configurações: nome, avatar, meta diária, categorias
// favoritas, lembretes e se o onboarding já foi feito.
export function PreferenciasProvider({ children }) {
  const [preferencias, setPreferencias] = useState(PREFERENCIAS_PADRAO);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    carregarPreferencias().then(salvas => {
      if (ativo) {
        setPreferencias(salvas);
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!carregando) {
      salvarPreferencias(preferencias);
    }
  }, [preferencias, carregando]);

  const aoAtualizarPreferencias = useCallback(alteracoes => {
    setPreferencias(atuais =>
      normalizarPreferencias({ ...atuais, ...alteracoes })
    );
  }, []);

  const aoRedefinirPreferencias = useCallback(() => {
    setPreferencias({ ...PREFERENCIAS_PADRAO });
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
