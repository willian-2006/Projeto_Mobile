import React, { useCallback } from 'react';

import { View, Text, Alert, StyleSheet } from 'react-native';

import Cabecalho from '../componentes/Cabecalho';

import CartaoProgresso from '../componentes/CartaoProgresso';

import CartaoCategoria from '../componentes/CartaoCategoria';

import CartaoNovaCategoria from '../componentes/CartaoNovaCategoria';

import EstadoVazio from '../componentes/EstadoVazio';

import ListaTarefas from '../componentes/ListaTarefas';

import Tela from '../componentes/Tela';

import { useAviso } from '../contexto/AvisoContexto';

import { useEstatisticas, useTarefas } from '../contexto/TarefasContexto';

import { useEstilos } from '../contexto/TemaContexto';

import { useListaCategorias } from '../hooks/useCategorias';

import { useExclusaoCategoria } from '../hooks/useExclusaoCategoria';

import { resumoDaCategoria } from '../utilitarios/pontuacao';

import { contar } from '../utilitarios/textos';

export default function Inicio({ navigation }) {
  const estilos = useEstilos(criarEstilos);

  const { tarefasDeHoje } = useTarefas();

  const estatisticas = useEstatisticas();

  const { ordenadas, total, limite, podeCriar } = useListaCategorias();

  const pedirExclusao = useExclusaoCategoria();

  const { mostrarAviso } = useAviso();

  const abrirCategoria = useCallback(
    chave => navigation.navigate('Categoria', { chave }),
    [navigation]
  );

  const abrirEditorCategoria = useCallback(
    chave =>
      navigation.navigate('EditorCategoria', chave ? { chave } : undefined),
    [navigation]
  );

  const gerenciarCategoria = useCallback(
    categoria => {
      if (!categoria.personalizada) {
        mostrarAviso({
          mensagem: 'As categorias padrão não podem ser alteradas.',
        });
        return;
      }

      Alert.alert(
        categoria.titulo,
        'O que você quer fazer com esta categoria?',
        [
          {
            text: 'Editar',
            onPress: () => abrirEditorCategoria(categoria.chave),
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => pedirExclusao(categoria),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    },
    [mostrarAviso, abrirEditorCategoria, pedirExclusao]
  );

  const cabecalhoLista = (
    <View>
      <Cabecalho />

      <CartaoProgresso
        pontosAtuais={estatisticas.pontosAtuais}
        meta={estatisticas.meta}
      />

      <View style={estilos.cabecalhoSecao}>
        <View>
          <Text style={estilos.tituloSecao} accessibilityRole="header">
            Sua rotina de hoje
          </Text>

          <View
            style={[estilos.selo, !podeCriar && estilos.seloCheio]}
            accessible
            accessibilityLabel={`${total} de ${limite} categorias${
              podeCriar ? '' : ', limite atingido'
            }`}
          >
            <Text
              style={[estilos.textoSelo, !podeCriar && estilos.textoSeloCheio]}
            >
              {total}/{limite} categorias
            </Text>
          </View>
        </View>

        <Text style={estilos.contador}>
          {estatisticas.concluidas}/{estatisticas.total}
        </Text>
      </View>

      <View style={estilos.categorias}>
        {ordenadas.map((categoria, indice) => {
          const resumo = resumoDaCategoria(estatisticas, categoria.chave);

          return (
            <CartaoCategoria
              key={categoria.chave}
              categoria={categoria}
              tarefas={resumo.tarefas}
              pontos={resumo.pontos}
              indice={indice}
              aoPressionar={abrirCategoria}
              aoSegurar={gerenciarCategoria}
            />
          );
        })}

        {podeCriar ? (
          <CartaoNovaCategoria
            vagas={limite - total}
            indice={ordenadas.length}
            aoPressionar={() => abrirEditorCategoria()}
          />
        ) : null}
      </View>

      <View style={estilos.cabecalhoSecao}>
        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Tarefas de hoje
        </Text>

        <Text style={estilos.contadorTarefas}>
          {contar(estatisticas.concluidas, 'concluída', 'concluídas')}
        </Text>
      </View>
    </View>
  );

  return (
    <Tela edges={['top']}>
      <ListaTarefas
        tarefas={tarefasDeHoje}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone="sparkles-outline"
            titulo="Dia livre por aqui"
            subtitulo="Toque em uma categoria e crie sua primeira tarefa"
          />
        }
        contentContainerStyle={estilos.conteudoRolagem}
      />
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

    cabecalhoSecao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tema.espaco.lg,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
    },

    selo: {
      alignSelf: 'flex-start',
      marginTop: tema.espaco.xs + 2,
      paddingHorizontal: tema.espaco.sm,
      paddingVertical: 3,
      borderRadius: tema.raio.sm,
      backgroundColor: tema.cores.superficieElevada,
    },

    seloCheio: {
      backgroundColor: tema.cores.principalSuave,
    },

    textoSelo: {
      ...tema.tipografia.legenda,
      ...tema.tipografia.numeros,
      fontFamily: tema.fontes.corpoMedio,
      color: tema.cores.textoSecundario,
    },

    textoSeloCheio: {
      color: tema.cores.principal,
    },

    contador: {
      ...tema.tipografia.legendaDestaque,
      ...tema.tipografia.numeros,
      fontSize: 13,
      color: tema.cores.principal,
    },

    categorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: tema.espaco.md,
    },

    contadorTarefas: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
    },
  });
