import 'reflect-metadata'
import { Sequelize } from 'sequelize-typescript'
import { dbEnv } from './env'
import { Topic } from '../models/Topic'
import { Comment } from '../models/Comment'
import { Reaction } from '../models/Reaction'

const isTest = process.env.NODE_ENV === 'test'
const models = [Topic, Comment, Reaction]

export const sequelize = isTest
  ? new Sequelize('sqlite::memory:', { logging: false, models })
  : new Sequelize(dbEnv.database, dbEnv.username, dbEnv.password, {
      host: dbEnv.host,
      port: dbEnv.port,
      dialect: 'postgres',
      logging: false,
      models,
    })
