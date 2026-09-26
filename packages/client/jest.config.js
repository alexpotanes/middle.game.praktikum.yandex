import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@warchest/shared$': '<rootDir>/../shared/src/index.ts',
  },
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
    __EXTERNAL_SERVER_URL__: 'http://localhost:3000',
    __INTERNAL_SERVER_URL__: 'http://server:3001',
    __TEAM_NAME__: 'warchest-team-12345',
  },
}
