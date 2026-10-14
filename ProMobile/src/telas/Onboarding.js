import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

import Animated, { FadeInRight, ReduceMotion } from 'react-native-reanimated';

import BotaoPrincipal from '../componentes/BotaoPrincipal';

import Chip from '../componentes/Chip';

import IconeGradiente from '../componentes/IconeGradiente';

import SeletorMeta from '../componentes/SeletorMeta';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { TAMANHO_MAXIMO_NOME } from '../dados/preferencias';

import { sugerirMeta } from '../utilitarios/preferencias';

const entradaPasso = FadeInRight.duration(300).reduceMotion(
  ReduceMotion.System
);

const PASSOS = [
  {
    icone: 'sparkles',
    titulo: 'Boas-vindas ao ProMobile',
    subtitulo: 'Transforme sua rotina em pontos. Como podemos te chamar?',
  },
  {
    icone: 'star',
    titulo: 'O que é prioridade?',
    subtitulo:
      'Escolha suas áreas favoritas. Elas aparecem primeiro no app (dá para pular).',
  },
  {
    icone: 'flag',
    titulo: 'Sua meta diária',
    subtitulo:
      'Quantos pontos você quer fazer por dia? Dá para mudar depois no Perfil.',
  },
];

// Três passos na primeira abertura: nome, categorias favoritas e meta.
export default function Onboarding() {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { preferencias, aoAtualizarPreferencias } = usePreferencias();

  const { pontosMaximos } = useEstatisticas();

  const [passo, setPasso] = useState(0);

  const [nome, setNome] = useState(preferencias.nome);

  const [favoritas, setFavoritas] = useState(preferencias.categoriasFavoritas);

  // Quem já usava o app mantém a meta; na primeira vez, vem a sugestão.
  const [meta, setMeta] = useState(() =>
    preferencias.nome ? preferencias.meta : sugerirMeta(pontosMaximos)
  );

  const ultimo = passo === PASSOS.length - 1;

  function alternarFavorita(chave) {
    setFavoritas(atuais =>
      atuais.includes(chave)
        ? atuais.filter(item => item !== chave)
        : [...atuais, chave]
    );
  }

  function concluir() {
    aoAtualizarPreferencias({
      nome,
      categoriasFavoritas: favoritas,
      meta,
      onboardingConcluido: true,
    });
  }

  function avancar() {
    if (ultimo) {
      concluir();
    } else {
      setPasso(passo + 1);
    }
  }

  const atual = PASSOS[passo];

  return (
    <Tela>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={estilos.topo}>
          <View
            style={estilos.indicadores}
            accessible
            accessibilityLabel={`Passo ${passo + 1} de ${PASSOS.length}`}
          >
            {PASSOS.map((item, indice) => (
              <View
                key={item.titulo}
                style={[
                  estilos.indicador,
                  indice <= passo && estilos.indicadorAtivo,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={estilos.botaoTexto}
            onPress={concluir}
            accessibilityRole="button"
            accessibilityLabel="Pular introdução"
          >
            <Text style={estilos.textoBotao}>Pular</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={estilos.flex}
          contentContainerStyle={estilos.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={passo} entering={entradaPasso}>
            <IconeGradiente
              icone={atual.icone}
              tamanho={64}
              tamanhoIcone={30}
              redondo
            />

            <Text style={estilos.titulo} accessibilityRole="header">
              {atual.titulo}
            </Text>

            <Text style={estilos.subtitulo}>{atual.subtitulo}</Text>

            {passo === 0 && (
              <TextInput
                style={estilos.input}
                value={nome}
                onChangeText={setNome}
                onSubmitEditing={avancar}
                placeholder="Seu nome"
                placeholderTextColor={tema.cores.textoSecundario}
                selectionColor={tema.cores.principal}
                maxLength={TAMANHO_MAXIMO_NOME}
                autoFocus={!nome}
                autoCapitalize="words"
                returnKeyType="next"
                accessibilityLabel="Seu nome"
              />
            )}

            {passo === 1 && (
              <View style={estilos.categorias}>
                {CATEGORIAS.map(categoria => (
                  <Chip
                    key={categoria.chave}
                    titulo={categoria.titulo}
                    icone={categoria.icone}
                    multipla
                    ativo={favoritas.includes(categoria.chave)}
                    cor={tema.categorias[categoria.chave].cor}
                    corSuave={tema.categorias[categoria.chave].corSuave}
                    aoPressionar={() => alternarFavorita(categoria.chave)}
                  />
                ))}
              </View>
            )}

            {passo === 2 && (
              <View style={estilos.meta}>
                <SeletorMeta valor={meta} aoMudar={setMeta} />

                <Text style={estilos.dica}>
                  Suas tarefas de hoje somam {pontosMaximos} pontos.
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        <View style={estilos.rodape}>
          {passo > 0 ? (
            <TouchableOpacity
              style={estilos.botaoTexto}
              onPress={() => setPasso(passo - 1)}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Text style={estilos.textoBotao}>Voltar</Text>
            </TouchableOpacity>
          ) : null}

          <BotaoPrincipal
            titulo={ultimo ? 'Começar' : 'Continuar'}
            aoPressionar={avancar}
            style={estilos.botaoPrincipal}
          />
        </View>
      </KeyboardAvoidingView>
    </Tela>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    topo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.md,
    },

    indicadores: {
      flexDirection: 'row',
      gap: tema.espaco.xs + 2,
    },

    indicador: {
      width: 28,
      height: 6,
      borderRadius: 3,
      backgroundColor: tema.cores.superficieElevada,
    },

    indicadorAtivo: {
      backgroundColor: tema.cores.principal,
    },

    conteudo: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xxl * 1.5,
      paddingBottom: tema.espaco.xl,
    },

    titulo: {
      ...tema.tipografia.tituloTela,
      fontSize: 30,
      color: tema.cores.texto,
      marginTop: tema.espaco.xl,
    },

    subtitulo: {
      ...tema.tipografia.corpo,
      fontSize: 16,
      lineHeight: 23,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.sm,
    },

    input: {
      ...tema.tipografia.corpoMedio,
      fontSize: 18,
      height: 56,
      marginTop: tema.espaco.xl,
      backgroundColor: tema.cores.superficieVidro,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      borderRadius: tema.raio.md,
      paddingHorizontal: tema.espaco.lg,
      color: tema.cores.texto,
    },

    categorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tema.espaco.sm,
      marginTop: tema.espaco.xl,
    },

    meta: {
      marginTop: tema.espaco.xl,
    },

    dica: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      textAlign: 'center',
      marginTop: tema.espaco.lg,
    },

    rodape: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tema.espaco.xl - 4,
      paddingBottom: tema.espaco.lg,
      gap: tema.espaco.md,
    },

    botaoTexto: {
      minHeight: tema.areaToque,
      minWidth: tema.areaToque,
      paddingHorizontal: tema.espaco.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },

    textoBotao: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 15,
      color: tema.cores.textoSecundario,
    },

    botaoPrincipal: {
      flex: 1,
    },
  });
