/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '../../.env' })

const base = {
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  dialect: 'postgres',
}

module.exports = {
  development: base,
  test: base,
  production: base,
}
