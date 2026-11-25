import { PREFERENCIAS_PADRAO } from '../../dados/preferencias';

import {
  TIPO_MIME_EXPORTACAO,
  formatarData,
  montarTextoExportacao,
  nomeArquivoExportacao,
} from '../exportacao';

const AGORA = new Date(2026, 10, 18, 9, 5);

const tarefas = [
  {
    id: '1',
    titulo: 'Beber 2L de água',
    categoria: 'saude',
    pontos: 10,
    concluida: true,
    prioridade: 'alta',
    horario: '08:00',
    recorrencia: { tipo: 'diaria', dias: [] },
    lembrete: true,
  },
  {
    id: '2',
    titulo: 'Ler a Bíblia',
    categoria: 'devocional',
    pontos: 5,
    concluida: false,
    prioridade: 'media',
    horario: null,
    recorrencia: { tipo: 'semanal', dias: [1, 2, 3, 4, 5] },
    lembrete: false,
  },
];

const historico = [
  {
    data: '2026-11-16',
    pontos: 30,
    meta: 50,
    concluidas: 2,
    total: 4,
    porCategoria: {},
  },
  {
    data: '2026-11-17',
    pontos: 60,
    meta: 50,
    concluidas: 4,
    total: 4,
    porCategoria: {},
  },
];

const preferencias = {
  ...PREFERENCIAS_PADRAO,
  nome: 'Ana',
  categoriasFavoritas: ['saude', 'estudos'],
};

describe('exportação em TXT', () => {
  it('usa extensão .txt e MIME de texto simples', () => {
    expect(nomeArquivoExportacao(AGORA)).toBe('willflow-2026-11-18.txt');
    expect(TIPO_MIME_EXPORTACAO).toBe('text/plain;charset=utf-8');
  });

  it('formata datas no padrão brasileiro', () => {
    expect(formatarData('2026-01-05')).toBe('05/01/2026');
  });

  it('gera texto legível com perfil, tarefas e histórico', () => {
    const texto = montarTextoExportacao(
      { tarefas, historico },
      preferencias,
      AGORA
    );

    expect(texto).toContain('WILLFLOW - EXPORTAÇÃO DE DADOS');
    expect(texto).toContain('Exportado em: 18/11/2026 às 09:05');
    expect(texto).toContain('Nome: Ana');
    expect(texto).toContain('Meta diária: 50 pontos');
    expect(texto).toContain('Categorias favoritas: Saúde, Estudos');
    expect(texto).toContain('TAREFAS (1/2 concluídas)');
    expect(texto).toContain('1. [x] Beber 2L de água');
    expect(texto).toContain('Categoria: Saúde | 10 pontos | Prioridade: Alta');
    expect(texto).toContain(
      'Repetição: Todo dia | Horário: 08:00 | Lembrete: Sim'
    );
    expect(texto).toContain('2. [ ] Ler a Bíblia');
    expect(texto).toContain('Repetição: Dias úteis | Horário: Sem horário');
    expect(texto).toContain('HISTÓRICO (2 dias)');
    expect(texto.indexOf('17/11/2026')).toBeLessThan(
      texto.indexOf('16/11/2026')
    );
    expect(texto).toContain(
      '17/11/2026 | 60/50 pontos | 4/4 tarefas | Meta batida'
    );
    expect(texto).toContain(
      '16/11/2026 | 30/50 pontos | 2/4 tarefas | Meta não batida'
    );
    expect(texto).not.toContain('{');
  });

  it('indica quando não há tarefas nem histórico', () => {
    const texto = montarTextoExportacao(
      { tarefas: [], historico: [] },
      PREFERENCIAS_PADRAO,
      AGORA
    );

    expect(texto).toContain('Nome: Não informado');
    expect(texto).toContain('Categorias favoritas: Nenhuma');
    expect(texto).toContain('Nenhuma tarefa cadastrada.');
    expect(texto).toContain('Nenhum dia registrado ainda.');
  });
});
