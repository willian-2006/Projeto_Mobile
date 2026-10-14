import React, { memo, useEffect } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

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

import { descreverRecorrencia } from '../utilitarios/tarefas';

const LIMITE_DESLIZE = 96;

function ItemTarefa({
  tarefa,
  indice,
  aoAlternar,
  aoExcluir,
  aoAbrir,
  aoSegurar,
  animarEntrada = true,
}) {
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

  function renderizarAcaoExcluir() {
    return (
      <View style={estilos.acaoExcluir}>
        <Ionicons name="trash-outline" size={20} color={tema.cores.erro} />

        <Text style={estilos.textoExcluir}>Excluir</Text>
      </View>
    );
  }

  const recorrencia =
    tarefa.recorrencia?.tipo !== 'diaria'
      ? descreverRecorrencia(tarefa.recorrencia)
      : null;

  return (
    <Animated.View
      entering={animarEntrada ? entradaCascata(indice) : undefined}
      exiting={saida}
    >
      <Swipeable
        renderRightActions={renderizarAcaoExcluir}
        rightThreshold={LIMITE_DESLIZE}
        friction={1.5}
        overshootRight={false}
        onSwipeableOpen={excluir}
        containerStyle={estilos.deslize}
      >
        <Cartao vidro={false} style={estilos.container}>
          <TouchableOpacity
            style={estilos.areaCheck}
            onPress={alternar}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: tarefa.concluida }}
            accessibilityLabel={tarefa.titulo}
            accessibilityHint={
              tarefa.concluida
                ? 'Marcar como pendente'
                : 'Marcar como concluída'
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
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.conteudo}
            onPress={() => aoAbrir?.(tarefa.id)}
            onLongPress={aoSegurar}
            delayLongPress={250}
            disabled={!aoAbrir && !aoSegurar}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${tarefa.titulo}`}
            accessibilityHint={
              aoSegurar ? 'Segure e arraste para reordenar' : undefined
            }
          >
            <View style={estilos.linhaTitulo}>
              {tarefa.prioridade === 'alta' && (
                <Ionicons
                  name="flag"
                  size={13}
                  color={tema.cores.alerta}
                  style={estilos.iconePrioridade}
                  accessibilityLabel="Prioridade alta"
                />
              )}

              <Text
                style={[
                  estilos.titulo,
                  tarefa.concluida && estilos.tituloConcluido,
                ]}
                numberOfLines={2}
              >
                {tarefa.titulo}
              </Text>
            </View>

            <View style={estilos.informacoes}>
              <View
                style={[
                  estilos.marcador,
                  { backgroundColor: coresCategoria.cor },
                ]}
              />

              <Text style={estilos.detalhe}>
                {categoria ? categoria.titulo : tarefa.categoria}
              </Text>

              <Text style={estilos.separador}>•</Text>

              <Text style={[estilos.pontos, { color: coresCategoria.cor }]}>
                +{tarefa.pontos} pts
              </Text>

              {tarefa.horario ? (
                <>
                  <Text style={estilos.separador}>•</Text>

                  <Ionicons
                    name={tarefa.lembrete ? 'notifications' : 'time-outline'}
                    size={12}
                    color={tema.cores.textoSecundario}
                  />

                  <Text style={[estilos.detalhe, estilos.horario]}>
                    {tarefa.horario}
                  </Text>
                </>
              ) : null}

              {recorrencia ? (
                <>
                  <Text style={estilos.separador}>•</Text>

                  <Text style={estilos.detalhe} numberOfLines={1}>
                    {recorrencia}
                  </Text>
                </>
              ) : null}
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
      </Swipeable>
    </Animated.View>
  );
}

export default memo(ItemTarefa);

const criarEstilos = tema =>
  StyleSheet.create({
    deslize: {
      marginBottom: tema.espaco.sm + 2,
      borderRadius: tema.raio.md,
    },

    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: tema.raio.md,
      paddingVertical: tema.espaco.sm,
      paddingLeft: tema.espaco.xs,
      paddingRight: tema.espaco.xs,
    },

    areaCheck: {
      width: tema.areaToque + 4,
      height: tema.areaToque,
      justifyContent: 'center',
      alignItems: 'center',
    },

    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: tema.cores.bordaForte,
      overflow: 'hidden',
    },

    iconeCheck: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },

    conteudo: {
      flex: 1,
      minHeight: tema.areaToque,
      justifyContent: 'center',
      paddingLeft: tema.espaco.xs,
    },

    linhaTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconePrioridade: {
      marginRight: tema.espaco.xs,
    },

    titulo: {
      ...tema.tipografia.corpoMedio,
      flexShrink: 1,
      color: tema.cores.texto,
    },

    tituloConcluido: {
      textDecorationLine: 'line-through',
      color: tema.cores.textoSecundario,
    },

    informacoes: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: tema.espaco.xs,
    },

    marcador: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },

    detalhe: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
    },

    horario: {
      ...tema.tipografia.numeros,
      fontFamily: tema.fontes.corpo,
      marginLeft: 3,
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

    acaoExcluir: {
      width: LIMITE_DESLIZE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: tema.raio.md,
      marginLeft: tema.espaco.sm,
      backgroundColor: tema.cores.superficieElevada,
    },

    textoExcluir: {
      ...tema.tipografia.legendaDestaque,
      color: tema.cores.erro,
      marginTop: 2,
    },
  });
