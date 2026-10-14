// "1 ponto", "2 pontos". O plural padrão é o singular + "s".
export function contar(quantidade, singular, plural = `${singular}s`) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}
