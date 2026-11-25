const gradientes = {
  principal: ['#22D3EE', '#8B5CF6'],
  esmeralda: ['#34D399', '#10B981'],
  indigo: ['#60A5FA', '#6366F1'],
  laranja: ['#FBBF24', '#F97316'],
  rosa: ['#F472B6', '#A78BFA'],
  ciano: ['#67E8F9', '#06B6D4'],
  roxo: ['#C4B5FD', '#8B5CF6'],
  coral: ['#FDA4AF', '#F43F5E'],
  lima: ['#BEF264', '#84CC16'],
};

const paletasCategoriaEscuro = {
  esmeralda: {
    cor: '#34D399',
    corSuave: 'rgba(52, 211, 153, 0.14)',
    gradiente: gradientes.esmeralda,
  },
  indigo: {
    cor: '#60A5FA',
    corSuave: 'rgba(96, 165, 250, 0.14)',
    gradiente: gradientes.indigo,
  },
  laranja: {
    cor: '#FBBF24',
    corSuave: 'rgba(251, 191, 36, 0.14)',
    gradiente: gradientes.laranja,
  },
  rosa: {
    cor: '#F472B6',
    corSuave: 'rgba(244, 114, 182, 0.14)',
    gradiente: gradientes.rosa,
  },
  ciano: {
    cor: '#22D3EE',
    corSuave: 'rgba(34, 211, 238, 0.14)',
    gradiente: gradientes.ciano,
  },
  roxo: {
    cor: '#A78BFA',
    corSuave: 'rgba(167, 139, 250, 0.14)',
    gradiente: gradientes.roxo,
  },
  coral: {
    cor: '#FB7185',
    corSuave: 'rgba(251, 113, 133, 0.14)',
    gradiente: gradientes.coral,
  },
  lima: {
    cor: '#A3E635',
    corSuave: 'rgba(163, 230, 53, 0.14)',
    gradiente: gradientes.lima,
  },
};

const paletasCategoriaClaro = {
  esmeralda: {
    cor: '#047857',
    corSuave: 'rgba(16, 185, 129, 0.12)',
    gradiente: gradientes.esmeralda,
  },
  indigo: {
    cor: '#4F46E5',
    corSuave: 'rgba(99, 102, 241, 0.12)',
    gradiente: gradientes.indigo,
  },
  laranja: {
    cor: '#9A3412',
    corSuave: 'rgba(249, 115, 22, 0.12)',
    gradiente: gradientes.laranja,
  },
  rosa: {
    cor: '#BE185D',
    corSuave: 'rgba(236, 72, 153, 0.12)',
    gradiente: gradientes.rosa,
  },
  ciano: {
    cor: '#155E75',
    corSuave: 'rgba(6, 182, 212, 0.12)',
    gradiente: gradientes.ciano,
  },
  roxo: {
    cor: '#6D28D9',
    corSuave: 'rgba(139, 92, 246, 0.12)',
    gradiente: gradientes.roxo,
  },
  coral: {
    cor: '#BE123C',
    corSuave: 'rgba(244, 63, 94, 0.12)',
    gradiente: gradientes.coral,
  },
  lima: {
    cor: '#3F6212',
    corSuave: 'rgba(132, 204, 22, 0.12)',
    gradiente: gradientes.lima,
  },
};

function categoriasPadrao(paletas) {
  return {
    saude: paletas.esmeralda,
    estudos: paletas.indigo,
    trabalho: paletas.laranja,
    devocional: paletas.rosa,
  };
}

const escuro = {
  fundo: '#0A0E1A',
  superficie: '#111827',
  superficieElevada: '#1A2236',
  superficieVidro: 'rgba(17, 24, 39, 0.72)',

  borda: 'rgba(255, 255, 255, 0.08)',
  bordaForte: 'rgba(255, 255, 255, 0.16)',

  texto: '#F1F5F9',
  textoSecundario: '#94A3B8',
  textoTerciario: '#64748B',
  textoSobreDestaque: '#0A0E1A',

  principal: '#22D3EE',
  principalSecundaria: '#A78BFA',
  principalSuave: 'rgba(34, 211, 238, 0.14)',
  gradientePrincipal: gradientes.principal,

  sucesso: '#34D399',
  alerta: '#FBBF24',
  erro: '#F87171',

  sombra: '#000000',
  decoracao: ['rgba(34, 211, 238, 0.16)', 'rgba(139, 92, 246, 0.14)'],

  paletasCategoria: paletasCategoriaEscuro,
  categorias: categoriasPadrao(paletasCategoriaEscuro),
};

const claro = {
  fundo: '#F4F6FB',
  superficie: '#FFFFFF',
  superficieElevada: '#EEF2F7',
  superficieVidro: 'rgba(255, 255, 255, 0.78)',

  borda: 'rgba(15, 23, 42, 0.08)',
  bordaForte: 'rgba(15, 23, 42, 0.16)',

  texto: '#0F172A',
  textoSecundario: '#475569',
  textoTerciario: '#64748B',
  textoSobreDestaque: '#0A0E1A',

  principal: '#0C6A84',
  principalSecundaria: '#6D28D9',
  principalSuave: 'rgba(12, 106, 132, 0.10)',
  gradientePrincipal: gradientes.principal,

  sucesso: '#047857',
  alerta: '#92400E',
  erro: '#B91C1C',

  sombra: '#0F172A',
  decoracao: ['rgba(34, 211, 238, 0.18)', 'rgba(139, 92, 246, 0.12)'],

  paletasCategoria: paletasCategoriaClaro,
  categorias: categoriasPadrao(paletasCategoriaClaro),
};

export const paletas = { escuro, claro };
