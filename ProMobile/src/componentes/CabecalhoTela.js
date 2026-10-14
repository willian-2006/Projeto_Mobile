import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useEstilos, useTema } from '../contexto/TemaContexto';

export default function CabecalhoTela({ titulo, subtitulo, aoVoltar, acao }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  return (
    <View style={estilos.cabecalho}>
      {aoVoltar && (
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={aoVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={22} color={tema.cores.texto} />
        </TouchableOpacity>
      )}

      <View style={estilos.textos}>
        <Text style={estilos.titulo} accessibilityRole="header">
          {titulo}
        </Text>

        {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
      </View>

      {acao && (
        <TouchableOpacity
          style={estilos.botaoAcao}
          onPress={acao.aoPressionar}
          accessibilityRole="button"
          accessibilityLabel={acao.rotulo}
        >
          <Ionicons name={acao.icone} size={22} color={tema.cores.principal} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    cabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tema.espaco.xl,
    },

    botaoVoltar: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      backgroundColor: tema.cores.superficieVidro,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: tema.espaco.md,
    },

    textos: {
      flex: 1,
    },

    botaoAcao: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      backgroundColor: tema.cores.principalSuave,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: tema.espaco.md,
    },

    titulo: {
      ...tema.tipografia.tituloTela,
      color: tema.cores.texto,
    },

    subtitulo: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xs,
    },
  });
