module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.integration.test.ts'],
  setupFiles: ['<rootDir>/jest.integration.setup.js'],
  testTimeout: 30000,
}
