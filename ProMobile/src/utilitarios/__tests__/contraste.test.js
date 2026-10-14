import { comporCor, razaoContraste } from '../contraste';

describe('razaoContraste', () => {
  it('preto e branco dão 21:1', () => {
    expect(razaoContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('cores iguais dão 1:1', () => {
    expect(razaoContraste('#22D3EE', '#22D3EE')).toBeCloseTo(1, 5);
  });

  it('aceita hex curto e independe da ordem', () => {
    expect(razaoContraste('#fff', '#767676')).toBeCloseTo(
      razaoContraste('#767676', '#FFFFFF'),
      5
    );
  });
});

describe('comporCor', () => {
  it('cor opaca não mistura com o fundo', () => {
    expect(comporCor('rgba(255, 0, 0, 1)', '#000000')).toBe('#ff0000');
  });

  it('meia transparência fica no meio', () => {
    expect(comporCor('rgba(255, 255, 255, 0.5)', '#000000')).toBe('#808080');
  });
});
