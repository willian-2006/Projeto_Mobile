import React, { useId, useState } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Svg, {
  Defs,
  Line,
  LinearGradient as GradienteSvg,
  Rect,
  Stop,
} from 'react-native-svg';

import { useEstilos, useTema } from '../contexto/TemaContexto';

const ALTURA = 132;

// Espaço acima das barras para o valor.
const TOPO = 18;

// Barras com os pontos de cada dia e uma linha tracejada na meta.
// Dias que bateram a meta ficam com a cor cheia.
export default function GraficoSemana({ dias, meta }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const [largura, setLargura] = useState(0);

  const idGradiente = `barra${useId().replace(/:/g, '')}`;

  const maximo = Math.max(meta, ...dias.map(dia => dia.pontos), 1);

  const larguraColuna = largura / dias.length;

  const larguraBarra = Math.min(larguraColuna * 0.5, 28);

  const escala = valor => ((ALTURA - TOPO) * valor) / maximo;

  const yMeta = ALTURA - escala(meta);

  const descricao = dias
    .map(dia => `${dia.rotulo}: ${dia.pontos} pontos`)
    .join(', ');

  return (
    <View
      accessible
      accessibilityLabel={`Pontos dos últimos 7 dias. Meta de ${meta} pontos. ${descricao}`}
    >
      <View
        style={estilos.area}
        onLayout={evento => setLargura(evento.nativeEvent.layout.width)}
      >
        {largura > 0 && (
          <Svg width={largura} height={ALTURA}>
            <Defs>
              <GradienteSvg id={idGradiente} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={tema.cores.gradientePrincipal[0]} />
                <Stop offset="1" stopColor={tema.cores.gradientePrincipal[1]} />
              </GradienteSvg>
            </Defs>

            {dias.map((dia, indice) => {
              const altura = Math.max(escala(dia.pontos), dia.pontos ? 4 : 2);

              const bateu = dia.meta > 0 && dia.pontos >= dia.meta;

              return (
                <Rect
                  key={dia.data}
                  x={
                    indice * larguraColuna + (larguraColuna - larguraBarra) / 2
                  }
                  y={ALTURA - altura}
                  width={larguraBarra}
                  height={altura}
                  rx={Math.min(6, larguraBarra / 2)}
                  fill={
                    dia.pontos ? `url(#${idGradiente})` : tema.cores.bordaForte
                  }
                  opacity={bateu || dia.hoje || !dia.pontos ? 1 : 0.45}
                />
              );
            })}

            <Line
              x1={0}
              x2={largura}
              y1={yMeta}
              y2={yMeta}
              stroke={tema.cores.sucesso}
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
          </Svg>
        )}

        {largura > 0 &&
          dias.map((dia, indice) =>
            dia.pontos ? (
              <Text
                key={dia.data}
                style={[
                  estilos.valor,
                  {
                    left: indice * larguraColuna,
                    width: larguraColuna,
                    top: ALTURA - escala(dia.pontos) - TOPO + 2,
                  },
                ]}
              >
                {dia.pontos}
              </Text>
            ) : null
          )}
      </View>

      <View style={estilos.rotulos}>
        {dias.map(dia => (
          <Text
            key={dia.data}
            style={[estilos.rotulo, dia.hoje && estilos.rotuloHoje]}
          >
            {dia.rotulo}
          </Text>
        ))}
      </View>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    area: {
      height: ALTURA,
    },

    valor: {
      ...tema.tipografia.numeros,
      position: 'absolute',
      fontSize: 11,
      textAlign: 'center',
      color: tema.cores.textoSecundario,
    },

    rotulos: {
      flexDirection: 'row',
      marginTop: tema.espaco.sm,
    },

    rotulo: {
      ...tema.tipografia.legendaDestaque,
      flex: 1,
      textAlign: 'center',
      color: tema.cores.textoSecundario,
    },

    rotuloHoje: {
      fontFamily: tema.fontes.corpoNegrito,
      color: tema.cores.principal,
    },
  });
