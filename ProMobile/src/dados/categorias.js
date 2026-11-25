export const LIMITE_MAXIMO_CATEGORIAS = 6;

export const TAMANHO_MAXIMO_NOME_CATEGORIA = 15;

export const CATEGORIAS = [
  {
    chave: 'saude',
    titulo: 'Saúde',
    subtitulo: 'Cuide do seu corpo e da sua saúde',
    icone: 'heart',
    iconeVazio: 'heart-outline',
    textoVazio: 'Nenhuma tarefa de saúde',
    paleta: 'esmeralda',
  },

  {
    chave: 'estudos',
    titulo: 'Estudos',
    subtitulo: 'Organize seus estudos e aprendizado',
    icone: 'book',
    iconeVazio: 'book-outline',
    textoVazio: 'Nenhuma tarefa de estudos',
    paleta: 'indigo',
  },

  {
    chave: 'trabalho',
    titulo: 'Trabalho',
    subtitulo: 'Organize suas atividades profissionais',
    icone: 'briefcase',
    iconeVazio: 'briefcase-outline',
    textoVazio: 'Nenhuma tarefa de trabalho',
    paleta: 'laranja',
  },

  {
    chave: 'devocional',
    titulo: 'Devocional',
    subtitulo: 'Cuide da sua vida espiritual',
    icone: 'mci:hands-pray',
    iconeVazio: 'mci:hands-pray',
    textoVazio: 'Nenhuma tarefa devocional',
    paleta: 'rosa',
  },
];

export const ICONES_CATEGORIA = [
  { chave: 'wallet', titulo: 'Carteira' },
  { chave: 'barbell', titulo: 'Halteres' },
  { chave: 'book', titulo: 'Livro' },
  { chave: 'musical-notes', titulo: 'Música' },
  { chave: 'home', titulo: 'Casa' },
  { chave: 'code-slash', titulo: 'Código' },
  { chave: 'cart', titulo: 'Compras' },
  { chave: 'airplane', titulo: 'Viagem' },
  { chave: 'leaf', titulo: 'Natureza' },
  { chave: 'paw', titulo: 'Pet' },
  { chave: 'game-controller', titulo: 'Jogos' },
  { chave: 'brush', titulo: 'Arte' },
  { chave: 'cafe', titulo: 'Café' },
  { chave: 'bicycle', titulo: 'Bicicleta' },
  { chave: 'people', titulo: 'Pessoas' },
  { chave: 'star', titulo: 'Estrela' },
];

export const PALETAS_CATEGORIA = [
  { chave: 'laranja', titulo: 'Laranja' },
  { chave: 'esmeralda', titulo: 'Verde esmeralda' },
  { chave: 'indigo', titulo: 'Azul índigo' },
  { chave: 'rosa', titulo: 'Rosa' },
  { chave: 'ciano', titulo: 'Ciano' },
  { chave: 'roxo', titulo: 'Roxo' },
  { chave: 'coral', titulo: 'Coral' },
  { chave: 'lima', titulo: 'Verde lima' },
];

export function buscarCategoria(chave, categorias = CATEGORIAS) {
  return categorias.find(categoria => categoria.chave === chave);
}
