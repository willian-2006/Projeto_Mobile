import { cores } from '../estilos/cores';

// A `chave` (sem acento) é o que fica salvo em cada tarefa;
// o `titulo` serve só para exibição.
export const CATEGORIAS = [
  {
    chave: 'saude',
    titulo: 'Saúde',
    subtitulo: 'Cuide do seu corpo e da sua saúde',
    icone: 'heart',
    iconeVazio: 'heart-outline',
    textoVazio: 'Nenhuma tarefa de saúde',
    cor: cores.saudeIcone,
    corFundo: cores.saude,
    gradiente: [cores.saude, cores.saudeIcone],
  },

  {
    chave: 'estudos',
    titulo: 'Estudos',
    subtitulo: 'Organize seus estudos e aprendizado',
    icone: 'book',
    iconeVazio: 'book-outline',
    textoVazio: 'Nenhuma tarefa de estudos',
    cor: cores.estudosIcone,
    corFundo: cores.estudos,
    gradiente: [cores.estudos, cores.estudosIcone],
  },

  {
    chave: 'trabalho',
    titulo: 'Trabalho',
    subtitulo: 'Organize suas atividades profissionais',
    icone: 'briefcase',
    iconeVazio: 'briefcase-outline',
    textoVazio: 'Nenhuma tarefa de trabalho',
    cor: cores.trabalhoIcone,
    corFundo: cores.trabalho,
    gradiente: [cores.trabalho, cores.trabalhoIcone],
  },

  {
    chave: 'devocional',
    titulo: 'Devocional',
    subtitulo: 'Cuide da sua vida espiritual',
    icone: 'heart-circle',
    iconeVazio: 'heart-circle-outline',
    textoVazio: 'Nenhuma tarefa devocional',
    cor: cores.devocionalIcone,
    corFundo: cores.devocional,
    gradiente: [cores.devocional, cores.devocionalIcone],
  },
];

export function buscarCategoria(chave) {
  return CATEGORIAS.find(categoria => categoria.chave === chave);
}
