import { Share } from 'react-native';

import { File, Paths } from 'expo-file-system';

import * as Sharing from 'expo-sharing';

import {
  montarTextoExportacao,
  nomeArquivoExportacao,
  TIPO_MIME_EXPORTACAO,
  UTI_EXPORTACAO,
} from '../utilitarios/exportacao';

export async function exportarDadosTxt(dados, preferencias) {
  const agora = new Date();

  const texto = montarTextoExportacao(dados, preferencias, agora);

  const nome = nomeArquivoExportacao(agora);

  const arquivo = new File(Paths.cache, nome);

  if (arquivo.exists) {
    arquivo.delete();
  }

  arquivo.create();

  await arquivo.write(texto);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri, {
      mimeType: TIPO_MIME_EXPORTACAO,
      UTI: UTI_EXPORTACAO,
      dialogTitle: 'Exportar dados do WillFlow (.txt)',
    });

    return { nome, modo: 'arquivo' };
  }

  await Share.share({ title: nome, message: texto });

  return { nome, modo: 'texto' };
}
