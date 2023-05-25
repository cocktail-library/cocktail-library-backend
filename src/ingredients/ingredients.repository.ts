import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { IIngredient, Ingredient } from './ingredients.entity'
import { injectable } from 'inversify'

@injectable()
class IngredientsRepository {
  private baseRepository: GenericRepository<IIngredient>
  constructor() {
    this.baseRepository = new GenericRepository(Ingredient(sequelize), 'ingredientId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    return this.baseRepository.listAll(offset, limit, where)
  }

  async get(ingredientId: string) {
    return await this.baseRepository.get(ingredientId)
  }

  async update(ingredientId: string, payload: Partial<IIngredient>) {
    await this.baseRepository.update(ingredientId, payload)
    return await this.get(ingredientId)
  }

  async create(payload: Partial<IIngredient>) {
    const ingredient = await this.baseRepository.create(payload)
    return await this.get(ingredient.ingredientId)
  }

  async delete(ingredientId: string) {
    await this.baseRepository.delete({ ingredientId })
  }
}

export { IngredientsRepository }
