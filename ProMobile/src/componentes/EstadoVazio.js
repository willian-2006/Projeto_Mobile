import React from 'react';

import { Text, StyleSheet } from 'react-native';

import Cartao from './Cartao';

import IconeGradiente from './IconeGradiente';

import { useEstilos } from '../contexto/TemaContexto';

export default function EstadoVazio({ icone, gradiente, titulo, subtitulo }) {
  const estilos = useEstilos(criarEstilos);

  return (
    <Cartao style={estilos.vazio}>
      <IconeGradiente
        icone={icone}
        gradiente={gradiente}
        tamanho={64}
        tamanhoIcone={30}
        redondo
      />

      <Text style={estilos.textoVazio}>{titulo}</Text>

      {subtitulo ? (
        <Text style={estilos.subtextoVazio}>{subtitulo}</Text>
      ) : null}
    </Cartao>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    vazio: {
      padding: tema.espaco.xxl,
      alignItems: 'center',
    },

    textoVazio: {
      ...tema.tipografia.tituloCartao,
      color: tema.cores.texto,
      marginTop: tema.espaco.lg,
      textAlign: 'center',
    },

    subtextoVazio: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xs,
      textAlign: 'center',
    },
  });
