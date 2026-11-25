import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import BotaoPrincipal from '../componentes/BotaoPrincipal';

import CabecalhoTela from '../componentes/CabecalhoTela';

import Cartao from '../componentes/Cartao';

import Chip from '../componentes/Chip';

import SeletorHorario from '../componentes/SeletorHorario';

import Tela from '../componentes/Tela';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { coresDaCategoria } from '../estilos/tema';

import { useListaCategorias } from '../hooks/useCategorias';

import {
  OPCOES_PONTOS,
  PONTOS_PADRAO,
  PRIORIDADES,
  PRIORIDADE_PADRAO,
  TAMANHO_MAXIMO_TITULO,
  TIPOS_RECORRENCIA,
} from '../dados/opcoesTarefa';

import { INICIAIS_DIAS, NOMES_DIAS } from '../utilitarios/datas';

const DIAS_SEMANA = [0, 1, 2, 3, 4, 5, 6];

export default function EditorTarefa({ route, navigation }) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const { tarefas, aoAdicionar, aoEditar, aoExcluir } = useTarefas();

  const { preferencias } = usePreferencias();

  const { ordenadas: categorias, buscar } = useListaCategorias();

  const parametros = route.params || {};

  const encontrada = parametros.id
    ? tarefas.find(tarefa => tarefa.id === parametros.id)
    : null;

  const [tarefaInicial] = useState(encontrada);

  const [excluindo, setExcluindo] = useState(false);

  const existente = encontrada ?? (excluindo ? tarefaInicial : null);

  const [campos, setCampos] = useState(() => ({
    titulo: existente?.titulo ?? parametros.titulo ?? '',
    categoria:
      existente?.categoria ??
      buscar(parametros.categoria)?.chave ??
      categorias[0].chave,
    pontos: existente?.pontos ?? PONTOS_PADRAO,
    prioridade: existente?.prioridade ?? PRIORIDADE_PADRAO,
    horario: existente?.horario ?? null,
    lembrete: existente?.lembrete ?? false,
    recorrencia: existente?.recorrencia ?? { tipo: 'diaria', dias: [] },
  }));

  function alterar(alteracoes) {
    setCampos(atuais => ({ ...atuais, ...alteracoes }));
  }

  function alternarDia(dia) {
    const dias = campos.recorrencia.dias.includes(dia)
      ? campos.recorrencia.dias.filter(item => item !== dia)
      : [...campos.recorrencia.dias, dia];

    alterar({ recorrencia: { tipo: 'semanal', dias } });
  }

  const titulo = campos.titulo.trim();

  const semDias =
    campos.recorrencia.tipo === 'semanal' &&
    campos.recorrencia.dias.length === 0;

  const podeSalvar = titulo !== '' && !semDias;

  function salvar() {
    if (!podeSalvar) {
      return;
    }

    const dados = { ...campos, titulo };

    if (existente) {
      aoEditar(existente.id, dados);
    } else {
      aoAdicionar(dados);
    }

    navigation.goBack();
  }

  function excluir() {
    setExcluindo(true);
    navigation.goBack();
    aoExcluir(existente.id);
  }

  const opcoesPontos = OPCOES_PONTOS.includes(campos.pontos)
    ? OPCOES_PONTOS
    : [...OPCOES_PONTOS, campos.pontos].sort((a, b) => a - b);

  if (parametros.id && !existente) {
    return (
      <Tela>
        <View style={estilos.conteudo}>
          <CabecalhoTela
            titulo="Tarefa não encontrada"
            aoVoltar={() => navigation.goBack()}
          />
        </View>
      </Tela>
    );
  }

  return (
    <Tela>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudo}
      >
        <CabecalhoTela
          titulo={existente ? 'Editar tarefa' : 'Nova tarefa'}
          aoVoltar={() => navigation.goBack()}
        />

        <TextInput
          style={estilos.input}
          placeholder="O que você quer fazer?"
          placeholderTextColor={tema.cores.textoSecundario}
          selectionColor={tema.cores.principal}
          value={campos.titulo}
          onChangeText={texto => alterar({ titulo: texto })}
          maxLength={TAMANHO_MAXIMO_TITULO}
          autoFocus={!existente && !campos.titulo}
          returnKeyType="done"
          accessibilityLabel="Título da tarefa"
        />

        <Text style={estilos.rotulo}>Categoria</Text>

        <View style={estilos.grupo} accessibilityRole="radiogroup">
          {categorias.map(categoria => {
            const cores = coresDaCategoria(tema, categoria);

            return (
              <Chip
                key={categoria.chave}
                titulo={categoria.titulo}
                icone={categoria.icone}
                ativo={campos.categoria === categoria.chave}
                cor={cores.cor}
                corSuave={cores.corSuave}
                aoPressionar={() => alterar({ categoria: categoria.chave })}
              />
            );
          })}
        </View>

        <Text style={estilos.rotulo}>Pontos</Text>

        <View style={estilos.grupo} accessibilityRole="radiogroup">
          {opcoesPontos.map(pontos => (
            <Chip
              key={pontos}
              titulo={`${pontos} pts`}
              ativo={campos.pontos === pontos}
              aoPressionar={() => alterar({ pontos })}
              rotuloAcessivel={`${pontos} pontos`}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>Prioridade</Text>

        <View style={estilos.grupo} accessibilityRole="radiogroup">
          {PRIORIDADES.map(prioridade => (
            <Chip
              key={prioridade.chave}
              titulo={prioridade.titulo}
              icone={prioridade.icone}
              ativo={campos.prioridade === prioridade.chave}
              cor={prioridade.chave === 'alta' ? tema.cores.alerta : undefined}
              aoPressionar={() => alterar({ prioridade: prioridade.chave })}
              rotuloAcessivel={`Prioridade ${prioridade.titulo}`}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>Repetir</Text>

        <View style={estilos.grupo} accessibilityRole="radiogroup">
          {TIPOS_RECORRENCIA.map(tipo => (
            <Chip
              key={tipo.chave}
              titulo={tipo.titulo}
              ativo={campos.recorrencia.tipo === tipo.chave}
              aoPressionar={() =>
                alterar({
                  recorrencia: {
                    tipo: tipo.chave,
                    dias:
                      tipo.chave === 'semanal' ? campos.recorrencia.dias : [],
                  },
                })
              }
            />
          ))}
        </View>

        {campos.recorrencia.tipo === 'semanal' ? (
          <View style={estilos.dias}>
            {DIAS_SEMANA.map(dia => (
              <Chip
                key={dia}
                titulo={INICIAIS_DIAS[dia]}
                multipla
                ativo={campos.recorrencia.dias.includes(dia)}
                aoPressionar={() => alternarDia(dia)}
                rotuloAcessivel={NOMES_DIAS[dia]}
                style={estilos.dia}
              />
            ))}
          </View>
        ) : null}

        {semDias ? (
          <Text style={estilos.aviso}>Escolha pelo menos um dia.</Text>
        ) : null}

        <Cartao style={estilos.cartaoHorario}>
          <SeletorHorario
            valor={campos.horario}
            permitirRemover
            aoMudar={horario =>
              alterar({
                horario,
                lembrete: horario ? campos.lembrete : false,
              })
            }
          />

          <View style={[estilos.linha, !campos.horario && estilos.inativa]}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={tema.cores.textoSecundario}
            />

            <Text style={estilos.textoLinha}>Lembrete</Text>

            <Switch
              value={campos.lembrete}
              onValueChange={lembrete => alterar({ lembrete })}
              disabled={!campos.horario}
              trackColor={{
                false: tema.cores.superficieElevada,
                true: tema.cores.principal,
              }}
              thumbColor={tema.cores.superficie}
              accessibilityLabel="Lembrete no horário da tarefa"
            />
          </View>
        </Cartao>

        {!campos.horario ? (
          <Text style={estilos.legenda}>
            Defina um horário para receber um lembrete.
          </Text>
        ) : campos.lembrete && !preferencias.lembretesAtivos ? (
          <Text style={estilos.legenda}>
            Os lembretes estão desligados. Ative-os no Perfil.
          </Text>
        ) : null}

        <BotaoPrincipal
          titulo={existente ? 'Salvar alterações' : 'Criar tarefa'}
          aoPressionar={salvar}
          desativado={!podeSalvar}
          style={estilos.botaoSalvar}
        />

        {existente ? (
          <TouchableOpacity
            style={estilos.botaoExcluir}
            onPress={excluir}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Excluir tarefa"
          >
            <Ionicons name="trash-outline" size={18} color={tema.cores.erro} />

            <Text style={estilos.textoExcluir}>Excluir tarefa</Text>
          </TouchableOpacity>
        ) : null}
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

    input: {
      ...tema.tipografia.corpoMedio,
      height: 54,
      backgroundColor: tema.cores.superficieVidro,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tema.cores.bordaForte,
      borderRadius: tema.raio.md,
      paddingHorizontal: tema.espaco.lg,
      color: tema.cores.texto,
    },

    rotulo: {
      ...tema.tipografia.legendaDestaque,
      color: tema.cores.textoSecundario,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginTop: tema.espaco.xl,
      marginBottom: tema.espaco.sm,
    },

    grupo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tema.espaco.sm,
    },

    dias: {
      flexDirection: 'row',
      gap: tema.espaco.xs,
      marginTop: tema.espaco.md,
    },

    dia: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 0,
    },

    aviso: {
      ...tema.tipografia.legenda,
      color: tema.cores.erro,
      marginTop: tema.espaco.sm,
    },

    cartaoHorario: {
      paddingHorizontal: tema.espaco.lg,
      marginTop: tema.espaco.xl,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: tema.cores.borda,
    },

    inativa: {
      opacity: 0.5,
    },

    textoLinha: {
      ...tema.tipografia.corpoMedio,
      flex: 1,
      color: tema.cores.texto,
      marginLeft: tema.espaco.md,
    },

    legenda: {
      ...tema.tipografia.legenda,
      color: tema.cores.textoSecundario,
      marginTop: tema.espaco.sm,
    },

    botaoSalvar: {
      marginTop: tema.espaco.xxl,
    },

    botaoExcluir: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: tema.areaToque,
      marginTop: tema.espaco.md,
    },

    textoExcluir: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 14,
      color: tema.cores.erro,
      marginLeft: tema.espaco.sm,
    },
  });
