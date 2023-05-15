import { CocktailsRepository } from './cocktails.repository'
import { ICocktail } from './cocktails.entity'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc-types'

@injectable()
class CocktailsService {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.CocktailsRepository) private cocktailsRepository: CocktailsRepository) {}

  listCocktails(offset = 0, limit = 100) {
    return this.cocktailsRepository.listAll(offset, limit)
  }

  getCocktail(cocktailId: string) {
    return this.cocktailsRepository.get(cocktailId)
  }

  updateCocktail(cocktailId: string, payload: Partial<ICocktail>) {
    return this.cocktailsRepository.update(cocktailId, payload)
  }

  createCocktail(payload: Partial<ICocktail>) {
    return this.cocktailsRepository.create(payload)
  }

  deleteCocktail(cocktailId: string) {
    return this.cocktailsRepository.delete(cocktailId)
  }
}

export { CocktailsService }
