import { PREFERENCIAS_PADRAO } from '../../dados/preferencias';

import {
  DIAS_AGENDADOS,
  LIMITE_NOTIFICACOES,
  montarAgenda,
} from '../agendaLembretes';

// Quarta-feira, 14/10/2026, às 10h.
const AGORA = new Date(2026, 9, 14, 10, 0);

const preferencias = {
  ...PREFERENCIAS_PADRAO,
  lembretesAtivos: true,
  resumoDiario: false,
  meta: 30,
};

const tarefa = (id, extra = {}) => ({
  id,
  titulo: `Tarefa ${id}`,
  categoria: 'saude',
  pontos: 10,
  concluida: false,
  horario: '18:00',
  lembrete: true,
  recorrencia: { tipo: 'diaria', dias: [] },
  ...extra,
});

describe('montarAgenda', () => {
  it('fica vazia com os lembretes desligados', () => {
    expect(
      montarAgenda(
        [tarefa('a')],
        { ...preferencias, lembretesAtivos: false },
        AGORA
      )
    ).toEqual([]);
  });

  it('agenda a tarefa diária nos próximos 7 dias', () => {
    const agenda = montarAgenda([tarefa('a')], preferencias, AGORA);

    expect(agenda).toHaveLength(DIAS_AGENDADOS);
    expect(agenda[0]).toEqual({
      id: 'tarefa-a-2026-10-14',
      titulo: 'Tarefa a',
      corpo: '+10 pontos em Saúde',
      data: new Date(2026, 9, 14, 18, 0),
    });
  });

  it('pula horários que já passaram hoje', () => {
    const agenda = montarAgenda(
      [tarefa('a', { horario: '08:00' })],
      preferencias,
      AGORA
    );

    expect(agenda[0].id).toBe('tarefa-a-2026-10-15');
  });

  it('pula a tarefa já concluída hoje, mas não nos outros dias', () => {
    const agenda = montarAgenda(
      [tarefa('a', { concluida: true })],
      preferencias,
      AGORA
    );

    expect(agenda).toHaveLength(DIAS_AGENDADOS - 1);
    expect(agenda[0].id).toBe('tarefa-a-2026-10-15');
  });

  it('ignora tarefas sem lembrete ou sem horário', () => {
    const agenda = montarAgenda(
      [tarefa('a', { lembrete: false }), tarefa('b', { horario: null })],
      preferencias,
      AGORA
    );

    expect(agenda).toEqual([]);
  });

  it('respeita os dias da semana', () => {
    // Só às sextas (dia 5): 16/10.
    const agenda = montarAgenda(
      [tarefa('a', { recorrencia: { tipo: 'semanal', dias: [5] } })],
      preferencias,
      AGORA
    );

    expect(agenda.map(item => item.id)).toEqual(['tarefa-a-2026-10-16']);
  });

  it('inclui o resumo diário com os pontos que faltam hoje', () => {
    const agenda = montarAgenda(
      [tarefa('a', { lembrete: false, concluida: true }), tarefa('b')],
      { ...preferencias, resumoDiario: true, horarioResumo: '20:00' },
      AGORA
    );

    const resumoHoje = agenda.find(item => item.id === 'resumo-2026-10-14');

    expect(resumoHoje.corpo).toBe(
      'Faltam 20 pontos para a meta. 1 tarefa por fazer.'
    );
  });

  it('não manda o resumo de hoje se a meta já foi batida', () => {
    const agenda = montarAgenda(
      [tarefa('a', { pontos: 30, concluida: true, lembrete: false })],
      { ...preferencias, resumoDiario: true },
      AGORA
    );

    expect(agenda.some(item => item.id === 'resumo-2026-10-14')).toBe(false);
    expect(agenda.some(item => item.id === 'resumo-2026-10-15')).toBe(true);
  });

  it('fica em ordem de data e dentro do limite do iOS', () => {
    const muitas = Array.from({ length: 20 }, (_, i) => tarefa(String(i)));

    const agenda = montarAgenda(muitas, preferencias, AGORA);

    expect(agenda).toHaveLength(LIMITE_NOTIFICACOES);

    agenda.slice(1).forEach((item, indice) => {
      expect(item.data >= agenda[indice].data).toBe(true);
    });
  });
});
