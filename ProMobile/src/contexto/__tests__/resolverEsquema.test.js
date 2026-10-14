import { resolverEsquema } from '../TemaContexto';

describe('resolverEsquema', () => {
  it('respeita a escolha manual', () => {
    expect(resolverEsquema('claro', 'dark')).toBe('claro');
    expect(resolverEsquema('escuro', 'light')).toBe('escuro');
  });

  it('segue o sistema na preferência "sistema"', () => {
    expect(resolverEsquema('sistema', 'light')).toBe('claro');
    expect(resolverEsquema('sistema', 'dark')).toBe('escuro');
  });

  it('usa escuro quando o sistema não informa', () => {
    expect(resolverEsquema('sistema', null)).toBe('escuro');
    expect(resolverEsquema('sistema', undefined)).toBe('escuro');
  });
});
