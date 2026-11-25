import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_ARMAZENAMENTO,
  CHAVE_PREFERENCIAS,
  CHAVE_RECUPERACAO,
  CHAVE_TEMA,
  VERSAO_ATUAL,
  carregarDados,
  carregarPreferenciaTema,
  carregarPreferencias,
  dadosIniciais,
  limparDados,
  migrarDados,
  salvarDados,
  salvarPreferenciaTema,
  salvarPreferencias,
} from '../armazenamento';

import { PREFERENCIAS_PADRAO } from '../../dados/preferencias';

const HOJE = '2026-10-14';

const tarefa = {
  id: 'x1',
  titulo: 'Fazer treino',
  categoria: 'saude',
  pontos: 20,
  concluida: true,
  prioridade: 'alta',
  horario: '07:30',
  recorrencia: { tipo: 'semanal', dias: [1, 3, 5] },
  lembrete: true,
  criadaEm: '2026-10-01',
};

const dados = {
  tarefas: [tarefa],
  historico: [
    {
      data: '2026-10-13',
      pontos: 40,
      meta: 50,
      concluidas: 3,
      total: 5,
      porCategoria: { saude: 40 },
    },
  ],
  ultimoDia: '2026-10-13',
  recorde: 3,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('carregarDados', () => {
  it('usa as tarefas iniciais na primeira abertura', async () => {
    const { dados: carregados, podeSalvar } = await carregarDados();

    expect(podeSalvar).toBe(true);
    expect(carregados.historico).toEqual([]);
    expect(carregados.ultimoDia).toBeNull();
    expect(carregados.tarefas.length).toBeGreaterThan(0);
    expect(carregados.tarefas[0].recorrencia).toEqual({
      tipo: 'diaria',
      dias: [],
    });
  });

  it('carrega o que foi salvo', async () => {
    await salvarDados(dados);

    expect(await carregarDados()).toEqual({ dados, podeSalvar: true });
  });

  it('salva com a versão do esquema', async () => {
    await salvarDados(dados);

    const salvo = JSON.parse(await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO));

    expect(salvo).toEqual({ versao: VERSAO_ATUAL, ...dados });
  });

  it('com JSON corrompido, guarda uma cópia e volta às tarefas iniciais', async () => {
    const aviso = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, '{ quebrado');

    const { dados: carregados, podeSalvar } = await carregarDados();

    expect(carregados.tarefas.map(item => item.id)).toEqual(
      dadosIniciais().tarefas.map(item => item.id)
    );
    expect(podeSalvar).toBe(true);
    expect(await AsyncStorage.getItem(CHAVE_RECUPERACAO)).toBe('{ quebrado');
    expect(aviso).toHaveBeenCalled();

    aviso.mockRestore();
  });

  it('volta às tarefas iniciais se faltar a lista de tarefas', async () => {
    const texto = JSON.stringify({ versao: VERSAO_ATUAL, tarefas: 'x' });

    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, texto);

    const { dados: carregados } = await carregarDados();

    expect(carregados.tarefas.length).toBeGreaterThan(0);
    expect(await AsyncStorage.getItem(CHAVE_RECUPERACAO)).toBe(texto);
  });

  it('se a leitura falhar, não permite salvar por cima', async () => {
    const aviso = jest.spyOn(console, 'warn').mockImplementation(() => {});

    AsyncStorage.getItem.mockRejectedValueOnce(new Error('falha de leitura'));

    const { dados: carregados, podeSalvar } = await carregarDados();

    expect(podeSalvar).toBe(false);
    expect(carregados.tarefas.length).toBeGreaterThan(0);

    aviso.mockRestore();
  });

  it('descarta só os itens inválidos, sem perder o resto', async () => {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify({
        versao: VERSAO_ATUAL,
        tarefas: [
          tarefa,
          null,
          'texto',
          { ...tarefa, id: 'x2', recorrencia: { tipo: 'semanal', dias: 5 } },
        ],
        historico: [dados.historico[0], null, { pontos: 3 }],
        ultimoDia: '2026-10-13',
      })
    );

    const { dados: carregados } = await carregarDados();

    expect(carregados.tarefas.map(item => item.id)).toEqual(['x1', 'x2']);
    expect(carregados.tarefas[1].recorrencia).toEqual({
      tipo: 'diaria',
      dias: [],
    });
    expect(carregados.historico).toEqual([dados.historico[0]]);
  });

  it('migra dados antigos ao carregar', async () => {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify([{ id: 7, titulo: 'Treino', categoria: 'Saúde' }])
    );

    const [migrada] = (await carregarDados()).dados.tarefas;

    expect(migrada.id).toBe('7');
    expect(migrada.categoria).toBe('saude');
  });
});

