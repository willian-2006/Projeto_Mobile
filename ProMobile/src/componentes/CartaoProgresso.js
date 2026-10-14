import React from 'react';

import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AnelProgresso from './AnelProgresso';

import Cartao from './Cartao';

import NumeroAnimado from './NumeroAnimado';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { ESCALA_MAXIMA_FONTE } from '../estilos/espacamentos';

import { brilho } from '../estilos/sombras';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

const LARGURA_TELA_PEQUENA = 360;

export default function CartaoProgresso({ pontosAtuais, meta }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const telaPequena = useWindowDimensions().width < LARGURA_TELA_PEQUENA;

  const tamanhoAnel = telaPequena ? 96 : 112;

  const tamanhoPorcentagem = Math.round(tamanhoAnel * 0.21);

  const porcentagem = calcularPorcentagem(pontosAtuais, meta);

  const pontosRestantes = Math.max(meta - pontosAtuais, 0);

  const metaBatida = meta > 0 && pontosAtuais >= meta;

  return (
    <View style={estilos.sombra}>
      <Cartao style={[estilos.cartao, telaPequena && estilos.cartaoCompacto]}>
        <View style={[estilos.textos, telaPequena && estilos.textosCompacto]}>
          <Text style={estilos.titulo}>Sua meta de hoje</Text>

          <View style={estilos.linhaPontos}>
            <NumeroAnimado
              valor={pontosAtuais}
              style={[
                estilos.pontosAtuais,
                telaPequena && estilos.pontosAtuaisCompacto,
              ]}
            />

            <Text style={estilos.textoMeta}>
              {' / '}
              {meta} pts
            </Text>
          </View>

          {metaBatida ? (
            <View style={estilos.linhaStatus}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={tema.cores.sucesso}
              />

              <Text style={estilos.metaBatida}>Meta batida!</Text>
            </View>
          ) : (
            <Text style={estilos.restantes}>
              {pontosRestantes === 1
                ? 'Falta 1 ponto'
                : `Faltam ${pontosRestantes} pontos`}
            </Text>
          )}
        </View>

        <AnelProgresso
          porcentagem={porcentagem}
          tamanho={tamanhoAnel}
          espessura={telaPequena ? 10 : 12}
        >
          <NumeroAnimado
            valor={porcentagem}
            sufixo="%"
            numberOfLines={1}
            style={[
              estilos.porcentagem,
              {
                fontSize: tamanhoPorcentagem,
                lineHeight: Math.round(tamanhoPorcentagem * 1.15),
              },
            ]}
          />

          <Text
            style={estilos.rotuloAnel}
            numberOfLines={1}
            maxFontSizeMultiplier={ESCALA_MAXIMA_FONTE}
          >
            concluído
          </Text>
        </AnelProgresso>
      </Cartao>
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    sombra: {
      borderRadius: tema.raio.lg,
      marginBottom: tema.espaco.xxl - 4,
      ...brilho(
        tema.cores.principal,
        tema.escuro ? 0.6 : 0.4,
        tema.cores.superficie
      ),
    },

    cartao: {
      borderRadius: tema.raio.lg,
      padding: tema.espaco.xl - 4,
      flexDirection: 'row',
      alignItems: 'center',
    },

    cartaoCompacto: {
      padding: tema.espaco.lg,
    },

    textos: {
      flex: 1,
      flexShrink: 1,
      marginRight: tema.espaco.lg,
    },

    textosCompacto: {
      marginRight: tema.espaco.md,
    },

    titulo: {
      ...tema.tipografia.corpo,
      color: tema.cores.textoSecundario,
      marginBottom: tema.espaco.xs,
    },

    linhaPontos: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },

    pontosAtuais: {
      ...tema.tipografia.numeros,
      fontSize: 36,
      color: tema.cores.texto,
    },

    pontosAtuaisCompacto: {
      fontSize: 30,
    },

    textoMeta: {
      ...tema.tipografia.numeros,
      fontSize: 15,
      color: tema.cores.textoSecundario,
    },

    restantes: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.sm,
    },

    linhaStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: tema.espaco.sm,
    },

    metaBatida: {
      ...tema.tipografia.legendaDestaque,
      color: tema.cores.sucesso,
      marginLeft: tema.espaco.xs,
    },

    porcentagem: {
      ...tema.tipografia.numeros,
      color: tema.cores.texto,
      textAlign: 'center',
      includeFontPadding: false,
    },

    rotuloAnel: {
      ...tema.tipografia.rotulo,
      lineHeight: 12,
      color: tema.cores.textoSecundario,
      textAlign: 'center',
      includeFontPadding: false,
    },
  });
