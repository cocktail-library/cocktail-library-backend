import { db as dbConfig } from './config'

const config = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
}

module.exports = config
