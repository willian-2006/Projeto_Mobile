import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { horarioDaData } from '../utilitarios/datas';

function dataDoHorario(horario) {
  const data = new Date();

  const [horas, minutos] = (horario || '08:00').split(':').map(Number);

  data.setHours(horas, minutos, 0, 0);

  return data;
}

export default function SeletorHorario({
  rotulo = 'Horário',
  valor,
  aoMudar,
  permitirRemover = false,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const [aberto, setAberto] = useState(false);

  function abrir() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dataDoHorario(valor),
        mode: 'time',
        is24Hour: true,
        onChange: (evento, data) => {
          if (evento.type === 'set' && data) {
            aoMudar(horarioDaData(data));
          }
        },
      });

      return;
    }

    if (!valor) {
      aoMudar(horarioDaData(dataDoHorario(null)));
    }

    setAberto(atual => !atual);
  }

  return (
    <View>
      <View style={estilos.linha}>
        <Ionicons
          name="time-outline"
          size={20}
          color={tema.cores.textoSecundario}
        />

        <Text style={estilos.rotulo}>{rotulo}</Text>

        <TouchableOpacity
          style={estilos.valor}
          onPress={abrir}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${rotulo}: ${valor || 'sem horário'}`}
          accessibilityHint="Escolher horário"
        >
          <Text style={[estilos.textoValor, !valor && estilos.semValor]}>
            {valor || 'Definir'}
          </Text>
        </TouchableOpacity>

        {permitirRemover && valor ? (
          <TouchableOpacity
            style={estilos.remover}
            onPress={() => {
              setAberto(false);
              aoMudar(null);
            }}
            accessibilityRole="button"
            accessibilityLabel="Remover horário"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={tema.cores.textoSecundario}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {Platform.OS === 'ios' && aberto && valor ? (
        <DateTimePicker
          value={dataDoHorario(valor)}
          mode="time"
          display="spinner"
          themeVariant={tema.escuro ? 'dark' : 'light'}
          textColor={tema.cores.texto}
          onChange={(evento, data) => {
            if (data) {
              aoMudar(horarioDaData(data));
            }
          }}
        />
      ) : null}
    </View>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
    },

    rotulo: {
      ...tema.tipografia.corpoMedio,
      flex: 1,
      color: tema.cores.texto,
      marginLeft: tema.espaco.md,
    },

    valor: {
      minHeight: tema.areaToque,
      minWidth: 72,
      paddingHorizontal: tema.espaco.md,
      borderRadius: tema.raio.sm,
      backgroundColor: tema.cores.principalSuave,
      justifyContent: 'center',
      alignItems: 'center',
    },

    textoValor: {
      ...tema.tipografia.numeros,
      fontSize: 16,
      color: tema.cores.principal,
    },

    semValor: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 14,
    },

    remover: {
      width: tema.areaToque,
      height: tema.areaToque,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
