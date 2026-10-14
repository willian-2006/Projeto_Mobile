export const CATEGORIAS = [
  {
    chave: 'saude',
    titulo: 'Saúde',
    subtitulo: 'Cuide do seu corpo e da sua saúde',
    icone: 'heart',
    iconeVazio: 'heart-outline',
    textoVazio: 'Nenhuma tarefa de saúde',
  },

  {
    chave: 'estudos',
    titulo: 'Estudos',
    subtitulo: 'Organize seus estudos e aprendizado',
    icone: 'book',
    iconeVazio: 'book-outline',
    textoVazio: 'Nenhuma tarefa de estudos',
  },

  {
    chave: 'trabalho',
    titulo: 'Trabalho',
    subtitulo: 'Organize suas atividades profissionais',
    icone: 'briefcase',
    iconeVazio: 'briefcase-outline',
    textoVazio: 'Nenhuma tarefa de trabalho',
  },

  {
    chave: 'devocional',
    titulo: 'Devocional',
    subtitulo: 'Cuide da sua vida espiritual',
    icone: 'mci:hands-pray',
    iconeVazio: 'mci:hands-pray',
    textoVazio: 'Nenhuma tarefa devocional',
  },
];

export function buscarCategoria(chave) {
  return CATEGORIAS.find(categoria => categoria.chave === chave);
}
