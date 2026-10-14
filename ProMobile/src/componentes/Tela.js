import React from 'react';

import { View, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';

import { useEstilos, useTema } from '../contexto/TemaContexto';

export default function Tela({ children, edges }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  return (
    <SafeAreaView style={estilos.areaSegura} edges={edges}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={[tema.cores.decoracao[0], 'transparent']}
          style={[estilos.bolha, estilos.bolhaTopo]}
        />

        <LinearGradient
          colors={['transparent', tema.cores.decoracao[1]]}
          style={[estilos.bolha, estilos.bolhaBase]}
        />
      </View>

      {children}
    </SafeAreaView>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    areaSegura: {
      flex: 1,
      backgroundColor: tema.cores.fundo,
    },

    bolha: {
      position: 'absolute',
      width: 340,
      height: 340,
      borderRadius: 170,
    },

    bolhaTopo: {
      top: -170,
      right: -120,
    },

    bolhaBase: {
      bottom: -200,
      left: -150,
    },
  });
