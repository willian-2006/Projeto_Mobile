import React, { useMemo } from 'react';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';

import AbasInferiores from './AbasInferiores';

import Carregando from '../componentes/Carregando';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { useTema } from '../contexto/TemaContexto';

import { arquivosFontes } from '../estilos/fontes';

import { useAvisoMeta } from '../hooks/useAvisoMeta';

import EditorTarefa from '../telas/EditorTarefa';

import TelaCategoria from '../telas/TelaCategoria';

const Pilha = createNativeStackNavigator();

// O native-stack trata o botão voltar do Android:
// na tela de categoria ele volta para as abas.
export default function NavegacaoRaiz() {
  const { carregando: carregandoTarefas } = useTarefas();

  const { carregando: carregandoPreferencias } = usePreferencias();

  const { tema, carregando: carregandoTema } = useTema();

  // Se a fonte falhar, segue com a fonte do sistema em vez de travar.
  const [fontesCarregadas, erroFontes] = useFonts(arquivosFontes);

  useAvisoMeta();

  const temaNavegacao = useMemo(() => {
    const base = tema.escuro ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        background: tema.cores.fundo,
        card: tema.cores.superficie,
        primary: tema.cores.principal,
        text: tema.cores.texto,
        border: tema.cores.borda,
      },
    };
  }, [tema]);

  const barraStatus = <StatusBar style={tema.escuro ? 'light' : 'dark'} />;

  if (
    carregandoTarefas ||
    carregandoPreferencias ||
    carregandoTema ||
    !(fontesCarregadas || erroFontes)
  ) {
    return (
      <>
        {barraStatus}

        <Carregando />
      </>
    );
  }

  return (
    <NavigationContainer theme={temaNavegacao}>
      {barraStatus}

      <Pilha.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tema.cores.fundo },
        }}
      >
        <Pilha.Screen name="Abas" component={AbasInferiores} />

        <Pilha.Screen name="Categoria" component={TelaCategoria} />

        <Pilha.Screen
          name="EditorTarefa"
          component={EditorTarefa}
          options={{ presentation: 'modal' }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
