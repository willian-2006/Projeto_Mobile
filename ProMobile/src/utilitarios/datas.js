// Os dias são guardados como texto 'AAAA-MM-DD' no horário local
// do aparelho: comparar e ordenar vira comparação de texto.

function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

export function chaveDia(data = new Date()) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(
    data.getDate()
  )}`;
}

// Meio-dia evita erros perto da meia-noite em mudanças de horário de verão.
export function dataDaChave(chave) {
  const [ano, mes, dia] = chave.split('-').map(Number);

  return new Date(ano, mes - 1, dia, 12);
}

export function adicionarDias(chave, dias) {
  const data = dataDaChave(chave);

  data.setDate(data.getDate() + dias);

  return chaveDia(data);
}

// 0 = domingo ... 6 = sábado (igual a Date#getDay).
export function diaDaSemana(chave) {
  return dataDaChave(chave).getDay();
}

export const NOMES_DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const INICIAIS_DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

// Horário no formato 'HH:MM'.
export function horarioValido(horario) {
  if (typeof horario !== 'string' || !/^\d{2}:\d{2}$/.test(horario)) {
    return false;
  }

  const [horas, minutos] = horario.split(':').map(Number);

  return horas < 24 && minutos < 60;
}

export function horarioDaData(data) {
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

// Data (objeto Date) do dia `chave` no horário 'HH:MM'.
export function dataComHorario(chave, horario) {
  const [ano, mes, dia] = chave.split('-').map(Number);

  const [horas, minutos] = horario.split(':').map(Number);

  return new Date(ano, mes - 1, dia, horas, minutos);
}

// Milissegundos até a próxima meia-noite (mínimo de 1 segundo).
export function msAteMeiaNoite(agora = new Date()) {
  const meiaNoite = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate() + 1
  );

  return Math.max(meiaNoite.getTime() - agora.getTime(), 1000);
}
