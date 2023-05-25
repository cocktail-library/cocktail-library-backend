import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { iocContainer } from '../ioc-container'
import { IngredientsController } from './ingredients.controller'
import { TYPES } from '../ioc-types'

const ingredientRouter = Router()
const ingredientsController = iocContainer.get<IngredientsController>(TYPES.IngredientsController)

ingredientRouter.get('/', wrap(ingredientsController.listAll))
ingredientRouter.get('/:ingredientId', wrap(ingredientsController.get))
ingredientRouter.post('/', wrap(ingredientsController.create))
ingredientRouter.put('/:ingredientId', wrap(ingredientsController.update))
ingredientRouter.delete('/:ingredientId', wrap(ingredientsController.delete))

export { ingredientRouter }
