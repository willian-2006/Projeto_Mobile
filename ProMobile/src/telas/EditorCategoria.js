import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import BotaoPrincipal from '../componentes/BotaoPrincipal';

import CartaoCategoria from '../componentes/CartaoCategoria';

import Icone from '../componentes/Icone';

import { useAviso } from '../contexto/AvisoContexto';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import {
  ICONES_CATEGORIA,
  PALETAS_CATEGORIA,
  TAMANHO_MAXIMO_NOME_CATEGORIA,
} from '../dados/categorias';

import { coresDaCategoria } from '../estilos/tema';

import { useCategorias } from '../hooks/useCategorias';

import { useExclusaoCategoria } from '../hooks/useExclusaoCategoria';

import { vibrarSelecao } from '../servicos/vibracao';

import {
  limparNomeCategoria,
  validarNomeCategoria,
} from '../utilitarios/categorias';

import { resumoDaCategoria } from '../utilitarios/pontuacao';

export default function EditorCategoria({ route, navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { mostrarAviso } = useAviso();

  const estatisticas = useEstatisticas();

  const { categorias, podeCriar, total, limite, buscar, aoSalvarCategoria } =
    useCategorias();

  const pedirExclusao = useExclusaoCategoria();

  const chaveEditada = route.params?.chave ?? null;

  const existente = chaveEditada ? buscar(chaveEditada) : null;

  const [campos, setCampos] = useState(() => ({
    titulo: existente?.titulo ?? '',
    icone: existente?.icone ?? ICONES_CATEGORIA[0].chave,
    paleta: existente?.paleta ?? PALETAS_CATEGORIA[0].chave,
  }));

  const [tocouNome, setTocouNome] = useState(false);

  function alterar(alteracoes) {
    setCampos(atuais => ({ ...atuais, ...alteracoes }));
  }

  const titulo = limparNomeCategoria(campos.titulo);

  const erroNome = validarNomeCategoria(
    campos.titulo,
    categorias,
    chaveEditada
  );

  const mostrarErro = Boolean(erroNome) && (tocouNome || titulo !== '');

  const semVaga = !existente && !podeCriar;

  const podeSalvar = !erroNome && !semVaga;

  const resumo = resumoDaCategoria(estatisticas, chaveEditada);

  const cores = coresDaCategoria(tema, campos);

  function fechar() {
    navigation.goBack();
  }

  function salvar() {
    if (!podeSalvar) {
      setTocouNome(true);
      return;
    }

    aoSalvarCategoria({
      chave: existente?.chave,
      titulo,
      icone: campos.icone,
      paleta: campos.paleta,
    });

    mostrarAviso({
      mensagem: existente
        ? `Categoria "${titulo}" atualizada.`
        : `Categoria "${titulo}" criada.`,
    });

    fechar();
  }

  if (chaveEditada && (!existente || !existente.personalizada)) {
    return (
      <View style={estilos.tela}>
        <View style={estilos.conteudo}>
          <View style={estilos.cabecalho}>
            <Text style={estilos.tituloTela}>Categoria indisponível</Text>

            <BotaoFechar aoPressionar={fechar} estilos={estilos} tema={tema} />
          </View>

          <Text style={estilos.aviso}>
            Esta categoria não existe mais ou não pode ser editada.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <View style={estilos.cabecalho}>
          <View>
            <Text style={estilos.tituloTela} accessibilityRole="header">
              {existente ? 'Editar categoria' : 'Nova categoria'}
            </Text>

            <Text style={estilos.subtituloTela}>
              {existente
                ? `${total}/${limite} categorias`
                : `${total + 1}/${limite} categorias após criar`}
            </Text>
          </View>

          <BotaoFechar aoPressionar={fechar} estilos={estilos} tema={tema} />
        </View>

        <View style={estilos.areaPrevia}>
          <CartaoCategoria
            previa
            categoria={{ ...campos, titulo }}
            tarefas={resumo.tarefas}
            pontos={resumo.pontos}
            style={estilos.previa}
          />
        </View>

        <View style={estilos.linhaRotulo}>
          <Text style={estilos.rotulo}>Nome</Text>

          <Text
            style={estilos.contador}
            accessibilityLabel={`${campos.titulo.length} de ${TAMANHO_MAXIMO_NOME_CATEGORIA} caracteres`}
          >
            {campos.titulo.length}/{TAMANHO_MAXIMO_NOME_CATEGORIA}
          </Text>
        </View>

        <TextInput
          style={[
            estilos.input,
            mostrarErro && { borderColor: tema.cores.erro },
          ]}
          placeholder="Ex.: Finanças, Treino, Leitura"
          placeholderTextColor={tema.cores.textoSecundario}
          selectionColor={cores.cor}
          value={campos.titulo}
          onChangeText={texto => alterar({ titulo: texto })}
          onBlur={() => setTocouNome(true)}
          maxLength={TAMANHO_MAXIMO_NOME_CATEGORIA}
          autoFocus={!existente}
          autoCapitalize="sentences"
          returnKeyType="done"
          accessibilityLabel="Nome da categoria"
          accessibilityHint={`Até ${TAMANHO_MAXIMO_NOME_CATEGORIA} caracteres`}
        />

        {mostrarErro ? (
          <Text style={estilos.erro} accessibilityLiveRegion="polite">
            {erroNome}
          </Text>
        ) : null}

        <Text style={estilos.rotulo}>Ícone</Text>

        <View style={estilos.gradeIcones} accessibilityRole="radiogroup">
          {ICONES_CATEGORIA.map(icone => {
            const ativo = campos.icone === icone.chave;

            return (
              <TouchableOpacity
                key={icone.chave}
                onPress={() => {
                  vibrarSelecao();
                  alterar({ icone: icone.chave });
                }}
                style={[
                  estilos.opcaoIcone,
                  ativo && {
                    backgroundColor: cores.corSuave,
                    borderColor: cores.cor,
                  },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: ativo }}
                accessibilityLabel={icone.titulo}
              >
                <Icone
                  nome={ativo ? icone.chave : `${icone.chave}-outline`}
                  size={22}
                  color={ativo ? cores.cor : tema.cores.textoSecundario}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={estilos.rotulo}>Cor</Text>

        <View style={estilos.gradeCores} accessibilityRole="radiogroup">
          {PALETAS_CATEGORIA.map(paleta => {
            const ativa = campos.paleta === paleta.chave;

            return (
              <TouchableOpacity
                key={paleta.chave}
                onPress={() => {
                  vibrarSelecao();
                  alterar({ paleta: paleta.chave });
                }}
                style={[estilos.opcaoCor, ativa && estilos.opcaoCorAtiva]}
                accessibilityRole="radio"
                accessibilityState={{ checked: ativa }}
                accessibilityLabel={paleta.titulo}
              >
                <LinearGradient
                  colors={tema.paletasCategoria[paleta.chave].gradiente}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={estilos.amostraCor}
                >
                  {ativa ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={tema.cores.textoSobreDestaque}
                    />
                  ) : null}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {semVaga ? (
          <Text style={estilos.aviso}>
            Você já tem {limite} categorias, o máximo permitido. Exclua uma
            categoria personalizada para liberar espaço.
          </Text>
        ) : null}

        <BotaoPrincipal
          titulo={existente ? 'Salvar alterações' : 'Criar categoria'}
          aoPressionar={salvar}
          desativado={!podeSalvar}
          style={estilos.botaoSalvar}
        />

        {existente ? (
          <TouchableOpacity
            style={estilos.botaoExcluir}
            onPress={() => pedirExclusao(existente, fechar)}
            accessibilityRole="button"
            accessibilityLabel={`Excluir categoria ${existente.titulo}`}
          >
            <Ionicons name="trash-outline" size={18} color={tema.cores.erro} />

            <Text style={estilos.textoExcluir}>Excluir categoria</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

function BotaoFechar({ aoPressionar, estilos, tema }) {
  return (
    <TouchableOpacity
      style={estilos.botaoFechar}
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel="Fechar"
    >
      <Ionicons name="close" size={22} color={tema.cores.textoSecundario} />
    </TouchableOpacity>
  );
}

const TAMANHO_OPCAO = 48;

const criarEstilos = tema =>
  StyleSheet.create({
    tela: {
      flex: 1,
      backgroundColor: tema.cores.superficie,
    },

    conteudo: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xl,
      paddingBottom: tema.espaco.xxl * 1.5,
    },

    cabecalho: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },

    tituloTela: {
      ...tema.tipografia.tituloTela,
      fontSize: 22,
      color: tema.cores.texto,
    },

    subtituloTela: {
      ...tema.tipografia.legenda,
      ...tema.tipografia.numeros,
      fontFamily: tema.fontes.corpo,
      color: tema.cores.textoSecundario,
      marginTop: 2,
    },

    botaoFechar: {
      width: tema.areaToque,
      height: tema.areaToque,
      borderRadius: tema.areaToque / 2,
      marginRight: -tema.espaco.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },

    areaPrevia: {
      alignItems: 'center',
      marginTop: tema.espaco.lg,
      paddingVertical: tema.espaco.lg,
      borderRadius: tema.raio.md + 4,
      backgroundColor: tema.cores.fundo,
    },

    previa: {
      width: '56%',
      marginBottom: 0,
    },

    linhaRotulo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },

    rotulo: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.xl,
      marginBottom: tema.espaco.sm,
    },

    contador: {
      ...tema.tipografia.legenda,
      ...tema.tipografia.numeros,
      fontFamily: tema.fontes.corpo,
      color: tema.cores.textoSecundario,
    },

    input: {
      ...tema.tipografia.corpoMedio,
      fontSize: 16,
      height: 52,
      backgroundColor: tema.cores.superficieElevada,
      borderWidth: 1,
      borderColor: tema.cores.bordaForte,
      borderRadius: tema.raio.md,
      paddingHorizontal: tema.espaco.lg,
      color: tema.cores.texto,
    },

    erro: {
      ...tema.tipografia.legenda,
      color: tema.cores.erro,
      marginTop: tema.espaco.xs + 2,
    },

    gradeIcones: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tema.espaco.sm,
    },

    opcaoIcone: {
      width: TAMANHO_OPCAO,
      height: TAMANHO_OPCAO,
      borderRadius: tema.raio.md,
      borderWidth: 1.5,
      borderColor: tema.cores.borda,
      backgroundColor: tema.cores.superficieElevada,
      justifyContent: 'center',
      alignItems: 'center',
    },

    gradeCores: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tema.espaco.sm,
    },

    opcaoCor: {
      width: TAMANHO_OPCAO,
      height: TAMANHO_OPCAO,
      borderRadius: TAMANHO_OPCAO / 2,
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },

    opcaoCorAtiva: {
      borderColor: tema.cores.texto,
    },

    amostraCor: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: 'center',
      alignItems: 'center',
    },

    aviso: {
      ...tema.tipografia.legenda,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.lg,
      paddingHorizontal: tema.espaco.xl - 4,
    },

    botaoSalvar: {
      marginTop: tema.espaco.xl,
    },

    botaoExcluir: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tema.espaco.xs + 2,
      minHeight: tema.areaToque,
      marginTop: tema.espaco.md,
    },

    textoExcluir: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 14,
      color: tema.cores.erro,
    },
  });
