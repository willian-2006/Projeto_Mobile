import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import { useEstatisticas } from '../contexto/TarefasContexto';

import { CATEGORIAS } from '../dados/categorias';

import { cores } from '../estilos/cores';

export default function Rotina({ navigation }) {
  const estatisticas = useEstatisticas();

  return (
    <SafeAreaView style={estilos.areaSegura} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoRolagem}
      >
        <CabecalhoTela
          titulo="Rotina"
          subtitulo="Escolha uma área para organizar"
        />

        {CATEGORIAS.map(categoria => {
          const resumo = estatisticas.porCategoria[categoria.chave];

          return (
            <TouchableOpacity
              key={categoria.chave}
              style={estilos.linha}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Categoria', { chave: categoria.chave })
              }
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${categoria.titulo}`}
            >
              <View
                style={[estilos.icone, { backgroundColor: categoria.corFundo }]}
              >
                <Ionicons
                  name={categoria.icone}
                  size={22}
                  color={categoria.cor}
                />
              </View>

              <View style={estilos.textos}>
                <Text style={estilos.titulo}>{categoria.titulo}</Text>

                <Text style={estilos.subtitulo}>{categoria.subtitulo}</Text>
              </View>

              <Text style={[estilos.contagem, { color: categoria.cor }]}>
                {resumo.concluidas}/{resumo.tarefas}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={cores.textoSecundario}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    paddingBottom: 20,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  icone: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  textos: {
    flex: 1,
  },

  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },

  subtitulo: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 3,
  },

  contagem: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
  },
});
