import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AccessibilityInfo } from 'react-native';

import Aviso from '../componentes/Aviso';

const DURACAO_PADRAO = 5000;

const AvisoContexto = createContext(null);

// Aviso temporário (toast) com uma ação opcional, como "Desfazer".
// Um aviso novo substitui o anterior.
export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState(null);

  const proximoId = useRef(0);

  const esconderAviso = useCallback(() => setAviso(null), []);

  const mostrarAviso = useCallback(
    ({ mensagem, rotuloAcao, aoAcionar, duracao = DURACAO_PADRAO }) => {
      proximoId.current += 1;

      setAviso({
        id: proximoId.current,
        mensagem,
        rotuloAcao,
        aoAcionar,
        duracao,
      });

      AccessibilityInfo.announceForAccessibility(mensagem);
    },
    []
  );

  useEffect(() => {
    if (!aviso) {
      return undefined;
    }

    const temporizador = setTimeout(esconderAviso, aviso.duracao);

    return () => clearTimeout(temporizador);
  }, [aviso, esconderAviso]);

  const aoAcionar = useCallback(() => {
    aviso?.aoAcionar?.();
    esconderAviso();
  }, [aviso, esconderAviso]);

  const valor = useMemo(
    () => ({ mostrarAviso, esconderAviso }),
    [mostrarAviso, esconderAviso]
  );

  return (
    <AvisoContexto.Provider value={valor}>
      {children}

      {aviso && (
        <Aviso
          key={aviso.id}
          mensagem={aviso.mensagem}
          rotuloAcao={aviso.rotuloAcao}
          aoAcionar={aoAcionar}
        />
      )}
    </AvisoContexto.Provider>
  );
}

export function useAviso() {
  const contexto = useContext(AvisoContexto);

  if (!contexto) {
    throw new Error('useAviso deve ser usado dentro de AvisoProvider.');
  }

  return contexto;
}
