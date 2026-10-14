import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { useEstilos, useTema } from '../contexto/TemaContexto';

export default function Cabecalho() {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const navigation = useNavigation();

  return (
    <View style={estilos.container}>
      <View style={estilos.textos}>
        <Text style={estilos.saudacao}>Olá, Willian</Text>

        <Text style={estilos.subtitulo}>Vamos cumprir suas metas de hoje?</Text>
      </View>

      <View style={estilos.acoes}>
        <TouchableOpacity
          style={estilos.botaoNotificacao}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={tema.cores.texto}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Perfil')}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
        >
          <LinearGradient
            colors={tema.cores.gradientePrincipal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.avatar}
          >
            <Text style={estilos.letraAvatar}>W</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tema.espaco.xl,
    },

    textos: {
      flex: 1,
    },

    saudacao: {
      ...tema.tipografia.tituloTela,
      color: tema.cores.texto,
    },

    subtitulo: {
      ...tema.tipografia.corpo,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xs,
    },

    acoes: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tema.espaco.sm + 2,
    },

    botaoNotificacao: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      backgroundColor: tema.cores.superficieVidro,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      justifyContent: 'center',
      alignItems: 'center',
    },

    avatar: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },

    letraAvatar: {
      fontFamily: tema.fontes.titulo,
      fontSize: 18,
      color: tema.cores.textoSobreDestaque,
    },
  });
