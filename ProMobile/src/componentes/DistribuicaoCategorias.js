import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Svg, { Circle, G } from 'react-native-svg';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { CATEGORIAS } from '../dados/categorias';

import { coresDaCategoria } from '../estilos/tema';

import { ESCALA_MAXIMA_FONTE } from '../estilos/espacamentos';

const TAMANHO = 120;

const ESPESSURA = 16;

const FOLGA = 3;

const LARGURA_MINIMA_LEGENDA = 150;

const RECUO_CENTRO = ESPESSURA + 6;

const RAIO = (TAMANHO - ESPESSURA) / 2;

const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function montarSegmentos(totais, categorias) {
  const total = categorias.reduce(
    (soma, categoria) => soma + (totais[categoria.chave] || 0),
    0
  );

  let acumulado = 0;

  const segmentos = categorias.map(categoria => {
    const pontos = totais[categoria.chave] || 0;

    const fracao = total > 0 ? pontos / total : 0;

    const segmento = {
      categoria,
      pontos,
      porcentagem: Math.round(fracao * 100),
      inicio: acumulado,
      comprimento: fracao * CIRCUNFERENCIA,
    };

    acumulado += segmento.comprimento;

    return segmento;
  });

  return { total, segmentos };
}

export default function DistribuicaoCategorias({
  totais,
  categorias = CATEGORIAS,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { total, segmentos } = montarSegmentos(totais, categorias);

  const visiveis = segmentos.filter(segmento => segmento.pontos > 0);

  const folga = visiveis.length > 1 ? FOLGA : 0;

  return (
    <View style={estilos.container}>
      <View
        style={estilos.anel}
        accessible
        accessibilityLabel={
          total > 0
            ? `Pontos por categoria: ${visiveis
                .map(s => `${s.categoria.titulo} ${s.porcentagem}%`)
                .join(', ')}`
            : 'Ainda sem pontos no período'
        }
      >
        <Svg width={TAMANHO} height={TAMANHO}>
          <G rotation={-90} origin={`${TAMANHO / 2}, ${TAMANHO / 2}`}>
            <Circle
              cx={TAMANHO / 2}
              cy={TAMANHO / 2}
              r={RAIO}
              stroke={tema.cores.superficieElevada}
              strokeWidth={ESPESSURA}
              fill="none"
            />

            {visiveis.map(segmento => (
              <Circle
                key={segmento.categoria.chave}
                cx={TAMANHO / 2}
                cy={TAMANHO / 2}
                r={RAIO}
                stroke={coresDaCategoria(tema, segmento.categoria).cor}
                strokeWidth={ESPESSURA}
                strokeDasharray={`${Math.max(segmento.comprimento - folga, 0.1)} ${CIRCUNFERENCIA}`}
                strokeDashoffset={-segmento.inicio}
                fill="none"
              />
            ))}
          </G>
        </Svg>

        <View style={estilos.centro}>
          <Text
            style={estilos.total}
            maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {total}
          </Text>

          <Text
            style={estilos.rotuloTotal}
            maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
            numberOfLines={1}
          >
            pontos
          </Text>
        </View>
      </View>

      <View style={estilos.legenda}>
        {segmentos.map(segmento => (
          <View key={segmento.categoria.chave} style={estilos.linha}>
            <View
              style={[
                estilos.marcador,
                {
                  backgroundColor: coresDaCategoria(tema, segmento.categoria)
                    .cor,
                },
              ]}
            />

            <Text style={estilos.nome} numberOfLines={1}>
              {segmento.categoria.titulo}
            </Text>

            <Text
              style={estilos.valor}
              maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
            >
              {segmento.porcentagem}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tema.espaco.lg,
    },

    anel: {
      position: 'relative',
      width: TAMANHO,
      height: TAMANHO,
      flexShrink: 0,
    },

    centro: {
      position: 'absolute',
      inset: 0,
      padding: RECUO_CENTRO,
      alignItems: 'center',
      justifyContent: 'center',
    },

    total: {
      ...tema.tipografia.numeros,
      fontSize: 20,
      lineHeight: 24,
      textAlign: 'center',
      color: tema.cores.texto,
    },

    rotuloTotal: {
      ...tema.tipografia.rotulo,
      lineHeight: 13,
      textAlign: 'center',
      color: tema.cores.textoSecundario,
    },

    legenda: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: LARGURA_MINIMA_LEGENDA,
      minWidth: LARGURA_MINIMA_LEGENDA,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tema.espaco.xs + 1,
    },

    marcador: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: tema.espaco.sm,
    },

    nome: {
      ...tema.tipografia.corpo,
      flex: 1,
      color: tema.cores.texto,
    },

    valor: {
      ...tema.tipografia.numeros,
      fontSize: 13,
      color: tema.cores.textoSecundario,
      minWidth: 40,
      marginLeft: tema.espaco.sm,
      textAlign: 'right',
    },
  });