describe('migrarDados', () => {
  it('converte a versão 0 (acentos, id numérico, tarefas reabertas)', () => {
    const antigas = [
      { id: 1, titulo: 'Água', categoria: 'Saúde', pontos: 10 },
      {
        id: 2,
        titulo: 'Orar',
        categoria: 'Devocional',
        pontos: 15,
        concluida: true,
      },
    ];

    expect(migrarDados(antigas, HOJE)).toEqual({
      tarefas: [
        {
          id: '1',
          titulo: 'Água',
          categoria: 'saude',
          pontos: 10,
          concluida: false,
          prioridade: 'media',
          horario: null,
          recorrencia: { tipo: 'diaria', dias: [] },
          lembrete: false,
          criadaEm: HOJE,
        },
        {
          id: '2',
          titulo: 'Orar',
          categoria: 'devocional',
          pontos: 15,
          concluida: false,
          prioridade: 'media',
          horario: null,
          recorrencia: { tipo: 'diaria', dias: [] },
          lembrete: false,
          criadaEm: HOJE,
        },
      ],
      historico: [],
      ultimoDia: null,
      recorde: 0,
    });
  });

  it('converte a versão 1 (tarefas viram diárias, sem histórico)', () => {
    const v1 = {
      versao: 1,
      tarefas: [
        {
          id: 'a',
          titulo: 'Ler',
          categoria: 'estudos',
          pontos: 20,
          concluida: true,
        },
      ],
    };

    const migrado = migrarDados(v1, HOJE);

    expect(migrado.tarefas[0]).toMatchObject({
      id: 'a',
      pontos: 20,
      concluida: false,
      recorrencia: { tipo: 'diaria', dias: [] },
      criadaEm: HOJE,
    });
    expect(migrado.historico).toEqual([]);
    expect(migrado.ultimoDia).toBeNull();
  });

  it('mantém categoria desconhecida como está', () => {
    expect(
      migrarDados([{ ...tarefa, categoria: 'Lazer' }], HOJE).tarefas[0]
        .categoria
    ).toBe('Lazer');
  });

  it('não altera dados já na versão atual', () => {
    expect(migrarDados({ versao: VERSAO_ATUAL, ...dados }, HOJE)).toEqual(
      dados
    );
  });

  it('devolve null quando não há lista de tarefas', () => {
    expect(migrarDados({ versao: VERSAO_ATUAL }, HOJE)).toBeNull();
  });
});

describe('preferências', () => {
  it('usa os valores padrão quando nada foi salvo', async () => {
    expect(await carregarPreferencias()).toEqual({
      preferencias: PREFERENCIAS_PADRAO,
      podeSalvar: true,
    });
  });

  it('carrega o que foi salvo', async () => {
    const preferencias = { ...PREFERENCIAS_PADRAO, nome: 'Ana', meta: 80 };

    await salvarPreferencias(preferencias);

    expect(await carregarPreferencias()).toEqual({
      preferencias,
      podeSalvar: true,
    });
  });

  it('se a leitura falhar, não permite salvar por cima', async () => {
    const aviso = jest.spyOn(console, 'warn').mockImplementation(() => {});

    AsyncStorage.getItem.mockRejectedValueOnce(new Error('falha de leitura'));

    expect((await carregarPreferencias()).podeSalvar).toBe(false);

    aviso.mockRestore();
  });

  it('corrige valores inválidos', async () => {
    await AsyncStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ meta: -5, corAvatar: 'roxo', horarioResumo: '25:00' })
    );

    const { preferencias: carregadas } = await carregarPreferencias();

    expect(carregadas.meta).toBe(10);
    expect(carregadas.corAvatar).toBe(PREFERENCIAS_PADRAO.corAvatar);
    expect(carregadas.horarioResumo).toBe(PREFERENCIAS_PADRAO.horarioResumo);
  });
});

describe('limparDados', () => {
  it('apaga dados, preferências, tema e cópia de recuperação', async () => {
    await salvarDados(dados);
    await salvarPreferencias({ ...PREFERENCIAS_PADRAO, nome: 'Ana' });
    await salvarPreferenciaTema('claro');
    await AsyncStorage.setItem(CHAVE_RECUPERACAO, 'x');

    await limparDados();

    expect(await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)).toBeNull();
    expect(await AsyncStorage.getItem(CHAVE_PREFERENCIAS)).toBeNull();
    expect(await AsyncStorage.getItem(CHAVE_RECUPERACAO)).toBeNull();
    expect(await carregarPreferenciaTema()).toBe('sistema');
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
