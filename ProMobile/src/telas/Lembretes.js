import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import SeletorHorario from '../componentes/SeletorHorario';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { pedirPermissao } from '../servicos/notificacoes';

import { descreverRecorrencia } from '../utilitarios/tarefas';

export default function Lembretes({ navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { preferencias, aoAtualizarPreferencias } = usePreferencias();

  const { tarefas } = useTarefas();

  const [pedindo, setPedindo] = useState(false);

  const tarefasComLembrete = tarefas
    .filter(tarefa => tarefa.lembrete && tarefa.horario)
    .sort((a, b) => (a.horario < b.horario ? -1 : 1));

  const corTrilha = {
    false: tema.cores.superficieElevada,
    true: tema.cores.principal,
  };

  async function alternarLembretes(ativar) {
    if (!ativar) {
      aoAtualizarPreferencias({ lembretesAtivos: false });
      return;
    }

    setPedindo(true);

    const permitido = await pedirPermissao();

    setPedindo(false);

    if (permitido) {
      aoAtualizarPreferencias({ lembretesAtivos: true });
      return;
    }

    Alert.alert(
      'Notificações bloqueadas',
      'Para receber lembretes, permita as notificações do app nas configurações do aparelho.',
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
      ]
    );
  }

  const inativo = !preferencias.lembretesAtivos;

  return (
    <Tela>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <CabecalhoTela
          titulo="Lembretes"
          subtitulo="Avisos no horário das tarefas e um resumo diário"
          aoVoltar={() => navigation.goBack()}
        />

        <Cartao style={estilos.cartao}>
          <View style={estilos.linha}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={tema.cores.textoSecundario}
            />

            <Text style={estilos.textoLinha}>Ativar lembretes</Text>

            <Switch
              value={preferencias.lembretesAtivos}
              onValueChange={alternarLembretes}
              disabled={pedindo}
              trackColor={corTrilha}
              thumbColor={tema.cores.superficie}
              accessibilityLabel="Ativar lembretes"
            />
          </View>
        </Cartao>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Resumo diário
        </Text>

        <Cartao style={[estilos.cartao, inativo && estilos.inativo]}>
          <View style={estilos.linha}>
            <Ionicons
              name="today-outline"
              size={20}
              color={tema.cores.textoSecundario}
            />

            <Text style={estilos.textoLinha}>Receber resumo</Text>

            <Switch
              value={preferencias.resumoDiario}
              onValueChange={resumoDiario =>
                aoAtualizarPreferencias({ resumoDiario })
              }
              disabled={inativo}
              trackColor={corTrilha}
              thumbColor={tema.cores.superficie}
              accessibilityLabel="Receber resumo diário"
            />
          </View>

          <View style={estilos.divisor} />

          <View pointerEvents={inativo ? 'none' : 'auto'}>
            <SeletorHorario
              valor={preferencias.horarioResumo}
              aoMudar={horarioResumo =>
                aoAtualizarPreferencias({ horarioResumo })
              }
            />
          </View>
        </Cartao>

        <Text style={estilos.legenda}>
          Mostra quantos pontos faltam para a meta. Não chega se a meta do dia
          já foi batida.
        </Text>

        <Text style={estilos.tituloSecao} accessibilityRole="header">
          Tarefas com lembrete
        </Text>

        {tarefasComLembrete.length === 0 ? (
          <Text style={estilos.legenda}>
            Ao criar ou editar uma tarefa, defina um horário e ative o lembrete.
          </Text>
        ) : (
          <Cartao style={estilos.cartao}>
            {tarefasComLembrete.map((tarefa, indice) => (
              <TouchableOpacity
                key={tarefa.id}
                style={[estilos.linha, indice > 0 && estilos.comDivisor]}
                onPress={() =>
                  navigation.navigate('EditorTarefa', { id: tarefa.id })
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${tarefa.titulo}, às ${tarefa.horario}. Editar`}
              >
                <Text style={estilos.horario}>{tarefa.horario}</Text>

                <View style={estilos.textosTarefa}>
                  <Text style={estilos.tituloTarefa} numberOfLines={1}>
                    {tarefa.titulo}
                  </Text>

                  <Text style={estilos.detalhe}>
                    {descreverRecorrencia(tarefa.recorrencia)}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={tema.cores.textoTerciario}
                />
              </TouchableOpacity>
            ))}
          </Cartao>
        )}
      </ScrollView>
    </Tela>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    conteudo: {
      paddingHorizontal: tema.espaco.xl - 4,
      paddingTop: tema.espaco.xl - 4,
      paddingBottom: tema.espaco.xxl,
    },

    cartao: {
      paddingHorizontal: tema.espaco.lg,
    },

    inativo: {
      opacity: 0.5,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
    },

    comDivisor: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: tema.cores.borda,
    },

    divisor: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: tema.cores.borda,
    },

    textoLinha: {
      ...tema.tipografia.corpoMedio,
      flex: 1,
      color: tema.cores.texto,
      marginLeft: tema.espaco.md,
    },

    tituloSecao: {
      ...tema.tipografia.tituloSecao,
      color: tema.cores.texto,
      marginTop: tema.espaco.xxl - 4,
      marginBottom: tema.espaco.md,
    },

    legenda: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.sm,
    },

    horario: {
      ...tema.tipografia.numeros,
      fontSize: 16,
      color: tema.cores.principal,
      width: 56,
    },

    textosTarefa: {
      flex: 1,
      marginRight: tema.espaco.sm,
    },

    tituloTarefa: {
      ...tema.tipografia.corpoMedio,
      color: tema.cores.texto,
    },

    detalhe: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: 2,
    },
  });
