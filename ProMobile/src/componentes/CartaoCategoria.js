import React, { memo } from 'react';

import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import Cartao from './Cartao';

import IconeGradiente from './IconeGradiente';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { entradaCascata } from '../estilos/movimento';

function CartaoCategoria({
  chave,
  titulo,
  icone,
  tarefas,
  pontos,
  indice,
  aoPressionar,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const coresCategoria = tema.categorias[chave];

  return (
    <Animated.View style={estilos.envoltorio} entering={entradaCascata(indice)}>
      <TouchableOpacity
        onPress={() => aoPressionar(chave)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${titulo}: ${tarefas} ${
          tarefas === 1 ? 'tarefa' : 'tarefas'
        }, ${pontos} pontos`}
      >
        <Cartao style={estilos.cartao}>
          <IconeGradiente icone={icone} gradiente={coresCategoria.gradiente} />

          <Text style={estilos.titulo}>{titulo}</Text>

          <Text style={estilos.tarefas}>
            {tarefas} {tarefas === 1 ? 'tarefa' : 'tarefas'}
          </Text>

          <Text style={[estilos.pontos, { color: coresCategoria.cor }]}>
            {pontos} pontos
          </Text>
        </Cartao>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default memo(CartaoCategoria);

const criarEstilos = tema =>
  StyleSheet.create({
    envoltorio: {
      width: '48%',
      marginBottom: tema.espaco.md,
    },

    cartao: {
      padding: tema.espaco.lg,
    },

    titulo: {
      ...tema.tipografia.tituloCartao,
      color: tema.cores.texto,
      marginTop: tema.espaco.md,
    },

    tarefas: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xs,
    },

    pontos: {
      ...tema.tipografia.legendaDestaque,
      ...tema.tipografia.numeros,
      fontSize: 13,
      marginTop: 2,
    },
  });
