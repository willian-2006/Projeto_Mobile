export function contar(quantidade, singular, plural = `${singular}s`) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}
