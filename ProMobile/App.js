import React from 'react';

import { StatusBar } from 'expo-status-bar';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TarefasProvider } from './src/contexto/TarefasContexto';

import NavegacaoRaiz from './src/navegacao/NavegacaoRaiz';

export default function App() {
  return (
    <SafeAreaProvider>
      <TarefasProvider>
        <StatusBar style="dark" />

        <NavegacaoRaiz />
      </TarefasProvider>
    </SafeAreaProvider>
  );
}
