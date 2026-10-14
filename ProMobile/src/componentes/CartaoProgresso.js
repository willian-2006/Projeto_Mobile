import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { cores } from '../estilos/cores';

import { calcularPorcentagem } from '../utilitarios/pontuacao';

export default function CartaoProgresso({
  pontosAtuais,
  pontosMaximos,
}) {

  const porcentagem = calcularPorcentagem(
    pontosAtuais,
    pontosMaximos
  );

  const pontosRestantes = Math.max(
    pontosMaximos - pontosAtuais,
    0
  );

  return (
    <View style={estilos.cartao}>

      <View style={estilos.topo}>

        <View>
          <Text style={estilos.titulo}>
            Sua meta de hoje
          </Text>

          <View style={estilos.linhaPontos}>

            <Text style={estilos.pontosAtuais}>
              {pontosAtuais}
            </Text>

            <Text style={estilos.pontosMaximos}>
              {' / '}
              {pontosMaximos} pontos
            </Text>

          </View>
        </View>

        <View style={estilos.icone}>
          <Ionicons
            name="trophy-outline"
            size={24}
            color={cores.principal}
          />
        </View>

      </View>

      <View style={estilos.fundoBarra}>

        <View
          style={[
            estilos.barra,
            {
              width: `${porcentagem}%`,
            },
          ]}
        />

      </View>

      <View style={estilos.rodape}>

        <Text style={estilos.porcentagem}>
          {porcentagem}% concluído
        </Text>

        <Text style={estilos.restantes}>
          {pontosRestantes} pontos restantes
        </Text>

      </View>

    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 3,
  },

  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 5,
  },

  linhaPontos: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  pontosAtuais: {
    fontSize: 30,
    fontWeight: '800',
    color: cores.texto,
  },

  pontosMaximos: {
    fontSize: 15,
    color: cores.textoSecundario,
  },

  icone: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: cores.principalClara,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fundoBarra: {
    height: 10,
    backgroundColor: cores.borda,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },

  barra: {
    height: '100%',
    backgroundColor: cores.principal,
    borderRadius: 10,
  },

  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  porcentagem: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.principal,
  },

  restantes: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
});