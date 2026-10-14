import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_ARMAZENAMENTO,
  CHAVE_PREFERENCIAS,
  CHAVE_TEMA,
  VERSAO_ATUAL,
  carregarDados,
  carregarPreferenciaTema,
  carregarPreferencias,
  dadosIniciais,
  limparDados,
  migrarDados,
  montarExportacao,
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
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('carregarDados', () => {
  it('usa as tarefas iniciais na primeira abertura', async () => {
    const carregados = await carregarDados();

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

    expect(await carregarDados()).toEqual(dados);
  });

  it('salva com a versão do esquema', async () => {
    await salvarDados(dados);

    const salvo = JSON.parse(await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO));

    expect(salvo).toEqual({ versao: VERSAO_ATUAL, ...dados });
  });

  it('volta às tarefas iniciais se o JSON estiver corrompido', async () => {
    const aviso = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, '{ quebrado');

    const carregados = await carregarDados();

    expect(carregados.tarefas.map(item => item.id)).toEqual(
      dadosIniciais().tarefas.map(item => item.id)
    );
    expect(aviso).toHaveBeenCalled();

    aviso.mockRestore();
  });

  it('volta às tarefas iniciais se faltar a lista de tarefas', async () => {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify({ versao: VERSAO_ATUAL, tarefas: 'x' })
    );

    expect((await carregarDados()).tarefas.length).toBeGreaterThan(0);
  });

  it('migra dados antigos ao carregar', async () => {
    await AsyncStorage.setItem(
      CHAVE_ARMAZENAMENTO,
      JSON.stringify([{ id: 7, titulo: 'Treino', categoria: 'Saúde' }])
    );

    const [migrada] = (await carregarDados()).tarefas;

    expect(migrada.id).toBe('7');
    expect(migrada.categoria).toBe('saude');
  });
});

describe('migrarDados', () => {
  it('converte a versão 0 (título com acento e id numérico)', () => {
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
          concluida: true,
          prioridade: 'media',
          horario: null,
          recorrencia: { tipo: 'diaria', dias: [] },
          lembrete: false,
          criadaEm: HOJE,
        },
      ],
      historico: [],
      ultimoDia: null,
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
      concluida: true,
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
    expect(await carregarPreferencias()).toEqual(PREFERENCIAS_PADRAO);
  });

  it('carrega o que foi salvo', async () => {
    const preferencias = { ...PREFERENCIAS_PADRAO, nome: 'Ana', meta: 80 };

    await salvarPreferencias(preferencias);

    expect(await carregarPreferencias()).toEqual(preferencias);
  });

  it('corrige valores inválidos', async () => {
    await AsyncStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ meta: -5, corAvatar: 'roxo', horarioResumo: '25:00' })
    );

    const carregadas = await carregarPreferencias();

    expect(carregadas.meta).toBe(10);
    expect(carregadas.corAvatar).toBe(PREFERENCIAS_PADRAO.corAvatar);
    expect(carregadas.horarioResumo).toBe(PREFERENCIAS_PADRAO.horarioResumo);
  });
});

describe('limparDados', () => {
  it('apaga dados e preferências, mas mantém o tema', async () => {
    await salvarDados(dados);
    await salvarPreferencias({ ...PREFERENCIAS_PADRAO, nome: 'Ana' });
    await salvarPreferenciaTema('claro');

    await limparDados();

    expect(await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)).toBeNull();
    expect(await AsyncStorage.getItem(CHAVE_PREFERENCIAS)).toBeNull();
    expect(await carregarPreferenciaTema()).toBe('claro');
  });
});

describe('montarExportacao', () => {
  it('gera um JSON com preferências, tarefas e histórico', () => {
    const exportado = JSON.parse(montarExportacao(dados, PREFERENCIAS_PADRAO));

    expect(exportado.app).toBe('WillFlow');
    expect(exportado.versao).toBe(VERSAO_ATUAL);
    expect(exportado.tarefas).toEqual(dados.tarefas);
    expect(exportado.historico).toEqual(dados.historico);
    expect(exportado.preferencias).toEqual(PREFERENCIAS_PADRAO);
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
