import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { ICocktail, Cocktail } from './cocktails.entity'
import { injectable } from 'inversify'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository
  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    return this.baseRepository.listAll(offset, limit, where)
  }

  async get(cocktailId: string) {
    return await this.baseRepository.get(cocktailId)
  }

  async update(cocktailId: string, payload: Partial<ICocktail>) {
    await this.baseRepository.update(cocktailId, payload)
    return await this.get(cocktailId)
  }

  async create(payload: Partial<ICocktail>) {
    const cocktail = await this.baseRepository.create(payload)
    return await this.get(cocktail.cocktailId)
  }

  async delete(cocktailId: string) {
    await this.baseRepository.delete({ cocktailId })
  }
}

export { CocktailsRepository }
