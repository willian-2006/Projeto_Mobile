import React, { useEffect, useMemo } from 'react';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import AbasInferiores from './AbasInferiores';

import Carregando from '../componentes/Carregando';

import Confete from '../componentes/Confete';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { useTema } from '../contexto/TemaContexto';

import { arquivosFontes } from '../estilos/fontes';

import { useComemoracaoMeta } from '../hooks/useComemoracaoMeta';

import { useLembretes } from '../hooks/useLembretes';

import EditorTarefa from '../telas/EditorTarefa';

import Lembretes from '../telas/Lembretes';

import Onboarding from '../telas/Onboarding';

import TelaCategoria from '../telas/TelaCategoria';

const Pilha = createNativeStackNavigator();

export default function NavegacaoRaiz() {
  const { carregando: carregandoTarefas } = useTarefas();

  const { preferencias, carregando: carregandoPreferencias } =
    usePreferencias();

  const { tema, carregando: carregandoTema } = useTema();

  const [fontesCarregadas, erroFontes] = useFonts(arquivosFontes);

  const comemoracao = useComemoracaoMeta();

  useLembretes();

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

  const carregando =
    carregandoTarefas ||
    carregandoPreferencias ||
    carregandoTema ||
    !(fontesCarregadas || erroFontes);

  useEffect(() => {
    if (!carregando) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [carregando]);

  if (carregando) {
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
        {preferencias.onboardingConcluido ? (
          <>
            <Pilha.Screen name="Abas" component={AbasInferiores} />

            <Pilha.Screen name="Categoria" component={TelaCategoria} />

            <Pilha.Screen name="Lembretes" component={Lembretes} />

            <Pilha.Screen
              name="EditorTarefa"
              component={EditorTarefa}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <Pilha.Screen name="Onboarding" component={Onboarding} />
        )}
      </Pilha.Navigator>

      {comemoracao > 0 && <Confete key={comemoracao} />}
    </NavigationContainer>
  );
}
