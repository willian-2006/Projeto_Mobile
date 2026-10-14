import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import Avatar, { gradienteAvatar } from '../componentes/Avatar';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import SeletorMeta from '../componentes/SeletorMeta';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import {
  useEstatisticas,
  useSequencia,
  useTarefas,
} from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import {
  CORES_AVATAR,
  NOMES_CORES_AVATAR,
  TAMANHO_MAXIMO_NOME,
} from '../dados/preferencias';

import { limparDados, montarExportacao } from '../servicos/armazenamento';

import { vibrarExclusao, vibrarSelecao } from '../servicos/vibracao';

import { sugerirMeta } from '../utilitarios/preferencias';

import { contar } from '../utilitarios/textos';

const opcoesTema = [
  { chave: 'sistema', titulo: 'Sistema', icone: 'phone-portrait-outline' },
  { chave: 'escuro', titulo: 'Escuro', icone: 'moon-outline' },
  { chave: 'claro', titulo: 'Claro', icone: 'sunny-outline' },
];

export default function Perfil({ navigation }) {
  const { tema, preferencia, aoMudarPreferencia } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { preferencias, aoAtualizarPreferencias, aoRedefinirPreferencias } =
    usePreferencias();

  const { tarefas, historico, aoRedefinirTarefas } = useTarefas();

  const estatisticas = useEstatisticas();

  const sequencia = useSequencia();

  // O nome é salvo ao sair do campo, não a cada letra.
  const [nome, setNome] = useState(preferencias.nome);

  const [nomeSalvo, setNomeSalvo] = useState(preferencias.nome);

  // Se o nome mudar fora daqui (ex.: dados limpos), atualiza o campo.
  if (preferencias.nome !== nomeSalvo) {
    setNomeSalvo(preferencias.nome);
    setNome(preferencias.nome);
  }

  const metaSugerida = sugerirMeta(estatisticas.pontosMaximos);

  function salvarNome() {
    aoAtualizarPreferencias({ nome });
  }

  async function exportar() {
    try {
      await Share.share({
        title: 'Dados do ProMobile',
        message: montarExportacao({ tarefas, historico }, preferencias),
      });
    } catch (erro) {
      console.warn('Não foi possível exportar os dados.', erro);
    }
  }

  function confirmarLimpeza() {
    Alert.alert(
      'Limpar todos os dados?',
      'Tarefas, histórico, sequência e preferências serão apagados. Isso não pode ser desfeito.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            vibrarExclusao();
            await limparDados();
            aoRedefinirTarefas();
            aoRedefinirPreferencias();
          },
        },
      ]
    );
  }

  function linha({ icone, texto, detalhe, aoPressionar, cor, ultima }) {
    return (
      <TouchableOpacity
        style={[estilos.linha, ultima && estilos.ultimaLinha]}
        onPress={aoPressionar}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={detalhe ? `${texto}: ${detalhe}` : texto}
      >
        <Ionicons
          name={icone}
          size={20}
          color={cor || tema.cores.textoSecundario}
        />

        <Text style={[estilos.textoLinha, cor && { color: cor }]}>{texto}</Text>

        {detalhe ? <Text style={estilos.detalheLinha}>{detalhe}</Text> : null}

        <Ionicons
          name="chevron-forward"
          size={18}
          color={tema.cores.textoTerciario}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Tela edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela titulo="Perfil" />

        <Cartao style={estilos.cartaoPerfil}>
          <Avatar nome={nome} cor={preferencias.corAvatar} tamanho={76} />

          <TextInput
            style={estilos.nome}
            value={nome}
            onChangeText={setNome}
            onBlur={salvarNome}
            onSubmitEditing={salvarNome}
            placeholder="Seu nome"
            placeholderTextColor={tema.cores.textoSecundario}
            selectionColor={tema.cores.principal}
            maxLength={TAMANHO_MAXIMO_NOME}
            returnKeyType="done"
            textAlign="center"
            accessibilityLabel="Seu nome"
          />

          <View style={estilos.cores} accessibilityRole="radiogroup">
            {CORES_AVATAR.map(cor => {
              const ativa = preferencias.corAvatar === cor;

              return (
                <TouchableOpacity
                  key={cor}
                  onPress={() => {
                    vibrarSelecao();
                    aoAtualizarPreferencias({ corAvatar: cor });
                  }}
                  style={[estilos.opcaoCor, ativa && estilos.opcaoCorAtiva]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativa }}
                  accessibilityLabel={`Avatar ${NOMES_CORES_AVATAR[cor]}`}
                >
                  <LinearGradient
                    colors={gradienteAvatar(tema, cor)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={estilos.amostraCor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={estilos.resumo}>
            {contar(estatisticas.pontosAtuais, 'ponto')} hoje • sequência de{' '}
            {contar(sequencia.atual, 'dia')}
          </Text>
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Meta diária
        </Text>

        <Cartao style={estilos.cartaoMeta}>
          <SeletorMeta
            valor={preferencias.meta}
            aoMudar={meta => aoAtualizarPreferencias({ meta })}
          />

          {metaSugerida !== preferencias.meta ? (
            <TouchableOpacity
              onPress={() => aoAtualizarPreferencias({ meta: metaSugerida })}
              style={estilos.sugestao}
              accessibilityRole="button"
              accessibilityLabel={`Usar meta sugerida de ${metaSugerida} pontos`}
            >
              <Text style={estilos.textoSugestao}>
                Sugestão para as tarefas de hoje: {metaSugerida} pts
              </Text>
            </TouchableOpacity>
          ) : null}
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
          Configurações
        </Text>

        <Cartao style={estilos.lista}>
          {linha({
            icone: 'notifications-outline',
            texto: 'Lembretes',
            detalhe: preferencias.lembretesAtivos ? 'Ativados' : 'Desativados',
            aoPressionar: () => navigation.navigate('Lembretes'),
          })}

          {linha({
            icone: 'download-outline',
            texto: 'Exportar dados',
            aoPressionar: exportar,
          })}

          {linha({
            icone: 'trash-outline',
            texto: 'Limpar dados',
            cor: tema.cores.erro,
            aoPressionar: confirmarLimpeza,
            ultima: true,
          })}
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

    nome: {
      ...tema.tipografia.tituloSecao,
      fontSize: 22,
      color: tema.cores.texto,
      marginTop: tema.espaco.md,
      minWidth: 200,
      minHeight: tema.areaToque,
      paddingHorizontal: tema.espaco.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: tema.cores.bordaForte,
    },

    cores: {
      flexDirection: 'row',
      gap: tema.espaco.xs,
      marginTop: tema.espaco.lg,
    },

    opcaoCor: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },

    opcaoCorAtiva: {
      borderColor: tema.cores.texto,
    },

    amostraCor: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },

    resumo: {
      ...tema.tipografia.legenda,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.md,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
      marginBottom: tema.espaco.md,
    },

    cartaoMeta: {
      padding: tema.espaco.lg,
      marginBottom: tema.espaco.xxl - 4,
    },

    sugestao: {
      minHeight: tema.areaToque,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: tema.espaco.sm,
    },

    textoSugestao: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.principal,
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
      minHeight: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: tema.cores.borda,
    },

    ultimaLinha: {
      borderBottomWidth: 0,
    },

    textoLinha: {
      ...tema.tipografia.corpoMedio,
      flex: 1,
      color: tema.cores.texto,
      marginLeft: tema.espaco.md,
    },

    detalheLinha: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginRight: tema.espaco.sm,
    },
  });
