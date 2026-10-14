import React from 'react';

import { StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AvisoProvider } from './src/contexto/AvisoContexto';

import { PreferenciasProvider } from './src/contexto/PreferenciasContexto';

import { TarefasProvider } from './src/contexto/TarefasContexto';

import { TemaProvider } from './src/contexto/TemaContexto';

import NavegacaoRaiz from './src/navegacao/NavegacaoRaiz';

export default function App() {
  return (
    <GestureHandlerRootView style={estilos.raiz}>
      <SafeAreaProvider>
        <TemaProvider>
          <AvisoProvider>
            <PreferenciasProvider>
              <TarefasProvider>
                <NavegacaoRaiz />
              </TarefasProvider>
            </PreferenciasProvider>
          </AvisoProvider>
        </TemaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
  },
});
