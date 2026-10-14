import {
  calcularPontosMaximos,
  calcularPontosAtuais,
  contarConcluidas,
  calcularPorcentagem,
} from '../pontuacao';

const tarefas = [
  { id: 'a', pontos: 10, concluida: true },
  { id: 'b', pontos: 20, concluida: false },
  { id: 'c', pontos: 15, concluida: true },
];

describe('calcularPontosMaximos', () => {
  it('soma os pontos de todas as tarefas', () => {
    expect(calcularPontosMaximos(tarefas)).toBe(45);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calcularPontosMaximos([])).toBe(0);
  });
});

describe('calcularPontosAtuais', () => {
  it('soma só as tarefas concluídas', () => {
    expect(calcularPontosAtuais(tarefas)).toBe(25);
  });

  it('retorna 0 quando nenhuma está concluída', () => {
    const pendentes = tarefas.map(tarefa => ({
      ...tarefa,
      concluida: false,
    }));

    expect(calcularPontosAtuais(pendentes)).toBe(0);
  });
});

describe('contarConcluidas', () => {
  it('conta as tarefas concluídas', () => {
    expect(contarConcluidas(tarefas)).toBe(2);
    expect(contarConcluidas([])).toBe(0);
  });
});

describe('calcularPorcentagem', () => {
  it('arredonda a porcentagem', () => {
    expect(calcularPorcentagem(25, 45)).toBe(56);
  });

  it('retorna 100 quando tudo está concluído', () => {
    expect(calcularPorcentagem(45, 45)).toBe(100);
  });

  it('nunca passa de 100', () => {
    expect(calcularPorcentagem(60, 45)).toBe(100);
  });

  it('retorna 0 sem pontos possíveis (lista vazia)', () => {
    expect(calcularPorcentagem(0, 0)).toBe(0);
  });
});
