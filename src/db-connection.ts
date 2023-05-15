import { Options, Sequelize } from 'sequelize'
import { db as dbConfig } from './config'

const connectionOptions = {
  ...dbConfig,
  logging: false,
} as Options

const sequelize = new Sequelize(connectionOptions)

export { sequelize }
