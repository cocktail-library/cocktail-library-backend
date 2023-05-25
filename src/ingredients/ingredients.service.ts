import { IngredientsRepository } from './ingredients.repository'
import { IIngredient } from './ingredients.entity'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc-types'

@injectable()
class IngredientsService {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.IngredientsRepository) private ingredientsRepository: IngredientsRepository) {}

  listCocktails(offset = 0, limit = 100) {
    return this.ingredientsRepository.listAll(offset, limit)
  }

  getCocktail(ingredientId: string) {
    return this.ingredientsRepository.get(ingredientId)
  }

  updateCocktail(ingredientId: string, payload: Partial<IIngredient>) {
    return this.ingredientsRepository.update(ingredientId, payload)
  }

  createCocktail(payload: Partial<IIngredient>) {
    return this.ingredientsRepository.create(payload)
  }

  deleteCocktail(ingredientId: string) {
    return this.ingredientsRepository.delete(ingredientId)
  }
}

export { IngredientsService }
