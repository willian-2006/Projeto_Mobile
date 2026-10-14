import React, { useCallback, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import EstadoVazio from '../componentes/EstadoVazio';

import ItemTarefa from '../componentes/ItemTarefa';

import { useTarefas } from '../contexto/TarefasContexto';

import { buscarCategoria } from '../dados/categorias';

import { cores } from '../estilos/cores';

// Ignora um segundo envio logo após o primeiro
// (onSubmitEditing + toque no botão).
const INTERVALO_MINIMO_ENVIO = 500;

const TAMANHO_MAXIMO_TITULO = 80;

export default function TelaCategoria({ route, navigation }) {
  const categoria = buscarCategoria(route.params?.chave);

  const { tarefas, aoAdicionar, aoAlternar, aoExcluir } = useTarefas();

  const [novaTarefa, setNovaTarefa] = useState('');

  const ultimoEnvio = useRef(0);

  const aoVoltar = useCallback(() => navigation.goBack(), [navigation]);

  const renderizarTarefa = useCallback(
    ({ item }) => (
      <ItemTarefa tarefa={item} aoAlternar={aoAlternar} aoExcluir={aoExcluir} />
    ),
    [aoAlternar, aoExcluir]
  );

  if (!categoria) {
    return (
      <SafeAreaView style={estilos.areaSegura}>
        <View style={estilos.conteudoRolagem}>
          <CabecalhoTela titulo="Categoria" aoVoltar={aoVoltar} />

          <EstadoVazio
            icone="alert-circle-outline"
            cor={cores.textoSecundario}
            titulo="Categoria não encontrada"
          />
        </View>
      </SafeAreaView>
    );
  }

  const tarefasCategoria = tarefas.filter(
    tarefa => tarefa.categoria === categoria.chave
  );

  function adicionar() {
    const titulo = novaTarefa.trim();

    const agora = Date.now();

    if (titulo === '' || agora - ultimoEnvio.current < INTERVALO_MINIMO_ENVIO) {
      return;
    }

    ultimoEnvio.current = agora;

    aoAdicionar(categoria.chave, titulo);

    setNovaTarefa('');
  }

  const cabecalhoLista = (
    <View>
      <CabecalhoTela
        titulo={categoria.titulo}
        subtitulo={categoria.subtitulo}
        aoVoltar={aoVoltar}
      />

      <View style={estilos.areaAdicionar}>
        <TextInput
          style={estilos.input}
          placeholder="Adicionar tarefa..."
          placeholderTextColor={cores.textoSecundario}
          value={novaTarefa}
          onChangeText={setNovaTarefa}
          onSubmitEditing={adicionar}
          maxLength={TAMANHO_MAXIMO_TITULO}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[estilos.botaoAdicionar, { backgroundColor: categoria.cor }]}
          onPress={adicionar}
          accessibilityRole="button"
          accessibilityLabel="Adicionar tarefa"
        >
          <Ionicons name="add" size={25} color={cores.branco} />
        </TouchableOpacity>
      </View>

      <View style={estilos.cabecalhoTarefas}>
        <Text style={estilos.tituloSecao}>Minhas tarefas</Text>

        <View
          style={[estilos.contador, { backgroundColor: categoria.corFundo }]}
        >
          <Text style={[estilos.textoContador, { color: categoria.cor }]}>
            {tarefasCategoria.length}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <FlatList
        data={tarefasCategoria}
        keyExtractor={tarefa => tarefa.id}
        renderItem={renderizarTarefa}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone={categoria.iconeVazio}
            cor={categoria.cor}
            titulo={categoria.textoVazio}
            subtitulo="Adicione uma tarefa para começar"
          />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudoRolagem: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
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
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoContador: {
    fontWeight: '700',
  },
});
