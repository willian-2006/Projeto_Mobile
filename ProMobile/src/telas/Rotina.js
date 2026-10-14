import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Animated from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import IconeGradiente from '../componentes/IconeGradiente';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { entradaCascata } from '../estilos/movimento';

import { ordenarCategorias } from '../utilitarios/preferencias';

export default function Rotina({ navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const estatisticas = useEstatisticas();

  const { preferencias } = usePreferencias();

  const categorias = ordenarCategorias(
    CATEGORIAS,
    preferencias.categoriasFavoritas
  );

  return (
    <Tela edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela
          titulo="Rotina"
          subtitulo="Escolha uma área para organizar"
        />

        {categorias.map((categoria, indice) => {
          const resumo = estatisticas.porCategoria[categoria.chave];

          const coresCategoria = tema.categorias[categoria.chave];

          return (
            <Animated.View
              key={categoria.chave}
              entering={entradaCascata(indice)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Categoria', { chave: categoria.chave })
                }
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${categoria.titulo}: ${resumo.concluidas} de ${resumo.tarefas} concluídas`}
              >
                <Cartao style={estilos.linha}>
                  <IconeGradiente
                    icone={categoria.icone}
                    gradiente={coresCategoria.gradiente}
                    tamanho={46}
                    tamanhoIcone={22}
                  />

                  <View style={estilos.textos}>
                    <Text style={estilos.titulo}>{categoria.titulo}</Text>

                    <Text style={estilos.subtitulo}>{categoria.subtitulo}</Text>
                  </View>

                  <Text
                    style={[estilos.contagem, { color: coresCategoria.cor }]}
                  >
                    {resumo.concluidas}/{resumo.tarefas}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={tema.cores.textoTerciario}
                  />
                </Cartao>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: tema.espaco.lg,
      marginBottom: tema.espaco.md,
    },

    textos: {
      flex: 1,
      marginLeft: tema.espaco.md + 2,
    },

    titulo: {
      ...tema.tipografia.tituloCartao,
      color: tema.cores.texto,
    },

    subtitulo: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: 2,
    },

    contagem: {
      ...tema.tipografia.numeros,
      fontSize: 14,
      marginHorizontal: tema.espaco.sm,
    },
  });
