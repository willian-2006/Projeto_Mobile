import { contar } from '../textos';

describe('contar', () => {
  it('usa o singular só para 1', () => {
    expect(contar(1, 'ponto')).toBe('1 ponto');
    expect(contar(0, 'ponto')).toBe('0 pontos');
    expect(contar(5, 'ponto')).toBe('5 pontos');
  });

  it('aceita um plural irregular', () => {
    expect(contar(1, 'tarefa concluída', 'tarefas concluídas')).toBe(
      '1 tarefa concluída'
    );
    expect(contar(3, 'concluída', 'concluídas')).toBe('3 concluídas');
  });
});
