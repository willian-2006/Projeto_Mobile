import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import Cabecalho from './src/componentes/Cabecalho';
import CartaoProgresso from './src/componentes/CartaoProgresso';
import CartaoCategoria from './src/componentes/CartaoCategoria';
import ItemTarefa from './src/componentes/ItemTarefa';
import NavegacaoInferior from './src/componentes/NavegacaoInferior';

import { tarefasIniciais } from './src/dados/tarefas';

import { cores } from './src/estilos/cores';

export default function App() {

  const [tarefas, setTarefas] =
    useState(tarefasIniciais);
  
  const pontosMaximos = tarefas.reduce(
    (total, tarefa) => {
      return total + tarefa.pontos;
    },
    0
  );

  const pontosAtuais = tarefas
    .filter(tarefa => tarefa.concluida)
    .reduce(
      (total, tarefa) => {
        return total + tarefa.pontos;
      },
      0
    );

  const tarefasConcluidas =
    tarefas.filter(
      tarefa => tarefa.concluida
    ).length;

  function alternarTarefa(id) {

    setTarefas(tarefasAtuais => {

      return tarefasAtuais.map(tarefa => {

        if (tarefa.id === id) {

          return {
            ...tarefa,
            concluida: !tarefa.concluida,
          };

        }

        return tarefa;
      });

    });
  }

  const categorias = [

    {
      titulo: 'Saúde',
      icone: 'heart',
      tarefas: tarefas.filter(
        tarefa => tarefa.categoria === 'Saúde'
      ).length,

      pontos: tarefas
        .filter(
          tarefa => tarefa.categoria === 'Saúde'
        )
        .reduce(
          (total, tarefa) =>
            total + tarefa.pontos,
          0
        ),

      corFundo: cores.saude,
      corIcone: cores.saudeIcone,
    },

    {
      titulo: 'Estudos',
      icone: 'book',
      tarefas: tarefas.filter(
        tarefa => tarefa.categoria === 'Estudos'
      ).length,

      pontos: tarefas
        .filter(
          tarefa => tarefa.categoria === 'Estudos'
        )
        .reduce(
          (total, tarefa) =>
            total + tarefa.pontos,
          0
        ),

      corFundo: cores.estudos,
      corIcone: cores.estudosIcone,
    },

    {
      titulo: 'Trabalho',
      icone: 'briefcase',
      tarefas: tarefas.filter(
        tarefa => tarefa.categoria === 'Trabalho'
      ).length,

      pontos: tarefas
        .filter(
          tarefa => tarefa.categoria === 'Trabalho'
        )
        .reduce(
          (total, tarefa) =>
            total + tarefa.pontos,
          0
        ),

      corFundo: cores.trabalho,
      corIcone: cores.trabalhoIcone,
    },

    {
      titulo: 'Devocional',
      icone: 'heart-circle',
      tarefas: tarefas.filter(
        tarefa => tarefa.categoria === 'Devocional'
      ).length,

      pontos: tarefas
        .filter(
          tarefa => tarefa.categoria === 'Devocional'
        )
        .reduce(
          (total, tarefa) =>
            total + tarefa.pontos,
          0
        ),

      corFundo: cores.devocional,
      corIcone: cores.devocionalIcone,
    },
  ];

  return (
    <SafeAreaView style={estilos.areaSegura}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor={cores.fundo}
      />

      <View style={estilos.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            estilos.conteudoRolagem
          }
        >

          <Cabecalho />

          <CartaoProgresso
            pontosAtuais={pontosAtuais}
            pontosMaximos={pontosMaximos}
          />

          <View style={estilos.cabecalhoSecao}>

            <Text style={estilos.tituloSecao}>
              Sua rotina de hoje
            </Text>

            <Text style={estilos.contador}>
              {tarefasConcluidas}/{tarefas.length}
            </Text>

          </View>

          <View style={estilos.categorias}>

            {categorias.map(categoria => (

              <CartaoCategoria
                key={categoria.titulo}

                titulo={categoria.titulo}
                icone={categoria.icone}
                tarefas={categoria.tarefas}
                pontos={categoria.pontos}

                corFundo={
                  categoria.corFundo
                }

                corIcone={
                  categoria.corIcone
                }
              />

            ))}

          </View>

          <View style={estilos.cabecalhoTarefas}>

            <Text style={estilos.tituloSecao}>
              Tarefas de hoje
            </Text>

            <Text style={estilos.contadorTarefas}>
              {tarefasConcluidas} concluídas
            </Text>

          </View>

          <View>

            {tarefas.map(tarefa => (

              <ItemTarefa
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={alternarTarefa}
              />

            ))}

          </View>

          <View style={estilos.espacoFinal} />

        </ScrollView>

        <NavegacaoInferior />

      </View>

    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({

  areaSegura: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  container: {
    flex: 1,
  },

  conteudoRolagem: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 15,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: '700',
    color: cores.texto,
  },

  contador: {
    fontSize: 13,
    color: cores.principal,
    fontWeight: '600',
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    marginBottom: 22,
  },

  cabecalhoTarefas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 15,
  },

  contadorTarefas: {
    fontSize: 12,
    color: cores.textoSecundario,
  },

  espacoFinal: {
    height: 20,
  },

});