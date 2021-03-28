module.exports = {
  coveragePathIgnorePatterns: ['node_modules', 'src/types.ts', '__helpers__'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>'],
  setupFiles: ['<rootDir>/jest.init.js'],
  transform: {
    '\\.(js|ts|tsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/__tests__/__helpers__'],
  testRegex: '/__tests__/.*\\.(ts|tsx|js)$',
  verbose: true,
};
