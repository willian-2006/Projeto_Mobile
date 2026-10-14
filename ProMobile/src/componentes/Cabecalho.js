import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import Avatar from './Avatar';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useSequencia } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

function saudacao(hora) {
  if (hora < 12) {
    return 'Bom dia';
  }

  return hora < 18 ? 'Boa tarde' : 'Boa noite';
}

export default function Cabecalho() {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const navigation = useNavigation();

  const { preferencias } = usePreferencias();

  const sequencia = useSequencia();

  const nome = preferencias.nome;

  const textoSaudacao = saudacao(new Date().getHours());

  return (
    <View style={estilos.container}>
      <View style={estilos.textos}>
        <Text style={estilos.saudacao} numberOfLines={1}>
          {nome ? `${textoSaudacao}, ${nome}` : textoSaudacao}
        </Text>

        {sequencia.atual > 0 ? (
          <View style={estilos.linhaSequencia}>
            <Ionicons name="flame" size={15} color={tema.cores.alerta} />

            <Text style={estilos.sequencia}>
              {sequencia.atual === 1
                ? '1 dia seguido batendo a meta'
                : `${sequencia.atual} dias seguidos batendo a meta`}
            </Text>
          </View>
        ) : (
          <Text style={estilos.subtitulo}>
            Vamos cumprir suas metas de hoje?
          </Text>
        )}
      </View>

      <View style={estilos.acoes}>
        <TouchableOpacity
          style={estilos.botaoNotificacao}
          onPress={() => navigation.navigate('Perfil')}
          accessibilityRole="button"
          accessibilityLabel="Lembretes"
          accessibilityHint="Abre as configurações de lembretes"
        >
          <Ionicons
            name={
              preferencias.lembretesAtivos
                ? 'notifications'
                : 'notifications-outline'
            }
            size={22}
            color={tema.cores.texto}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Perfil')}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil"
        >
          <Avatar nome={nome} cor={preferencias.corAvatar} />
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
      marginRight: tema.espaco.sm,
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

    linhaSequencia: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: tema.espaco.xs,
    },

    sequencia: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.alerta,
      marginLeft: tema.espaco.xs,
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
  });
