import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [mensagem, setMensagem] = useState('');

  function clicarBotao(texto) {
    setMensagem(texto);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>

        <Text style={styles.logo}>
          WillFlow
        </Text>

        <Text style={styles.titulo}>
          Organize seu dia.
        </Text>

        <Text style={styles.subtitulo}>
          Alcance suas metas.
        </Text>

        <View style={styles.botoes}>

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              clicarBotao('Você clicou em Minhas Tarefas!')
            }
          >
            <Text style={styles.textoBotao}>
              Minhas Tarefas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              clicarBotao('Você clicou em Minhas Metas!')
            }
          >
            <Text style={styles.textoBotao}>
              Minhas Metas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              clicarBotao('Você clicou em Minha Rotina!')
            }
          >
            <Text style={styles.textoBotao}>
              Minha Rotina
            </Text>
          </TouchableOpacity>

        </View>

        {mensagem !== '' && (
          <Text style={styles.mensagem}>
            {mensagem}
          </Text>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 35,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F1F2E',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 17,
    color: '#858592',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },

  botoes: {
    gap: 15,
  },

  botao: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  mensagem: {
    fontSize: 16,
    color: '#6C5CE7',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: '600',
  },
});