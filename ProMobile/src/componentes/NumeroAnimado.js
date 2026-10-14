import React, { useEffect, useRef, useState } from 'react';

import { Text } from 'react-native';

import { ESCALA_MAXIMA_FONTE } from '../estilos/espacamentos';

import { useReducedMotion } from 'react-native-reanimated';

import { transicao } from '../estilos/movimento';

export default function NumeroAnimado({ valor, sufixo = '', style, ...resto }) {
  const reduzirMovimento = useReducedMotion();

  const [exibido, setExibido] = useState(reduzirMovimento ? valor : 0);

  const atual = useRef(exibido);

  useEffect(() => {
    const inicio = atual.current;

    if (reduzirMovimento || inicio === valor) {
      atual.current = valor;
      setExibido(valor);
      return undefined;
    }

    const comeco = Date.now();

    let quadro;

    function avancar() {
      const tempo = Math.min((Date.now() - comeco) / transicao.duration, 1);

      const suavizado = 1 - Math.pow(1 - tempo, 3);

      atual.current = Math.round(inicio + (valor - inicio) * suavizado);

      setExibido(atual.current);

      if (tempo < 1) {
        quadro = requestAnimationFrame(avancar);
      }
    }

    quadro = requestAnimationFrame(avancar);

    return () => cancelAnimationFrame(quadro);
  }, [valor, reduzirMovimento]);

  return (
    <Text
      style={style}
      maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
      accessibilityLabel={`${valor}${sufixo}`}
      {...resto}
    >
      {exibido}
      {sufixo}
    </Text>
  );
}
