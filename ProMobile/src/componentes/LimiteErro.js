import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { montarTema } from '../estilos/tema';

// Tela mostrada quando algo quebra. Não depende de contexto nem de
// fontes carregadas: o erro pode ter vindo justamente deles.
function TelaErro({ erro, aoTentarDeNovo }) {
  const esquema = useColorScheme() === 'light' ? 'claro' : 'escuro';

  const tema = montarTema(esquema);

  const estilos = criarEstilos(tema);

  return (
    <SafeAreaView style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.icone}>
          <Ionicons name="warning-outline" size={36} color={tema.cores.erro} />
        </View>

        <Text style={estilos.titulo} accessibilityRole="header">
          Algo deu errado
        </Text>

        <Text style={estilos.texto}>
          O app encontrou um problema inesperado. Suas tarefas e seu histórico
          continuam salvos.
        </Text>

        {__DEV__ && erro ? (
          <Text style={estilos.detalhe} selectable>
            {String(erro?.message || erro)}
          </Text>
        ) : null}

        <TouchableOpacity
          style={estilos.botao}
          onPress={aoTentarDeNovo}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Tentar de novo"
        >
          <Text style={estilos.textoBotao}>Tentar de novo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Error Boundary precisa ser um componente de classe (o React não tem
// hook equivalente): é a única classe do projeto. "Tentar de novo"
// remonta todo o app abaixo dele.
export default class LimiteErro extends Component {
  state = { erro: null, tentativa: 0 };

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error('Erro não tratado na interface.', erro, info?.componentStack);
  }

  tentarDeNovo = () => {
    this.setState(estado => ({ erro: null, tentativa: estado.tentativa + 1 }));
  };

  render() {
    if (this.state.erro) {
      return (
        <TelaErro erro={this.state.erro} aoTentarDeNovo={this.tentarDeNovo} />
      );
    }

    return (
      <React.Fragment key={this.state.tentativa}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

const criarEstilos = tema =>
  StyleSheet.create({
    tela: {
      flex: 1,
      backgroundColor: tema.cores.fundo,
    },

    conteudo: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: tema.espaco.xl,
    },

    icone: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: tema.cores.superficieElevada,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: tema.espaco.xl,
    },

    // Fonte do sistema (as personalizadas podem não ter carregado),
    // por isso aqui o peso vem de fontWeight.
    titulo: {
      fontSize: 26,
      fontWeight: '700',
      color: tema.cores.texto,
    },

    texto: {
      fontSize: 15,
      lineHeight: 22,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.sm,
    },

    detalhe: {
      fontSize: 12,
      color: tema.cores.erro,
      marginTop: tema.espaco.lg,
      padding: tema.espaco.md,
      borderRadius: tema.raio.sm,
      backgroundColor: tema.cores.superficie,
    },

    botao: {
      height: 52,
      borderRadius: tema.raio.md,
      backgroundColor: tema.cores.principal,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: tema.espaco.xxl,
    },

    textoBotao: {
      fontSize: 16,
      fontWeight: '600',
      color: tema.cores.fundo,
    },
  });
