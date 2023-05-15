import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { iocContainer } from '../ioc-container'
import { CocktailsController } from './cocktails.controller'
import { TYPES } from '../ioc-types'

const cocktailRouter = Router()
const cocktailsController = iocContainer.get<CocktailsController>(TYPES.CocktailsController)

cocktailRouter.get('/', wrap(cocktailsController.listAll))
cocktailRouter.get('/:taskStrId', wrap(cocktailsController.get))
cocktailRouter.post('/', wrap(cocktailsController.create))
cocktailRouter.put('/:taskStrId', wrap(cocktailsController.update))
cocktailRouter.delete('/:taskStrId', wrap(cocktailsController.delete))

export { cocktailRouter }
