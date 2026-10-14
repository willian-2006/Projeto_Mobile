import React, { useState } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { useEstilos } from '../contexto/TemaContexto';

import { INICIAIS_DIAS } from '../utilitarios/datas';

const COLUNAS = 7;

const ESPACO = 6;

// Opacidade da cor principal conforme a % da meta do dia.
function intensidade(porcentagem) {
  if (porcentagem === null || porcentagem === 0) {
    return 0;
  }

  if (porcentagem >= 100) {
    return 1;
  }

  if (porcentagem >= 66) {
    return 0.7;
  }

  if (porcentagem >= 33) {
    return 0.45;
  }

  return 0.22;
}

const NIVEIS_LEGENDA = [0, 0.22, 0.45, 0.7, 1];

// Heatmap do mês: cada dia é colorido pela % da meta alcançada.
export default function CalendarioCalor({ calendario }) {
  const estilos = useEstilos(criarEstilos);

  const [largura, setLargura] = useState(0);

  // Arredonda para baixo para a 7ª coluna não quebrar de linha.
  const lado = Math.floor((largura - ESPACO * (COLUNAS - 1)) / COLUNAS);

  const casas = [
    ...Array.from({ length: calendario.vazios }, (_, indice) => ({
      vazia: true,
      chave: `vazia${indice}`,
    })),
    ...calendario.dias.map(dia => ({ ...dia, chave: dia.data })),
  ];

  const diasBatidos = calendario.dias.filter(
    dia => dia.porcentagem === 100
  ).length;

  function celula(casa) {
    if (casa.vazia) {
      return <View key={casa.chave} style={{ width: lado, height: lado }} />;
    }

    const opacidade = intensidade(casa.porcentagem);

    return (
      <View
        key={casa.chave}
        style={[
          estilos.celula,
          { width: lado, height: lado },
          casa.hoje && estilos.hoje,
        ]}
      >
        {opacidade > 0 && (
          <View
            style={[
              StyleSheet.absoluteFill,
              estilos.preenchimento,
              { opacity: opacidade },
            ]}
          />
        )}
      </View>
    );
  }

  return (
    <View>
      <View style={estilos.cabecalho}>
        {INICIAIS_DIAS.map((inicial, indice) => (
          <Text key={indice} style={estilos.diaSemana}>
            {inicial}
          </Text>
        ))}
      </View>

      <View
        style={estilos.grade}
        onLayout={evento => setLargura(evento.nativeEvent.layout.width)}
        accessible
        accessibilityLabel={`${calendario.titulo}: meta batida em ${diasBatidos} ${
          diasBatidos === 1 ? 'dia' : 'dias'
        }`}
      >
        {largura > 0 && casas.map(celula)}
      </View>

      <View style={estilos.legenda}>
        <Text style={estilos.textoLegenda}>Menos</Text>

        {NIVEIS_LEGENDA.map(nivel => (
          <View key={nivel} style={estilos.amostra}>
            {nivel > 0 && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  estilos.preenchimento,
                  { opacity: nivel },
                ]}
              />
            )}
          </View>
        ))}

        <Text style={estilos.textoLegenda}>Meta</Text>
      </View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    cabecalho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tema.espaco.sm,
    },

    diaSemana: {
      ...tema.tipografia.legendaDestaque,
      flex: 1,
      textAlign: 'center',
      color: tema.cores.textoSecundario,
    },

    grade: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: ESPACO,
    },

    celula: {
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: tema.cores.superficieElevada,
    },

    preenchimento: {
      backgroundColor: tema.cores.principal,
    },

    hoje: {
      borderWidth: 2,
      borderColor: tema.cores.texto,
    },

    legenda: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: tema.espaco.md,
      gap: 4,
    },

    textoLegenda: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginHorizontal: 4,
    },

    amostra: {
      width: 12,
      height: 12,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: tema.cores.superficieElevada,
    },
  });
