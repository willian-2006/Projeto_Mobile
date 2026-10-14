function lerCor(cor) {
  const texto = cor.trim();

  if (texto.startsWith('#')) {
    let hex = texto.slice(1);

    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(caractere => caractere + caractere)
        .join('');
    }

    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  const partes = texto.match(/rgba?\(([^)]+)\)/);

  if (!partes) {
    throw new Error(`Cor não suportada: ${cor}`);
  }

  const [r, g, b, a = 1] = partes[1].split(',').map(Number);

  return { r, g, b, a };
}

export function comporCor(cor, fundo) {
  const frente = lerCor(cor);
  const atras = lerCor(fundo);

  const misturar = (canalFrente, canalAtras) =>
    Math.round(canalFrente * frente.a + canalAtras * (1 - frente.a));

  const paraHex = valor => valor.toString(16).padStart(2, '0');

  return `#${paraHex(misturar(frente.r, atras.r))}${paraHex(
    misturar(frente.g, atras.g)
  )}${paraHex(misturar(frente.b, atras.b))}`;
}

function luminancia(cor) {
  const { r, g, b } = lerCor(cor);

  const [lr, lg, lb] = [r, g, b].map(canal => {
    const valor = canal / 255;

    return valor <= 0.03928
      ? valor / 12.92
      : Math.pow((valor + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function razaoContraste(cor1, cor2) {
  const l1 = luminancia(cor1);
  const l2 = luminancia(cor2);

  const clara = Math.max(l1, l2);
  const escura = Math.min(l1, l2);

  return (clara + 0.05) / (escura + 0.05);
}
