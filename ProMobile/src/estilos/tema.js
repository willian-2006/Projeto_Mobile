import { paletas } from './cores';

import { espaco, raio, AREA_TOQUE } from './espacamentos';

import { fontes, tipografia } from './tipografia';

export const ESQUEMAS = ['escuro', 'claro'];

export function montarTema(esquema) {
  const nome = ESQUEMAS.includes(esquema) ? esquema : 'escuro';

  const cores = paletas[nome];

  return {
    esquema: nome,
    escuro: nome === 'escuro',
    cores,
    categorias: cores.categorias,
    paletasCategoria: cores.paletasCategoria,
    fontes,
    tipografia,
    espaco,
    raio,
    areaToque: AREA_TOQUE,
  };
}

export function coresDaCategoria(tema, categoria) {
  return (
    tema.paletasCategoria[categoria?.paleta] ?? tema.paletasCategoria.indigo
  );
}
