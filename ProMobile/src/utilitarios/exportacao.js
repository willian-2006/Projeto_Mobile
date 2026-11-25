import { buscarCategoria } from '../dados/categorias';

import { PRIORIDADES } from '../dados/opcoesTarefa';

import { montarListaCategorias } from './categorias';

import { chaveDia, horarioDaData } from './datas';

import { metaBatida } from './sequencia';

import { descreverRecorrencia } from './tarefas';

import { contar } from './textos';

export const TIPO_MIME_EXPORTACAO = 'text/plain;charset=utf-8';

export const UTI_EXPORTACAO = 'public.plain-text';

const LARGURA = 40;

const LINHA_DUPLA = '='.repeat(LARGURA);

const LINHA_SIMPLES = '-'.repeat(LARGURA);

export function nomeArquivoExportacao(data = new Date()) {
  return `willflow-${chaveDia(data)}.txt`;
}

export function formatarData(chave) {
  const [ano, mes, dia] = chave.split('-');

  return `${dia}/${mes}/${ano}`;
}

function tituloCategoria(chave, categorias) {
  return buscarCategoria(chave, categorias)?.titulo ?? chave ?? 'Sem categoria';
}

function tituloPrioridade(chave) {
  return PRIORIDADES.find(item => item.chave === chave)?.titulo ?? 'Média';
}

function secao(titulo, linhas) {
  return [titulo, LINHA_SIMPLES, ...linhas, ''];
}

function linhasPerfil(preferencias, categorias) {
  const favoritas = (preferencias.categoriasFavoritas ?? []).map(chave =>
    tituloCategoria(chave, categorias)
  );

  const personalizadas = categorias
    .filter(categoria => categoria.personalizada)
    .map(categoria => categoria.titulo);

  return [
    `Nome: ${preferencias.nome?.trim() || 'Não informado'}`,
    `Meta diária: ${contar(preferencias.meta, 'ponto')}`,
    `Categorias favoritas: ${favoritas.length > 0 ? favoritas.join(', ') : 'Nenhuma'}`,
    `Categorias personalizadas: ${
      personalizadas.length > 0 ? personalizadas.join(', ') : 'Nenhuma'
    }`,
    `Lembretes: ${preferencias.lembretesAtivos ? 'Ativados' : 'Desativados'}`,
    `Resumo diário: ${
      preferencias.resumoDiario
        ? `às ${preferencias.horarioResumo}`
        : 'Desativado'
    }`,
  ];
}

function linhasTarefa(tarefa, indice, categorias) {
  const detalhes = [
    `Repetição: ${descreverRecorrencia(tarefa.recorrencia)}`,
    `Horário: ${tarefa.horario ?? 'Sem horário'}`,
  ];

  if (tarefa.horario) {
    detalhes.push(`Lembrete: ${tarefa.lembrete ? 'Sim' : 'Não'}`);
  }

  return [
    `${indice + 1}. [${tarefa.concluida ? 'x' : ' '}] ${tarefa.titulo}`,
    `   Categoria: ${tituloCategoria(tarefa.categoria, categorias)} | ${contar(
      tarefa.pontos,
      'ponto'
    )} | Prioridade: ${tituloPrioridade(tarefa.prioridade)}`,
    `   ${detalhes.join(' | ')}`,
  ];
}

function linhasTarefas(tarefas, categorias) {
  if (tarefas.length === 0) {
    return ['Nenhuma tarefa cadastrada.'];
  }

  return tarefas
    .flatMap((tarefa, indice) => [
      ...linhasTarefa(tarefa, indice, categorias),
      '',
    ])
    .slice(0, -1);
}

function linhasHistorico(historico) {
  if (historico.length === 0) {
    return ['Nenhum dia registrado ainda.'];
  }

  return [...historico]
    .sort((a, b) => (a.data < b.data ? 1 : -1))
    .map(
      registro =>
        `${formatarData(registro.data)} | ${registro.pontos}/${contar(
          registro.meta,
          'ponto'
        )} | ${registro.concluidas}/${contar(registro.total, 'tarefa')} | ${
          metaBatida(registro) ? 'Meta batida' : 'Meta não batida'
        }`
    );
}

export function montarTextoExportacao(
  { tarefas, historico },
  preferencias,
  agora = new Date()
) {
  const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;

  const categorias = montarListaCategorias(
    preferencias.categoriasPersonalizadas
  );

  return [
    LINHA_DUPLA,
    'WILLFLOW - EXPORTAÇÃO DE DADOS',
    LINHA_DUPLA,
    `Exportado em: ${formatarData(chaveDia(agora))} às ${horarioDaData(agora)}`,
    '',
    ...secao('PERFIL', linhasPerfil(preferencias, categorias)),
    ...secao(
      `TAREFAS (${concluidas}/${contar(tarefas.length, 'concluída', 'concluídas')})`,
      linhasTarefas(tarefas, categorias)
    ),
    ...secao(
      `HISTÓRICO (${contar(historico.length, 'dia')})`,
      linhasHistorico(historico)
    ),
    LINHA_DUPLA,
    'Fim da exportação',
    LINHA_DUPLA,
    '',
  ].join('\n');
}
