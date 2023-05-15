// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Umzug, SequelizeStorage } = require('umzug')
import { sequelize } from '../db-connection'
import { logger } from './logger'

const migrationRunner = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    params: [
      sequelize.getQueryInterface()
    ]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger,
})

async function applyMigrations() {
  try {
    await migrationRunner.up()
    logger.info('Migrations successfully applied')
  } catch (e) {
    logger.fatal('Migrations failed', e)
  }
}

export { applyMigrations }
