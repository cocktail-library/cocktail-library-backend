import { IngredientsRepository } from './ingredients.repository'
import { IIngredient } from './ingredients.entity'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc-types'

@injectable()
class IngredientsService {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.IngredientsRepository) private ingredientsRepository: IngredientsRepository) {}

  listIngredients(offset = 0, limit = 100) {
    return this.ingredientsRepository.listAll(offset, limit)
  }

  getIngredient(ingredientId: string) {
    return this.ingredientsRepository.get(ingredientId)
  }

  updateIngredient(ingredientId: string, payload: Partial<IIngredient>) {
    return this.ingredientsRepository.update(ingredientId, payload)
  }

  createIngredient(payload: Partial<IIngredient>) {
    return this.ingredientsRepository.create(payload)
  }

  deleteIngredient(ingredientId: string) {
    return this.ingredientsRepository.delete(ingredientId)
  }
}

export { IngredientsService }
