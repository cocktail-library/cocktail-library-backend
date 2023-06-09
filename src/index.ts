import express from 'express'
import { applyMigrations } from './utils/apply-migrations'
import { logger } from './utils/logger'
import { app as appConfig } from './config'
import bodyParser from 'body-parser'

import { tagRouter } from './tags/tags.routes'
import { cocktailRouter } from './cocktails/cocktails.routes'
import { reviewRouter } from './reviews/reviews.routes'
import { ingredientRouter } from './ingredients/ingredients.routes'

const app = express()

app.use(bodyParser.json())

app.get('/ping', (_, res) => res.send('pong'))

app.use('/api/tags', tagRouter)
app.use('/api/cocktails', cocktailRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/ingredients', ingredientRouter)

applyMigrations().then(() => {
  app.listen(appConfig.port, () => {
    logger.info(`App listening on port ${appConfig.port}`)
  })
})
