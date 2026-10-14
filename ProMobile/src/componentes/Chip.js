import React from 'react';

import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import Icone from './Icone';

import { useEstilos, useTema } from '../contexto/TemaContexto';

import { vibrarSelecao } from '../servicos/vibracao';

export default function Chip({
  titulo,
  ativo,
  aoPressionar,
  icone,
  cor,
  corSuave,
  rotuloAcessivel,
  multipla = false,
  style,
}) {
  const { tema } = useTema();

  const estilos = useEstilos(criarEstilos);

  const corAtiva = cor || tema.cores.principal;

  const fundoAtivo = corSuave || tema.cores.principalSuave;

  return (
    <TouchableOpacity
      style={[
        estilos.chip,
        ativo && { backgroundColor: fundoAtivo, borderColor: corAtiva },
        style,
      ]}
      onPress={() => {
        vibrarSelecao();
        aoPressionar();
      }}
      activeOpacity={0.7}
      accessibilityRole={multipla ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: Boolean(ativo) }}
      accessibilityLabel={rotuloAcessivel || titulo}
    >
      {icone ? (
        <Icone
          nome={icone}
          size={15}
          color={ativo ? corAtiva : tema.cores.textoSecundario}
          style={titulo ? estilos.icone : null}
        />
      ) : null}

      {titulo ? (
        <Text
          style={[
            estilos.texto,
            ativo && [estilos.textoAtivo, { color: corAtiva }],
          ]}
        >
          {titulo}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const criarEstilos = tema =>
  StyleSheet.create({
    chip: {
      minHeight: tema.areaToque,
      minWidth: tema.areaToque,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: tema.espaco.md + 2,
      borderRadius: tema.raio.pilula,
      borderWidth: 1,
      borderColor: tema.cores.borda,
      backgroundColor: tema.cores.superficieVidro,
    },

    icone: {
      marginRight: 6,
    },

    texto: {
      ...tema.tipografia.legendaDestaque,
      fontSize: 13,
      color: tema.cores.textoSecundario,
    },

    textoAtivo: {
      fontFamily: tema.fontes.corpoNegrito,
    },
  });
