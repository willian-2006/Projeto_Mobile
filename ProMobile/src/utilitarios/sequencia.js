import { adicionarDias } from './datas';

export function metaBatida(registro) {
  return registro.meta > 0 && registro.pontos >= registro.meta;
}

export function calcularSequencia(historico, hoje, metaBatidaHoje) {
  const diasBatidos = new Set(
    historico.filter(metaBatida).map(registro => registro.data)
  );

  if (metaBatidaHoje) {
    diasBatidos.add(hoje);
  }

  let atual = 0;

  let dia = metaBatidaHoje ? hoje : adicionarDias(hoje, -1);

  while (diasBatidos.has(dia)) {
    atual += 1;
    dia = adicionarDias(dia, -1);
  }

  let recorde = 0;

  let corrente = 0;

  let anterior = null;

  [...diasBatidos].sort().forEach(data => {
    corrente =
      anterior !== null && adicionarDias(anterior, 1) === data
        ? corrente + 1
        : 1;

    recorde = Math.max(recorde, corrente);

    anterior = data;
  });

  return { atual, recorde: Math.max(recorde, atual) };
}
