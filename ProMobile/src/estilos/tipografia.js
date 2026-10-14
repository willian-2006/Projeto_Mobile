export const fontes = {
  titulo: 'SpaceGrotesk_700Bold',
  tituloMedio: 'SpaceGrotesk_600SemiBold',
  numero: 'SpaceGrotesk_700Bold',

  corpo: 'Inter_400Regular',
  corpoMedio: 'Inter_500Medium',
  corpoSemiNegrito: 'Inter_600SemiBold',
  corpoNegrito: 'Inter_700Bold',
};

export const tipografia = {
  tituloTela: {
    fontFamily: fontes.titulo,
    fontSize: 26,
    letterSpacing: -0.5,
  },

  tituloSecao: {
    fontFamily: fontes.titulo,
    fontSize: 19,
    letterSpacing: -0.3,
  },

  tituloCartao: {
    fontFamily: fontes.tituloMedio,
    fontSize: 16,
  },

  corpo: {
    fontFamily: fontes.corpo,
    fontSize: 14,
  },

  corpoMedio: {
    fontFamily: fontes.corpoMedio,
    fontSize: 15,
  },

  legenda: {
    fontFamily: fontes.corpo,
    fontSize: 12,
  },

  legendaDestaque: {
    fontFamily: fontes.corpoSemiNegrito,
    fontSize: 12,
  },

  rotulo: {
    fontFamily: fontes.corpoMedio,
    fontSize: 10,
  },

  numeros: {
    fontFamily: fontes.numero,
    fontVariant: ['tabular-nums'],
  },
};
