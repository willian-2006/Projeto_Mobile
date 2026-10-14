// O AsyncStorage é um módulo nativo: nos testes usamos o mock oficial.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
