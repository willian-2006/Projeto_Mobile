import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import Tela from '../componentes/Tela';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { vibrarSelecao } from '../servicos/vibracao';

const opcoesTema = [
  { chave: 'sistema', titulo: 'Sistema', icone: 'phone-portrait-outline' },
  { chave: 'escuro', titulo: 'Escuro', icone: 'moon-outline' },
  { chave: 'claro', titulo: 'Claro', icone: 'sunny-outline' },
];

// Nome e avatar ainda fixos: perfil e configurações chegam na Fase 4.
const recursosFuturos = [
  { icone: 'person-circle-outline', texto: 'Nome e avatar' },
  { icone: 'flag-outline', texto: 'Meta diária' },
  { icone: 'notifications-outline', texto: 'Lembretes' },
  { icone: 'download-outline', texto: 'Exportar e limpar dados' },
];

export default function Perfil() {
  const { tema, preferencia, aoMudarPreferencia } = useTema();

  const estilos = useEstilos(criarEstilos);

  const estatisticas = useEstatisticas();

  return (
    <Tela edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela titulo="Perfil" />

        <Cartao style={estilos.cartaoPerfil}>
          <LinearGradient
            colors={tema.cores.gradientePrincipal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.avatar}
          >
            <Text style={estilos.letraAvatar}>W</Text>
          </LinearGradient>

          <Text style={estilos.nome}>Willian</Text>

          <Text style={estilos.resumo}>
            {estatisticas.pontosAtuais} pontos hoje • {estatisticas.concluidas}{' '}
            {estatisticas.concluidas === 1
              ? 'tarefa concluída'
              : 'tarefas concluídas'}
          </Text>
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Aparência
        </Text>

        <Cartao style={estilos.seletor} accessibilityRole="radiogroup">
          {opcoesTema.map(opcao => {
            const ativo = preferencia === opcao.chave;

            return (
              <TouchableOpacity
                key={opcao.chave}
                style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
                onPress={() => {
                  vibrarSelecao();
                  aoMudarPreferencia(opcao.chave);
                }}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: ativo }}
                accessibilityLabel={`Tema ${opcao.titulo}`}
              >
                <Ionicons
                  name={opcao.icone}
                  size={18}
                  color={
                    ativo ? tema.cores.principal : tema.cores.textoSecundario
                  }
                />

                <Text
                  style={[estilos.textoOpcao, ativo && estilos.textoOpcaoAtiva]}
                >
                  {opcao.titulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Em breve
        </Text>

        <Cartao style={estilos.lista}>
          {recursosFuturos.map((recurso, indice) => (
            <View
              key={recurso.texto}
              style={[
                estilos.linha,
                indice === recursosFuturos.length - 1 && estilos.ultimaLinha,
              ]}
            >
              <Ionicons
                name={recurso.icone}
                size={20}
                color={tema.cores.textoTerciario}
              />

              <Text style={estilos.textoLinha}>{recurso.texto}</Text>
            </View>
          ))}
        </Cartao>
      </ScrollView>
    </Tela>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    conteudoRolagem: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xl - 4,
      paddingBottom: tema.espaco.xl - 4,
    },

    cartaoPerfil: {
      padding: tema.espaco.xl,
      alignItems: 'center',
      marginBottom: tema.espaco.xxl - 4,
    },

    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      justifyContent: 'center',
      alignItems: 'center',
    },

    letraAvatar: {
      fontFamily: tema.fontes.titulo,
      fontSize: 30,
      color: tema.cores.textoSobreDestaque,
    },

    nome: {
      ...tema.tipografia.tituloSecao,
      fontSize: 22,
      color: tema.cores.texto,
      marginTop: tema.espaco.md,
    },

    resumo: {
      ...tema.tipografia.legenda,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xs,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
      marginBottom: tema.espaco.md,
    },

    seletor: {
      flexDirection: 'row',
      padding: tema.espaco.xs,
      marginBottom: tema.espaco.xxl - 4,
    },

    opcao: {
      flex: 1,
      minHeight: tema.areaToque,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: tema.raio.md,
    },

    opcaoAtiva: {
      backgroundColor: tema.cores.principalSuave,
    },

    textoOpcao: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      marginLeft: 6,
    },

    textoOpcaoAtiva: {
      fontFamily: tema.fontes.corpoNegrito,
      color: tema.cores.principal,
    },

    lista: {
      paddingHorizontal: tema.espaco.lg,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: tema.cores.borda,
    },

    ultimaLinha: {
      borderBottomWidth: 0,
    },

    textoLinha: {
      ...tema.tipografia.corpo,
      color: tema.cores.textoSecundario,
      marginLeft: tema.espaco.md,
    },
  });
