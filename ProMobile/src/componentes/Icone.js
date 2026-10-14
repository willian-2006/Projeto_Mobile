import React from 'react';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const PREFIXO_MATERIAL = 'mci:';

export default function Icone({ nome, ...resto }) {
  if (nome.startsWith(PREFIXO_MATERIAL)) {
    return (
      <MaterialCommunityIcons
        name={nome.slice(PREFIXO_MATERIAL.length)}
        {...resto}
      />
    );
  }

  return <Ionicons name={nome} {...resto} />;
}
