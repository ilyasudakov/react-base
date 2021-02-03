module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(js|jsx)?$': 'babel-jest',
  },
  //   testMatch: ["<rootDir>/src/**/>(*.)test.{js, ts, jsx, tsx}"],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/public/'],
  setupFilesAfterEnv: [
    './src/setupTests.js',
    '@testing-library/jest-dom/extend-expect',
  ],
};
