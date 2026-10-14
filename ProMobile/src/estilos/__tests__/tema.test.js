import { ESQUEMAS, montarTema } from '../tema';

import { CATEGORIAS } from '../../dados/categorias';

import { comporCor, razaoContraste } from '../../utilitarios/contraste';

// WCAG AA: 4.5:1 para texto normal; 3:1 para texto grande e ícones.
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
    });
  });
});

describe.each(ESQUEMAS)('contraste AA no tema %s', esquema => {
  const { cores, categorias } = montarTema(esquema);

  // Fundos reais onde aparece texto (o vidro é composto sobre o fundo).
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
