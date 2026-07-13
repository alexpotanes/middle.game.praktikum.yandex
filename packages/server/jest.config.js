module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    __EXTERNAL_SERVER_URL__: 'http://localhost:3000',
    __INTERNAL_SERVER_URL__: 'http://server:3001',
  },
}
