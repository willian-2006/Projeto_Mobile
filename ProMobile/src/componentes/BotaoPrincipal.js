import React from 'react';

import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { brilho } from '../estilos/sombras';

export default function BotaoPrincipal({
  titulo,
  aoPressionar,
  desativado = false,
  style,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  return (
    <TouchableOpacity
      style={[
        estilos.botao,
        !desativado && brilho(tema.cores.principal, 0.6, tema.cores.principal),
        desativado && estilos.desativado,
        style,
      ]}
      onPress={aoPressionar}
      disabled={desativado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado }}
      accessibilityLabel={titulo}
    >
      <LinearGradient
        colors={tema.cores.gradientePrincipal}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={estilos.gradiente}
      >
        <Text style={estilos.texto}>{titulo}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    botao: {
      height: 54,
      borderRadius: tema.raio.md,
    },

    desativado: {
      opacity: 0.45,
    },

    gradiente: {
      flex: 1,
      borderRadius: tema.raio.md,
      justifyContent: 'center',
      alignItems: 'center',
    },

    texto: {
      fontFamily: tema.fontes.tituloMedio,
      fontSize: 16,
      color: tema.cores.textoSobreDestaque,
    },
  });
