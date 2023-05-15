import bunyan from 'bunyan'

import { app as appConfig } from '../config'

const logger = bunyan.createLogger({ name: appConfig.name })

export { logger }

