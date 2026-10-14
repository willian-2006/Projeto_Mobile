import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TarefasProvider } from './src/contexto/TarefasContexto';

import { TemaProvider } from './src/contexto/TemaContexto';

import NavegacaoRaiz from './src/navegacao/NavegacaoRaiz';

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <TarefasProvider>
          <NavegacaoRaiz />
        </TarefasProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}
