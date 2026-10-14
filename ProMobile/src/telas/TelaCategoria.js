import React, { useCallback, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import EstadoVazio from '../componentes/EstadoVazio';

import ItemTarefa from '../componentes/ItemTarefa';

import Tela from '../componentes/Tela';

import { useTarefas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { buscarCategoria } from '../dados/categorias';

import { brilho } from '../estilos/sombras';

// Ignora um segundo envio logo após o primeiro
// (onSubmitEditing + toque no botão).
const INTERVALO_MINIMO_ENVIO = 500;

const TAMANHO_MAXIMO_TITULO = 80;

export default function TelaCategoria({ route, navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const categoria = buscarCategoria(route.params?.chave);

  const { tarefas, aoAdicionar, aoAlternar, aoExcluir } = useTarefas();

  const [novaTarefa, setNovaTarefa] = useState('');

  const ultimoEnvio = useRef(0);

  const aoVoltar = useCallback(() => navigation.goBack(), [navigation]);

  const renderizarTarefa = useCallback(
    ({ item, index }) => (
      <ItemTarefa
        tarefa={item}
        indice={index}
        aoAlternar={aoAlternar}
        aoExcluir={aoExcluir}
      />
    ),
    [aoAlternar, aoExcluir]
  );

  if (!categoria) {
    return (
      <Tela>
        <View style={estilos.conteudoRolagem}>
          <CabecalhoTela titulo="Categoria" aoVoltar={aoVoltar} />

          <EstadoVazio
            icone="alert-circle-outline"
            titulo="Categoria não encontrada"
          />
        </View>
      </Tela>
    );
  }

  const coresCategoria = tema.categorias[categoria.chave];

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
          placeholderTextColor={tema.cores.textoSecundario}
          selectionColor={coresCategoria.cor}
          value={novaTarefa}
          onChangeText={setNovaTarefa}
          onSubmitEditing={adicionar}
          maxLength={TAMANHO_MAXIMO_TITULO}
          returnKeyType="done"
          accessibilityLabel={`Nova tarefa de ${categoria.titulo}`}
        />

        <TouchableOpacity
          style={[
            estilos.botaoAdicionar,
            brilho(coresCategoria.gradiente[1], 0.8, coresCategoria.cor),
          ]}
          onPress={adicionar}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Adicionar tarefa"
        >
          <LinearGradient
            colors={coresCategoria.gradiente}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.gradienteBotao}
          >
            <Ionicons
              name="add"
              size={26}
              color={tema.cores.textoSobreDestaque}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={estilos.cabecalhoTarefas}>
        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Minhas tarefas
        </Text>

        <View
          style={[
            estilos.contador,
            { backgroundColor: coresCategoria.corSuave },
          ]}
        >
          <Text style={[estilos.textoContador, { color: coresCategoria.cor }]}>
            {tarefasCategoria.length}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Tela>
      <FlatList
        data={tarefasCategoria}
        keyExtractor={tarefa => tarefa.id}
        renderItem={renderizarTarefa}
        ListHeaderComponent={cabecalhoLista}
        ListEmptyComponent={
          <EstadoVazio
            icone={categoria.iconeVazio}
            gradiente={coresCategoria.gradiente}
            titulo={categoria.textoVazio}
            subtitulo="Comece com algo pequeno: um passo já conta pontos"
          />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
      paddingBottom: tema.espaco.xxl,
    },

    areaAdicionar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tema.espaco.xxl - 4,
    },

    input: {
      ...tema.tipografia.corpo,
      flex: 1,
      height: 52,
      backgroundColor: tema.cores.superficieVidro,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      borderRadius: tema.raio.md,
      paddingHorizontal: tema.espaco.lg,
      color: tema.cores.texto,
    },

    botaoAdicionar: {
      width: 52,
      height: 52,
      borderRadius: tema.raio.md,
      marginLeft: tema.espaco.sm + 2,
    },

    gradienteBotao: {
      flex: 1,
      borderRadius: tema.raio.md,
      justifyContent: 'center',
      alignItems: 'center',
    },

    cabecalhoTarefas: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tema.espaco.lg,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
    },

    contador: {
      minWidth: 28,
      height: 28,
      borderRadius: 14,
      paddingHorizontal: tema.espaco.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },

    textoContador: {
      ...tema.tipografia.numeros,
      fontSize: 13,
    },
  });
