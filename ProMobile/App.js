import React from 'react';

import { StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';

import LimiteErro from './src/componentes/LimiteErro';

import { AvisoProvider } from './src/contexto/AvisoContexto';

import { PreferenciasProvider } from './src/contexto/PreferenciasContexto';

import { TarefasProvider } from './src/contexto/TarefasContexto';

import { TemaProvider } from './src/contexto/TemaContexto';

import NavegacaoRaiz from './src/navegacao/NavegacaoRaiz';

// A splash nativa fica até dados, tema e fontes carregarem
// (NavegacaoRaiz a esconde).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <GestureHandlerRootView style={estilos.raiz}>
      <SafeAreaProvider>
        <LimiteErro>
          <TemaProvider>
            <AvisoProvider>
              <PreferenciasProvider>
                <TarefasProvider>
                  <NavegacaoRaiz />
                </TarefasProvider>
              </PreferenciasProvider>
            </AvisoProvider>
          </TemaProvider>
        </LimiteErro>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
  },
});
