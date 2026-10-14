import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import ItemTarefa from '../componentes/ItemTarefa';

import { cores } from '../estilos/cores';

export default function Saude({
  tarefas,
  aoVoltar,
  aoAdicionar,
  aoAlternar,
  aoExcluir,
}) {
  const [novaTarefa, setNovaTarefa] = useState('');

  const tarefasSaude = tarefas.filter(
    tarefa => tarefa.categoria === 'Saúde'
  );

  function adicionar() {
    if (novaTarefa.trim() === '') {
      return;
    }

    aoAdicionar('Saúde', novaTarefa);

    setNovaTarefa('');
  }

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
          <View style={estilos.cabecalho}>
            <TouchableOpacity
              style={estilos.botaoVoltar}
              onPress={aoVoltar}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color={cores.texto}
              />
            </TouchableOpacity>

            <View>
              <Text style={estilos.titulo}>
                Saúde
              </Text>

              <Text style={estilos.subtitulo}>
                Cuide do seu corpo e da sua saúde
              </Text>
            </View>
          </View>

          <View style={estilos.areaAdicionar}>
            <TextInput
              style={estilos.input}
              placeholder="Adicionar tarefa..."
              placeholderTextColor={
                cores.textoSecundario
              }
              value={novaTarefa}
              onChangeText={setNovaTarefa}
              onSubmitEditing={adicionar}
            />

            <TouchableOpacity
              style={estilos.botaoAdicionar}
              onPress={adicionar}
            >
              <Ionicons
                name="add"
                size={25}
                color={cores.branco}
              />
            </TouchableOpacity>
          </View>

          <View style={estilos.cabecalhoTarefas}>
            <Text style={estilos.tituloSecao}>
              Minhas tarefas
            </Text>

            <Text style={estilos.contador}>
              {tarefasSaude.length}
            </Text>
          </View>

          {tarefasSaude.length === 0 ? (
            <View style={estilos.vazio}>
              <Ionicons
                name="heart-outline"
                size={45}
                color={cores.saudeIcone}
              />

              <Text style={estilos.textoVazio}>
                Nenhuma tarefa de saúde
              </Text>

              <Text style={estilos.subtextoVazio}>
                Adicione uma tarefa para começar
              </Text>
            </View>
          ) : (
            tarefasSaude.map(tarefa => (
              <ItemTarefa
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={aoAlternar}
                aoExcluir={aoExcluir}
              />
            ))
          )}
        </ScrollView>
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
    paddingBottom: 30,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '800',
    color: cores.texto,
  },

  subtitulo: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 3,
  },

  areaAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: cores.branco,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 14,
    color: cores.texto,
  },

  botaoAdicionar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: cores.saudeIcone,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  cabecalhoTarefas: {
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
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: cores.saude,
    color: cores.saudeIcone,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
    paddingTop: 5,
  },

  vazio: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },

  textoVazio: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
    marginTop: 12,
  },

  subtextoVazio: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 5,
  },
});