/* eslint-disable @typescript-eslint/no-var-requires -- Конфигурация sequelize-cli в CommonJS. */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const config = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  logging: false,
}

module.exports = { development: config, test: config, production: config }
