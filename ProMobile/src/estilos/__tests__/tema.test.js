import { ESQUEMAS, coresDaCategoria, montarTema } from '../tema';

import { CATEGORIAS, PALETAS_CATEGORIA } from '../../dados/categorias';

import { comporCor, razaoContraste } from '../../utilitarios/contraste';

const AA_TEXTO = 4.5;
const AA_GRANDE = 3;

describe('montarTema', () => {
  it('os dois temas têm as mesmas chaves de cor', () => {
    const escuro = montarTema('escuro').cores;
    const claro = montarTema('claro').cores;

    expect(Object.keys(claro).sort()).toEqual(Object.keys(escuro).sort());
  });

  it('usa o tema escuro para esquema desconhecido', () => {
    expect(montarTema('outro').esquema).toBe('escuro');
    expect(montarTema(undefined).escuro).toBe(true);
  });

  it.each(ESQUEMAS)('tema %s tem cores para todas as categorias', esquema => {
    const tema = montarTema(esquema);

    CATEGORIAS.forEach(categoria => {
      const cores = tema.categorias[categoria.chave];

      expect(cores.cor).toBeDefined();
      expect(cores.corSuave).toBeDefined();
      expect(cores.gradiente).toHaveLength(2);
      expect(tema.paletasCategoria[categoria.paleta]).toBe(cores);
    });
  });

  it.each(ESQUEMAS)('tema %s tem todas as paletas selecionáveis', esquema => {
    const tema = montarTema(esquema);

    PALETAS_CATEGORIA.forEach(paleta => {
      const cores = tema.paletasCategoria[paleta.chave];

      expect(cores.cor).toBeDefined();
      expect(cores.corSuave).toBeDefined();
      expect(cores.gradiente).toHaveLength(2);
    });
  });

  it('coresDaCategoria usa a paleta e cai no índigo se faltar', () => {
    const tema = montarTema('escuro');

    expect(coresDaCategoria(tema, { paleta: 'coral' })).toBe(
      tema.paletasCategoria.coral
    );
    expect(coresDaCategoria(tema, undefined)).toBe(
      tema.paletasCategoria.indigo
    );
  });
});

describe.each(ESQUEMAS)('contraste AA no tema %s', esquema => {
  const { cores, paletasCategoria: categorias } = montarTema(esquema);

  const fundos = {
    fundo: cores.fundo,
    superficie: cores.superficie,
    superficieElevada: cores.superficieElevada,
    vidro: comporCor(cores.superficieVidro, cores.fundo),
  };

  const textos = {
    texto: cores.texto,
    textoSecundario: cores.textoSecundario,
    principal: cores.principal,
    sucesso: cores.sucesso,
    alerta: cores.alerta,
    erro: cores.erro,
  };

  Object.entries(textos).forEach(([nomeTexto, corTexto]) => {
    Object.entries(fundos).forEach(([nomeFundo, corFundo]) => {
      it(`${nomeTexto} sobre ${nomeFundo}`, () => {
        expect(razaoContraste(corTexto, corFundo)).toBeGreaterThanOrEqual(
          AA_TEXTO
        );
      });
    });
  });

  it('textoTerciario (ícones e textos grandes) sobre fundo e superfícies', () => {
    Object.values(fundos).forEach(corFundo => {
      expect(
        razaoContraste(cores.textoTerciario, corFundo)
      ).toBeGreaterThanOrEqual(AA_GRANDE);
    });
  });

  it('principal sobre o fundo suave da aba ativa', () => {
    const fundoAtivo = comporCor(
      cores.principalSuave,
      comporCor(cores.superficieVidro, cores.fundo)
    );

    expect(razaoContraste(cores.principal, fundoAtivo)).toBeGreaterThanOrEqual(
      AA_TEXTO
    );
  });

  const basesEsmaecidas = {
    fundo: cores.fundo,
    superficie: cores.superficie,
    vidro: comporCor(cores.superficieVidro, cores.fundo),
  };

  Object.entries(basesEsmaecidas).forEach(([nomeBase, corBase]) => {
    it(`principal sobre principalSuave (base: ${nomeBase})`, () => {
      const fundoSuave = comporCor(cores.principalSuave, corBase);

      expect(
        razaoContraste(cores.principal, fundoSuave)
      ).toBeGreaterThanOrEqual(AA_TEXTO);
    });

    it(`cor de cada categoria sobre corSuave (base: ${nomeBase})`, () => {
      Object.values(categorias).forEach(categoria => {
        const fundoSuave = comporCor(categoria.corSuave, corBase);

        expect(
          razaoContraste(categoria.cor, fundoSuave)
        ).toBeGreaterThanOrEqual(AA_TEXTO);
      });
    });
  });

  it('alerta (prioridade alta e sequência) sobre o fundo esmaecido', () => {
    const fundoSuave = comporCor(cores.principalSuave, cores.fundo);

    expect(razaoContraste(cores.alerta, fundoSuave)).toBeGreaterThanOrEqual(
      AA_TEXTO
    );
  });

  it('texto do botão da tela de erro (fundo sobre principal)', () => {
    expect(razaoContraste(cores.fundo, cores.principal)).toBeGreaterThanOrEqual(
      AA_TEXTO
    );
  });

  it('ícones e letras sobre os gradientes', () => {
    const gradientes = [
      cores.gradientePrincipal,
      ...Object.values(categorias).map(categoria => categoria.gradiente),
    ];

    gradientes.flat().forEach(corGradiente => {
      expect(
        razaoContraste(cores.textoSobreDestaque, corGradiente)
      ).toBeGreaterThanOrEqual(AA_GRANDE);
    });
  });

  Object.entries(categorias).forEach(([chave, categoria]) => {
    it(`cor de ${chave} como texto`, () => {
      Object.values(fundos).forEach(corFundo => {
        expect(razaoContraste(categoria.cor, corFundo)).toBeGreaterThanOrEqual(
          AA_TEXTO
        );
      });

      const fundoSuave = comporCor(categoria.corSuave, cores.superficie);

      expect(razaoContraste(categoria.cor, fundoSuave)).toBeGreaterThanOrEqual(
        AA_TEXTO
      );
    });
  });
});
