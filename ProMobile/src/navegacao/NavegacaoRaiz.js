import React from 'react';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AbasInferiores from './AbasInferiores';

import Carregando from '../componentes/Carregando';

import { useTarefas } from '../contexto/TarefasContexto';

import { cores } from '../estilos/cores';

import TelaCategoria from '../telas/TelaCategoria';

const Pilha = createNativeStackNavigator();

const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: cores.fundo,
    card: cores.branco,
    primary: cores.principal,
    text: cores.texto,
    border: cores.borda,
  },
};

// O native-stack trata o botão voltar do Android:
// na tela de categoria ele volta para as abas.
export default function NavegacaoRaiz() {
  const { carregando } = useTarefas();

  if (carregando) {
    return <Carregando />;
  }

  return (
    <NavigationContainer theme={tema}>
      <Pilha.Navigator screenOptions={{ headerShown: false }}>
        <Pilha.Screen name="Abas" component={AbasInferiores} />

        <Pilha.Screen name="Categoria" component={TelaCategoria} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
