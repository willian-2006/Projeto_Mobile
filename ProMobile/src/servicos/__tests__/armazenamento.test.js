import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_ARMAZENAMENTO,
  CHAVE_TEMA,
  VERSAO_ATUAL,
  carregarDados,
  carregarPreferenciaTema,
  migrarDados,
  salvarDados,
  salvarPreferenciaTema,
} from '../armazenamento';

import { tarefasIniciais } from '../../dados/tarefas';

const tarefa = {
  id: 'x1',
  titulo: 'Fazer treino',
  categoria: 'saude',
  pontos: 20,
  concluida: true,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('carregarDados', () => {
  it('usa as tarefas iniciais na primeira abertura', async () => {
    expect(await carregarDados()).toEqual(tarefasIniciais);
  });

  it('carrega o que foi salvo', async () => {
    await salvarDados([tarefa]);

    expect(await carregarDados()).toEqual([tarefa]);
  });

  it('salva com a versão do esquema', async () => {
    await salvarDados([tarefa]);

    const salvo = JSON.parse(await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO));

    expect(salvo).toEqual({ versao: VERSAO_ATUAL, tarefas: [tarefa] });
  });

  it('volta às tarefas iniciais se o JSON estiver corrompido', async () => {
    const aviso = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, '{ quebrado');

    expect(await carregarDados()).toEqual(tarefasIniciais);
    expect(aviso).toHaveBeenCalled();

    aviso.mockRestore();
  });

  it('migra dados antigos ao carregar', async () => {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify([{ ...tarefa, id: 7, categoria: 'Saúde' }])
    );

    expect(await carregarDados()).toEqual([{ ...tarefa, id: '7' }]);
  });
});

describe('migrarDados', () => {
  it('converte o formato antigo (título com acento e id numérico)', () => {
    const antigas = [
      {
        id: 1,
        titulo: 'Água',
        categoria: 'Saúde',
        pontos: 10,
        concluida: false,
      },
      {
        id: 2,
        titulo: 'Orar',
        categoria: 'Devocional',
        pontos: 10,
        concluida: true,
      },
    ];

    expect(migrarDados(antigas)).toEqual([
      {
        id: '1',
        titulo: 'Água',
        categoria: 'saude',
        pontos: 10,
        concluida: false,
      },
      {
        id: '2',
        titulo: 'Orar',
        categoria: 'devocional',
        pontos: 10,
        concluida: true,
      },
    ]);
  });

  it('mantém categoria desconhecida como está', () => {
    expect(migrarDados([{ ...tarefa, categoria: 'Lazer' }])[0].categoria).toBe(
      'Lazer'
    );
  });

  it('não altera dados já na versão atual', () => {
    expect(migrarDados({ versao: VERSAO_ATUAL, tarefas: [tarefa] })).toEqual([
      tarefa,
    ]);
  });
});

describe('preferência de tema', () => {
  it('usa "sistema" quando nada foi salvo', async () => {
    expect(await carregarPreferenciaTema()).toBe('sistema');
  });

  it('carrega a preferência salva', async () => {
    await salvarPreferenciaTema('claro');

    expect(await carregarPreferenciaTema()).toBe('claro');
  });

  it('ignora valor inválido', async () => {
    await AsyncStorage.setItem(CHAVE_TEMA, 'roxo');

    expect(await carregarPreferenciaTema()).toBe('sistema');
  });
});
