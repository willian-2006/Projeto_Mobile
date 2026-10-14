import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { META_MAXIMA, META_MINIMA, PASSO_META } from '../dados/preferencias';

import { ESCALA_MAXIMA_FONTE } from '../estilos/espacamentos';

import { vibrarSelecao } from '../servicos/vibracao';

import { limitarMeta } from '../utilitarios/preferencias';

// Meta diária em pontos, de 10 em 10, com botões − e +.
export default function SeletorMeta({ valor, aoMudar }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  function mudar(diferenca) {
    const novo = limitarMeta(valor + diferenca);

    if (novo !== valor) {
      vibrarSelecao();
      aoMudar(novo);
    }
  }

  function botao(icone, diferenca, rotulo, desativado) {
    return (
      <TouchableOpacity
        style={[estilos.botao, desativado && estilos.desativado]}
        onPress={() => mudar(diferenca)}
        disabled={desativado}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled: desativado }}
      >
        <Ionicons name={icone} size={22} color={tema.cores.principal} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.container}>
      {botao('remove', -PASSO_META, 'Diminuir meta', valor <= META_MINIMA)}

      <View style={estilos.valor}>
        <Text
          style={estilos.numero}
          maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
        >
          {valor}
        </Text>

        <Text style={estilos.unidade}>pontos por dia</Text>
      </View>

      {botao('add', PASSO_META, 'Aumentar meta', valor >= META_MAXIMA)}
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    botao: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: tema.cores.principalSuave,
      justifyContent: 'center',
      alignItems: 'center',
    },

    desativado: {
      opacity: 0.4,
    },

    valor: {
      alignItems: 'center',
    },

    numero: {
      ...tema.tipografia.numeros,
      fontSize: 36,
      color: tema.cores.texto,
    },

    unidade: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
    },
  });
