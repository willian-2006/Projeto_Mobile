import { gerarId } from '../gerarId';

describe('gerarId', () => {
  it('retorna uma string não vazia', () => {
    const id = gerarId();

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('não repete ids gerados no mesmo milissegundo', () => {
    const agora = jest.spyOn(Date, 'now').mockReturnValue(1700000000000);

    const ids = new Set();

    for (let i = 0; i < 10000; i++) {
      ids.add(gerarId());
    }

    agora.mockRestore();

    expect(ids.size).toBe(10000);
  });
});
