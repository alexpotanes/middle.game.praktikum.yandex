module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // *.integration.test.ts - смоук-тесты реальных миграций на настоящем
  // Postgres, запускаются отдельно через `yarn test:integration`
  // (см. jest.integration.config.js) и не должны попадать в обычный `yarn test`,
  // у которого нет living Postgres рядом.
  testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.test\\.ts$'],
}
