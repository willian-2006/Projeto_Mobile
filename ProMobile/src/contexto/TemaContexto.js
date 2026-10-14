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

// Preferência 'sistema' segue o aparelho; sem informação do
// sistema, o padrão é o tema escuro.
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

// Recria os estilos do componente só quando o tema muda.
// `criarEstilos` deve ser declarado fora do componente.
export function useEstilos(criarEstilos) {
  const { tema } = useTema();

  return useMemo(() => criarEstilos(tema), [criarEstilos, tema]);
}
