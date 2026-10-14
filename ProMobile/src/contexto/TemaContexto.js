import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useColorScheme } from 'react-native';

import {
  carregarPreferenciaTema,
  salvarPreferenciaTema,
} from '../servicos/armazenamento';

import { montarTema } from '../estilos/tema';

const TemaContexto = createContext(null);

export function resolverEsquema(preferencia, esquemaSistema) {
  if (preferencia === 'escuro' || preferencia === 'claro') {
    return preferencia;
  }

  return esquemaSistema === 'light' ? 'claro' : 'escuro';
}

export function TemaProvider({ children }) {
  const esquemaSistema = useColorScheme();

  const [preferencia, setPreferencia] = useState('sistema');

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    carregarPreferenciaTema().then(preferenciaSalva => {
      if (ativo) {
        setPreferencia(preferenciaSalva);
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  const aoMudarPreferencia = useCallback(novaPreferencia => {
    setPreferencia(novaPreferencia);
    salvarPreferenciaTema(novaPreferencia);
  }, []);

  const esquema = resolverEsquema(preferencia, esquemaSistema);

  const tema = useMemo(() => montarTema(esquema), [esquema]);

  const valor = useMemo(
    () => ({ tema, preferencia, carregando, aoMudarPreferencia }),
    [tema, preferencia, carregando, aoMudarPreferencia]
  );

  return (
    <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContexto);

  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de TemaProvider.');
  }

  return contexto;
}

export function useEstilos(criarEstilos) {
  const { tema } = useTema();

  return useMemo(() => criarEstilos(tema), [criarEstilos, tema]);
}
