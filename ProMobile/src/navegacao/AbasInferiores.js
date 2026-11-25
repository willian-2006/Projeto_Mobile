import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NavegacaoInferior from '../componentes/NavegacaoInferior';

import Inicio from '../telas/Inicio';

import Tarefas from '../telas/Tarefas';

import Estatisticas from '../telas/Estatisticas';

import Perfil from '../telas/Perfil';

const Abas = createBottomTabNavigator();

function renderizarBarra(propriedades) {
  return <NavegacaoInferior {...propriedades} />;
}

export default function AbasInferiores() {
  return (
    <Abas.Navigator
      tabBar={renderizarBarra}
      screenOptions={{ headerShown: false }}
    >
      <Abas.Screen name="Inicio" component={Inicio} />

      <Abas.Screen name="Tarefas" component={Tarefas} />

      <Abas.Screen name="Estatisticas" component={Estatisticas} />

      <Abas.Screen name="Perfil" component={Perfil} />
    </Abas.Navigator>
  );
}
