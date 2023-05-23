import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { Cocktail, ICocktail, ICocktailIngredient } from './cocktails.entity'
import { injectable } from 'inversify'
import { ITag } from '../tags/tags.entity'
import { IReview } from '../reviews/reviews.entity'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository
  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    const cocktailsData = await this.baseRepository.listAll<ICocktail>(offset, limit, where)

    const cocktailIds = cocktailsData.result.map(cocktail => cocktail.cocktailId)
    const tagRecords = await this.listTagsByCocktailIds(cocktailIds)
    const reviewRecords = await this.listReviewsByCocktailIds(cocktailIds)
    const ingredientRecords = await this.listIngredientsByCocktailIds(cocktailIds)

    return {
      ...cocktailsData,
      result: cocktailsData.result.map(cocktailData => ({
        ...cocktailData,
        tags: tagRecords[cocktailData.cocktailId] || [],
        reviews: reviewRecords[cocktailData.cocktailId] || [],
        ingredients: ingredientRecords[cocktailData.cocktailId] || [],
      }))
    }
  }

  async get(cocktailId: string): Promise<ICocktail> {
    const cocktailData = await this.baseRepository.get(cocktailId)

    const tagRecords = await this.listTagsByCocktailIds([cocktailId])
    const reviewRecords = await this.listReviewsByCocktailIds([cocktailId])
    const ingredientRecords = await this.listIngredientsByCocktailIds([cocktailId])

    return {
      ...cocktailData,
      tags: tagRecords[cocktailId] || [],
      reviews: reviewRecords[cocktailId] || [],
      ingredients: ingredientRecords[cocktailId] || [],
    }
  }

  async update(cocktailId: string, payload: Partial<ICocktail>) {
    await this.baseRepository.update(cocktailId, payload)
    // TODO update related entities
    return await this.get(cocktailId)
  }

  async create(payload: Partial<ICocktail>) {
    const cocktail = await this.baseRepository.create(payload)
    // TODO update related entities
    return await this.get(cocktail.cocktailId)
  }

  async delete(cocktailId: string) {
    // TODO update related entities
    await this.baseRepository.delete({ cocktailId })
  }

  private async listTagsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ITag[]>> {
    const result: Record<string, ITag[]> = {}
    // TODO perform SQL query
    return result
  }

  private async listReviewsByCocktailIds(cocktailIds: string[]): Promise<Record<string, IReview[]>> {
    const result: Record<string, IReview[]> = {}
    // TODO perform SQL query
    return result
  }

  private async listIngredientsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ICocktailIngredient[]>> {
    const result: Record<string, ICocktailIngredient[]> = {}
    // TODO perform SQL query
    return result
  }
}

export { CocktailsRepository }
