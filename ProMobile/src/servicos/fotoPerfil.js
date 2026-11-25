import { File, Paths } from 'expo-file-system';

import * as ImagePicker from 'expo-image-picker';

import { fotoValida } from '../utilitarios/preferencias';

export function uriDaFotoPerfil(foto) {
  if (!fotoValida(foto)) {
    return null;
  }

  try {
    return new File(Paths.document, foto).uri;
  } catch (erro) {
    console.warn('Não foi possível localizar a foto de perfil.', erro);

    return null;
  }
}

export async function escolherFotoPerfil() {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    return { status: 'negada', podePerguntar: permissao.canAskAgain };
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (resultado.canceled || !resultado.assets?.length) {
    return { status: 'cancelada' };
  }

  const origem = new File(resultado.assets[0].uri);

  const extensao = origem.extension.replace('.', '').toLowerCase();

  const nome = `foto-perfil-${Date.now()}.${fotoValida(`foto-perfil-0.${extensao}`) ? extensao : 'jpg'}`;

  await origem.copy(new File(Paths.document, nome));

  return { status: 'escolhida', foto: nome };
}

export function apagarFotoPerfil(foto) {
  const uri = uriDaFotoPerfil(foto);

  if (!uri) {
    return;
  }

  try {
    const arquivo = new File(uri);

    if (arquivo.exists) {
      arquivo.delete();
    }
  } catch (erro) {
    console.warn('Não foi possível apagar a foto de perfil.', erro);
  }
}
