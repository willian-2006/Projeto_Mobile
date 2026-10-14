import {
  adicionarDias,
  chaveDia,
  dataComHorario,
  dataDaChave,
  diaDaSemana,
  horarioDaData,
  horarioValido,
  msAteMeiaNoite,
} from '../datas';

describe('chaveDia e dataDaChave', () => {
  it('formata a data local como AAAA-MM-DD', () => {
    expect(chaveDia(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('ida e volta mantém o dia', () => {
    expect(chaveDia(dataDaChave('2026-10-14'))).toBe('2026-10-14');
  });
});

describe('adicionarDias', () => {
  it('soma e subtrai atravessando meses e anos', () => {
    expect(adicionarDias('2026-10-31', 1)).toBe('2026-11-01');
    expect(adicionarDias('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('respeita ano bissexto', () => {
    expect(adicionarDias('2028-02-28', 1)).toBe('2028-02-29');
    expect(adicionarDias('2026-02-28', 1)).toBe('2026-03-01');
  });
});

describe('diaDaSemana', () => {
  it('usa 0 para domingo', () => {
    expect(diaDaSemana('2026-10-11')).toBe(0);
    expect(diaDaSemana('2026-10-14')).toBe(3);
  });
});

describe('horários', () => {
  it('valida o formato HH:MM', () => {
    expect(horarioValido('07:30')).toBe(true);
    expect(horarioValido('23:59')).toBe(true);
    expect(horarioValido('24:00')).toBe(false);
    expect(horarioValido('7:30')).toBe(false);
    expect(horarioValido(null)).toBe(false);
  });

  it('extrai o horário de uma data', () => {
    expect(horarioDaData(new Date(2026, 0, 1, 7, 5))).toBe('07:05');
  });

  it('monta a data de um dia num horário', () => {
    expect(dataComHorario('2026-10-14', '08:15')).toEqual(
      new Date(2026, 9, 14, 8, 15)
    );
  });
});

describe('msAteMeiaNoite', () => {
  it('conta até o início do dia seguinte', () => {
    expect(msAteMeiaNoite(new Date(2026, 9, 14, 23, 0))).toBe(60 * 60 * 1000);
  });

  it('nunca devolve menos de 1 segundo', () => {
    expect(msAteMeiaNoite(new Date(2026, 9, 14, 23, 59, 59, 900))).toBe(1000);
  });
});
