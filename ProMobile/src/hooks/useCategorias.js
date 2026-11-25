import { useCallback, useMemo } from 'react';

import { usePreferencias } from '../contexto/PreferenciasContexto';

import { useTarefas } from '../contexto/TarefasContexto';

import { LIMITE_MAXIMO_CATEGORIAS, buscarCategoria } from '../dados/categorias';

import {
  PREFIXO_CATEGORIA_PERSONALIZADA,
  montarListaCategorias,
  removerCategoriaPersonalizada,
  salvarCategoriaPersonalizada,
} from '../utilitarios/categorias';

import { gerarId } from '../utilitarios/gerarId';

import { ordenarCategorias } from '../utilitarios/preferencias';

export function useListaCategorias() {
  const { preferencias } = usePreferencias();

  const personalizadas = preferencias.categoriasPersonalizadas;

  const favoritas = preferencias.categoriasFavoritas;

  const categorias = useMemo(
    () => montarListaCategorias(personalizadas),
    [personalizadas]
  );

  const ordenadas = useMemo(
    () => ordenarCategorias(categorias, favoritas),
    [categorias, favoritas]
  );

  const buscar = useCallback(
    chave => buscarCategoria(chave, categorias),
    [categorias]
  );

  return useMemo(
    () => ({
      categorias,
      ordenadas,
      total: categorias.length,
      limite: LIMITE_MAXIMO_CATEGORIAS,
      podeCriar: categorias.length < LIMITE_MAXIMO_CATEGORIAS,
      buscar,
    }),
    [categorias, ordenadas, buscar]
  );
}

export function useCategorias() {
  const lista = useListaCategorias();

  const { preferencias, aoAtualizarPreferencias } = usePreferencias();

  const { aoExcluirTarefasDaCategoria } = useTarefas();

  const personalizadas = preferencias.categoriasPersonalizadas;

  const aoSalvarCategoria = useCallback(
    ({ chave, titulo, icone, paleta }) => {
      const chaveFinal =
        chave ?? `${PREFIXO_CATEGORIA_PERSONALIZADA}${gerarId()}`;

      aoAtualizarPreferencias({
        categoriasPersonalizadas: salvarCategoriaPersonalizada(personalizadas, {
          chave: chaveFinal,
          titulo,
          icone,
          paleta,
        }),
      });

      return chaveFinal;
    },
    [personalizadas, aoAtualizarPreferencias]
  );

  const aoExcluirCategoria = useCallback(
    chave => {
      aoExcluirTarefasDaCategoria(chave);
      aoAtualizarPreferencias({
        categoriasPersonalizadas: removerCategoriaPersonalizada(
          personalizadas,
          chave
        ),
      });
    },
    [personalizadas, aoAtualizarPreferencias, aoExcluirTarefasDaCategoria]
  );

  return { ...lista, aoSalvarCategoria, aoExcluirCategoria };
}
