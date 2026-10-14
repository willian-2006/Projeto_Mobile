import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AnelProgresso from './AnelProgresso';

import Cartao from './Cartao';

import NumeroAnimado from './NumeroAnimado';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { brilho } from '../estilos/sombras';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

// Progresso de hoje em relação à meta diária (configurável no Perfil).
export default function CartaoProgresso({ pontosAtuais, meta }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const porcentagem = calcularPorcentagem(pontosAtuais, meta);

  const pontosRestantes = Math.max(meta - pontosAtuais, 0);

  const metaBatida = meta > 0 && pontosAtuais >= meta;

  return (
    <View style={estilos.sombra}>
      <Cartao style={estilos.cartao}>
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>Sua meta de hoje</Text>

          <View style={estilos.linhaPontos}>
            <NumeroAnimado valor={pontosAtuais} style={estilos.pontosAtuais} />

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

        <AnelProgresso porcentagem={porcentagem}>
          <NumeroAnimado
            valor={porcentagem}
            sufixo="%"
            style={estilos.porcentagem}
          />

          <Text style={estilos.rotuloAnel}>concluído</Text>
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

    textos: {
      flex: 1,
      marginRight: tema.espaco.lg,
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
      fontSize: 24,
      color: tema.cores.texto,
    },

    rotuloAnel: {
      ...tema.tipografia.rotulo,
      color: tema.cores.textoSecundario,
    },
  });
