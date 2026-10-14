// O avatar é a inicial do nome sobre um dos gradientes do tema
// (`gradientePrincipal` ou o de uma categoria).
export const CORES_AVATAR = [
  'principal',
  'saude',
  'estudos',
  'trabalho',
  'devocional',
];

export const META_MINIMA = 10;

export const META_MAXIMA = 500;

export const PASSO_META = 10;

export const TAMANHO_MAXIMO_NOME = 30;

export const PREFERENCIAS_PADRAO = {
  nome: '',
  corAvatar: 'principal',
  meta: 50,
  categoriasFavoritas: [],
  lembretesAtivos: false,
  resumoDiario: true,
  horarioResumo: '20:00',
  onboardingConcluido: false,
};
