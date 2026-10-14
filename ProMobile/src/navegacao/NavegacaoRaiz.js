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

// O native-stack trata o botão voltar do Android:
// na tela de categoria ele volta para as abas. Enquanto o onboarding
// não foi concluído, ele é a única tela da pilha.
export default function NavegacaoRaiz() {
  const { carregando: carregandoTarefas } = useTarefas();

  const { preferencias, carregando: carregandoPreferencias } =
    usePreferencias();

  const { tema, carregando: carregandoTema } = useTema();

  // Se a fonte falhar, segue com a fonte do sistema em vez de travar.
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
