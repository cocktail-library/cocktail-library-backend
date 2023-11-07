import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { iocContainer } from '../ioc-container'
import { CocktailsController } from './cocktails.controller'
import { TYPES } from '../ioc-types'

const cocktailRouter = Router()
const cocktailsController = iocContainer.get<CocktailsController>(TYPES.CocktailsController)

cocktailRouter.get('/', wrap(cocktailsController.listAll))
cocktailRouter.get('/:cocktailStrId', wrap(cocktailsController.get))
cocktailRouter.get('/by-slug/:cocktailSlug', wrap(cocktailsController.getBySlug))
cocktailRouter.post('/', wrap(cocktailsController.create))
cocktailRouter.put('/:cocktailStrId', wrap(cocktailsController.update))
cocktailRouter.delete('/:cocktailStrId', wrap(cocktailsController.delete))

export { cocktailRouter }
