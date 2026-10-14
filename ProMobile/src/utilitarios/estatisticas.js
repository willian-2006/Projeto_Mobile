import {
  adicionarDias,
  dataDaChave,
  INICIAIS_DIAS,
  NOMES_MESES,
} from './datas';

import { calcularPorcentagem } from './pontuacao';

function indexar(historico, registroHoje) {
  const mapa = {};

  historico.forEach(registro => {
    mapa[registro.data] = registro;
  });

  mapa[registroHoje.data] = registroHoje;

  return mapa;
}

export function pontosDaSemana(historico, registroHoje) {
  const mapa = indexar(historico, registroHoje);

  return Array.from({ length: 7 }, (_, indice) => {
    const data = adicionarDias(registroHoje.data, indice - 6);

    const registro = mapa[data];

    return {
      data,
      rotulo: INICIAIS_DIAS[dataDaChave(data).getDay()],
      pontos: registro ? registro.pontos : 0,
      meta: registro ? registro.meta : 0,
      hoje: data === registroHoje.data,
    };
  });
}

export function distribuicaoPorCategoria(historico, registroHoje, dias = 7) {
  const mapa = indexar(historico, registroHoje);

  const totais = {};

  for (let indice = 0; indice < dias; indice += 1) {
    const registro = mapa[adicionarDias(registroHoje.data, -indice)];

    if (registro) {
      Object.entries(registro.porCategoria || {}).forEach(
        ([categoria, pontos]) => {
          totais[categoria] = (totais[categoria] || 0) + pontos;
        }
      );
    }
  }

  return totais;
}

export function calendarioDoMes(historico, registroHoje) {
  const mapa = indexar(historico, registroHoje);

  const hoje = dataDaChave(registroHoje.data);

  const ano = hoje.getFullYear();

  const mes = hoje.getMonth();

  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const primeiro = adicionarDias(registroHoje.data, 1 - hoje.getDate());

  const dias = Array.from({ length: totalDias }, (_, indice) => {
    const data = adicionarDias(primeiro, indice);

    const registro = data <= registroHoje.data ? mapa[data] : undefined;

    return {
      data,
      dia: indice + 1,
      porcentagem: registro
        ? calcularPorcentagem(registro.pontos, registro.meta)
        : null,
      hoje: data === registroHoje.data,
    };
  });

  return {
    titulo: `${NOMES_MESES[mes]} de ${ano}`,
    vazios: new Date(ano, mes, 1).getDay(),
    dias,
  };
}
