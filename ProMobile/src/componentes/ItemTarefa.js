import React, { memo, useEffect } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import Cartao from './Cartao';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { buscarCategoria } from '../dados/categorias';

import {
  entradaCascata,
  mola,
  saida,
  transicaoRapida,
} from '../estilos/movimento';

import { vibrarConclusao, vibrarExclusao } from '../servicos/vibracao';

function ItemTarefa({ tarefa, indice, aoAlternar, aoExcluir }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const categoria = buscarCategoria(tarefa.categoria);

  const coresCategoria =
    tema.categorias[tarefa.categoria] || tema.categorias.estudos;

  const preenchimento = useSharedValue(tarefa.concluida ? 1 : 0);

  const escala = useSharedValue(1);

  useEffect(() => {
    preenchimento.set(withTiming(tarefa.concluida ? 1 : 0, transicaoRapida));
  }, [tarefa.concluida, preenchimento]);

  const estiloCheck = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const estiloPreenchimento = useAnimatedStyle(() => ({
    opacity: preenchimento.value,
  }));

  function alternar() {
    if (!tarefa.concluida) {
      // Pulso de escala ao concluir.
      escala.set(
        withSequence(withTiming(1.25, transicaoRapida), withSpring(1, mola))
      );

      vibrarConclusao();
    }

    aoAlternar(tarefa.id);
  }

  function excluir() {
    vibrarExclusao();

    aoExcluir(tarefa.id);
  }

  return (
    <Animated.View entering={entradaCascata(indice)} exiting={saida}>
      <Cartao vidro={false} style={estilos.container}>
        <TouchableOpacity
          style={estilos.areaTarefa}
          onPress={alternar}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: tarefa.concluida }}
          accessibilityLabel={tarefa.titulo}
          accessibilityHint={
            tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'
          }
        >
          <Animated.View style={[estilos.checkbox, estiloCheck]}>
            <Animated.View
              style={[StyleSheet.absoluteFill, estiloPreenchimento]}
            >
              <LinearGradient
                colors={coresCategoria.gradiente}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              <View style={estilos.iconeCheck}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={tema.cores.textoSobreDestaque}
                />
              </View>
            </Animated.View>
          </Animated.View>

          <View style={estilos.conteudo}>
            <Text
              style={[
                estilos.titulo,
                tarefa.concluida && estilos.tituloConcluido,
              ]}
            >
              {tarefa.titulo}
            </Text>

            <View style={estilos.informacoes}>
              <View
                style={[
                  estilos.marcador,
                  { backgroundColor: coresCategoria.cor },
                ]}
              />

              <Text style={estilos.categoria}>
                {categoria ? categoria.titulo : tarefa.categoria}
              </Text>

              <Text style={estilos.separador}>•</Text>

              <Text style={[estilos.pontos, { color: coresCategoria.cor }]}>
                +{tarefa.pontos} pts
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoExcluir}
          onPress={excluir}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Excluir ${tarefa.titulo}`}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={tema.cores.textoSecundario}
          />
        </TouchableOpacity>
      </Cartao>
    </Animated.View>
  );
}

export default memo(ItemTarefa);

const criarEstilos = tema =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: tema.raio.md,
      paddingVertical: tema.espaco.md,
      paddingLeft: tema.espaco.lg,
      paddingRight: tema.espaco.xs,
      marginBottom: tema.espaco.sm + 2,
    },

    areaTarefa: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: tema.areaToque,
    },

    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: tema.cores.bordaForte,
      overflow: 'hidden',
      marginRight: tema.espaco.md,
    },

    iconeCheck: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },

    conteudo: {
      flex: 1,
    },

    titulo: {
      ...tema.tipografia.corpoMedio,
      color: tema.cores.texto,
    },

    tituloConcluido: {
      textDecorationLine: 'line-through',
      color: tema.cores.textoSecundario,
    },

    informacoes: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: tema.espaco.xs,
    },

    marcador: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },

    categoria: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
    },

    separador: {
      marginHorizontal: 6,
      color: tema.cores.textoTerciario,
    },

    pontos: {
      ...tema.tipografia.legendaDestaque,
      ...tema.tipografia.numeros,
    },

    botaoExcluir: {
      width: tema.areaToque,
      height: tema.areaToque,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: tema.espaco.xs,
    },
  });
