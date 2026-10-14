// Ponto central de cores do app. Componentes nunca usam hex solto:
// pegam as cores do tema atual (useTema / useEstilos).
//
// `textoTerciario` não atinge contraste AA para texto pequeno no
// tema escuro: use só em ícones, divisores e textos grandes.
// `textoSobreDestaque` é a cor de ícones e letras sobre gradientes.

const gradientes = {
  principal: ['#22D3EE', '#8B5CF6'],
  saude: ['#34D399', '#10B981'],
  estudos: ['#60A5FA', '#6366F1'],
  trabalho: ['#FBBF24', '#F97316'],
  devocional: ['#F472B6', '#A78BFA'],
};

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

  categorias: {
    saude: {
      cor: '#34D399',
      corSuave: 'rgba(52, 211, 153, 0.14)',
      gradiente: gradientes.saude,
    },
    estudos: {
      cor: '#60A5FA',
      corSuave: 'rgba(96, 165, 250, 0.14)',
      gradiente: gradientes.estudos,
    },
    trabalho: {
      cor: '#FBBF24',
      corSuave: 'rgba(251, 191, 36, 0.14)',
      gradiente: gradientes.trabalho,
    },
    devocional: {
      cor: '#F472B6',
      corSuave: 'rgba(244, 114, 182, 0.14)',
      gradiente: gradientes.devocional,
    },
  },
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

  principal: '#0E7490',
  principalSecundaria: '#6D28D9',
  principalSuave: 'rgba(14, 116, 144, 0.10)',
  gradientePrincipal: gradientes.principal,

  sucesso: '#047857',
  alerta: '#92400E',
  erro: '#B91C1C',

  sombra: '#0F172A',
  decoracao: ['rgba(34, 211, 238, 0.18)', 'rgba(139, 92, 246, 0.12)'],

  categorias: {
    saude: {
      cor: '#047857',
      corSuave: 'rgba(16, 185, 129, 0.12)',
      gradiente: gradientes.saude,
    },
    estudos: {
      cor: '#4F46E5',
      corSuave: 'rgba(99, 102, 241, 0.12)',
      gradiente: gradientes.estudos,
    },
    trabalho: {
      cor: '#9A3412',
      corSuave: 'rgba(249, 115, 22, 0.12)',
      gradiente: gradientes.trabalho,
    },
    devocional: {
      cor: '#BE185D',
      corSuave: 'rgba(236, 72, 153, 0.12)',
      gradiente: gradientes.devocional,
    },
  },
};

export const paletas = { escuro, claro };
