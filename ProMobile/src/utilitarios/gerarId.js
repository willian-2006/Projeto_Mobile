let contador = 0;

// Combina horário, contador e trecho aleatório: dois ids
// gerados no mesmo milissegundo nunca se repetem.
export function gerarId() {
  contador = (contador + 1) % 1679616;

  const tempo = Date.now().toString(36);
  const sequencia = contador.toString(36).padStart(4, '0');
  const aleatorio = Math.random().toString(36).slice(2, 8);

  return `${tempo}-${sequencia}-${aleatorio}`;
}
