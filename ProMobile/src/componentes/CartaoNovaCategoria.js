import React from 'react';

import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { entradaCascata } from '../estilos/movimento';

import { contar } from '../utilitarios/textos';

export default function CartaoNovaCategoria({ vagas, indice, aoPressionar }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  return (
    <Animated.View style={estilos.envoltorio} entering={entradaCascata(indice)}>
      <TouchableOpacity
        style={estilos.cartao}
        onPress={aoPressionar}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Nova categoria"
        accessibilityHint={`Você ainda pode criar ${contar(vagas, 'categoria')}`}
      >
        <View style={estilos.icone}>
          <Ionicons name="add" size={24} color={tema.cores.principal} />
        </View>

        <Text style={estilos.titulo}>Nova categoria</Text>

        <Text style={estilos.detalhe}>
          {vagas === 1 ? 'Resta 1 vaga' : `Restam ${vagas} vagas`}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    envoltorio: {
      width: '48%',
      minHeight: 128,
      marginBottom: tema.espaco.md,
    },

    cartao: {
      flex: 1,
      padding: tema.espaco.lg,
      borderRadius: tema.raio.md + 4,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: tema.cores.bordaForte,
      backgroundColor: tema.cores.principalSuave,
      justifyContent: 'center',
      alignItems: 'center',
    },

    icone: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: tema.cores.superficieVidro,
      justifyContent: 'center',
      alignItems: 'center',
    },

    titulo: {
      ...tema.tipografia.tituloCartao,
      fontSize: 15,
      color: tema.cores.texto,
      marginTop: tema.espaco.sm,
      textAlign: 'center',
    },

    detalhe: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: 2,
      textAlign: 'center',
    },
  });
