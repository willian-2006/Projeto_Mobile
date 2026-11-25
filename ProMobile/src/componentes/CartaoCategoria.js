import React, { memo } from 'react';

import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import Cartao from './Cartao';

import IconeGradiente from './IconeGradiente';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { entradaCascata } from '../estilos/movimento';

import { coresDaCategoria } from '../estilos/tema';

import { contar } from '../utilitarios/textos';

function CartaoCategoria({
  categoria,
  tarefas,
  pontos,
  indice = 0,
  aoPressionar,
  aoSegurar,
  previa = false,
  style,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const cores = coresDaCategoria(tema, categoria);

  const titulo = categoria.titulo || 'Nova categoria';

  const conteudo = (
    <Cartao style={estilos.cartao}>
      <IconeGradiente icone={categoria.icone} gradiente={cores.gradiente} />

      <Text style={estilos.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      <Text style={estilos.tarefas}>{contar(tarefas, 'tarefa')}</Text>

      <Text style={[estilos.pontos, { color: cores.cor }]}>
        {contar(pontos, 'ponto')}
      </Text>
    </Cartao>
  );

  if (previa) {
    return (
      <View
        style={[estilos.envoltorio, style]}
        accessible
        accessibilityLabel={`Prévia do cartão ${titulo}`}
      >
        {conteudo}
      </View>
    );
  }

  return (
    <Animated.View
      style={[estilos.envoltorio, style]}
      entering={entradaCascata(indice)}
    >
      <TouchableOpacity
        onPress={() => aoPressionar(categoria.chave)}
        onLongPress={aoSegurar ? () => aoSegurar(categoria) : undefined}
        delayLongPress={400}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${titulo}: ${contar(tarefas, 'tarefa')}, ${contar(
          pontos,
          'ponto'
        )}`}
        accessibilityHint={
          categoria.personalizada
            ? 'Toque e segure para editar ou excluir'
            : undefined
        }
      >
        {conteudo}
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
