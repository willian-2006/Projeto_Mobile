import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

import Cartao from './Cartao';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { ESCALA_MAXIMA_FONTE } from '../estilos/espacamentos';

import { mola } from '../estilos/movimento';

import { brilho } from '../estilos/sombras';

import { vibrarSelecao } from '../servicos/vibracao';

const itens = {
  Inicio: {
    nome: 'Início',
    icone: 'home',
  },

  Tarefas: {
    nome: 'Tarefas',
    icone: 'checkmark-circle',
  },

  Estatisticas: {
    nome: 'Estatísticas',
    icone: 'stats-chart',
  },

  Rotina: {
    nome: 'Rotina',
    icone: 'calendar',
  },

  Perfil: {
    nome: 'Perfil',
    icone: 'person',
  },
};

const RECUO_INDICADOR = 4;

// Barra flutuante usada pelo bottom-tabs (prop `tabBar`). O
// indicador desliza até a aba ativa.
export default function NavegacaoInferior({ state, navigation, insets }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const [largura, setLargura] = useState(0);

  const larguraItem = largura / state.routes.length;

  const posicao = useSharedValue(0);

  useEffect(() => {
    posicao.set(withSpring(state.index * larguraItem, mola));
  }, [state.index, larguraItem, posicao]);

  const estiloIndicador = useAnimatedStyle(() => ({
    transform: [{ translateX: posicao.value }],
  }));

  return (
    <View
      style={[
        estilos.posicionamento,
        { paddingBottom: Math.max(insets.bottom, tema.espaco.md) },
      ]}
    >
      <View style={estilos.sombra}>
        <Cartao style={estilos.barra}>
          <View
            style={estilos.itens}
            onLayout={evento => setLargura(evento.nativeEvent.layout.width)}
          >
            {largura > 0 && (
              <Animated.View
                style={[
                  estilos.indicador,
                  { width: larguraItem - RECUO_INDICADOR * 2 },
                  estiloIndicador,
                ]}
              />
            )}

            {state.routes.map((rota, indice) => {
              const item = itens[rota.name];

              const ativo = state.index === indice;

              function aoPressionar() {
                const evento = navigation.emit({
                  type: 'tabPress',
                  target: rota.key,
                  canPreventDefault: true,
                });

                if (!ativo && !evento.defaultPrevented) {
                  vibrarSelecao();
                  navigation.navigate(rota.name);
                }
              }

              return (
                <TouchableOpacity
                  key={rota.key}
                  style={estilos.item}
                  activeOpacity={0.7}
                  onPress={aoPressionar}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ativo }}
                  accessibilityLabel={item.nome}
                >
                  <Ionicons
                    name={ativo ? item.icone : `${item.icone}-outline`}
                    size={22}
                    color={
                      ativo ? tema.cores.principal : tema.cores.textoSecundario
                    }
                  />

                  <Text
                    style={[estilos.texto, ativo && estilos.textoAtivo]}
                    numberOfLines={1}
                    maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
                  >
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Cartao>
      </View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    posicionamento: {
      paddingHorizontal: tema.espaco.lg,
      paddingTop: tema.espaco.sm,
      backgroundColor: tema.cores.fundo,
    },

    sombra: {
      borderRadius: tema.raio.lg,
      ...brilho(tema.cores.sombra, 0.6, tema.cores.superficie),
    },

    barra: {
      borderRadius: tema.raio.lg,
    },

    itens: {
      flexDirection: 'row',
      paddingVertical: tema.espaco.sm,
    },

    indicador: {
      position: 'absolute',
      left: RECUO_INDICADOR,
      top: tema.espaco.xs,
      bottom: tema.espaco.xs,
      borderRadius: tema.raio.md,
      backgroundColor: tema.cores.principalSuave,
    },

    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: tema.areaToque + 8,
    },

    texto: {
      ...tema.tipografia.rotulo,
      marginTop: tema.espaco.xs,
      color: tema.cores.textoSecundario,
    },

    textoAtivo: {
      fontFamily: tema.fontes.corpoNegrito,
      color: tema.cores.principal,
    },
  });
