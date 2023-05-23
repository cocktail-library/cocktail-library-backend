import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { Cocktail, ICocktail, ICocktailIngredient } from './cocktails.entity'
import { injectable } from 'inversify'
import { ITag, Tag } from '../tags/tags.entity'
import { IReview } from '../reviews/reviews.entity'
import { Op } from 'sequelize'
import { CocktailTag, ICocktailTag } from '../cocktail-tags/cocktail-tags.entity'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository
  private cocktailTagRepository: GenericRepository
  private tagRepository: GenericRepository

  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
    this.cocktailTagRepository = new GenericRepository(CocktailTag(sequelize), null)
    this.tagRepository = new GenericRepository(Tag(sequelize), 'tagId')
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
    if (payload.tags) {
      await this.updateCocktailTags(cocktailId, payload.tags)
    }
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

  // TODO refactor
  //   too much same names - create utility functions
  private async listTagsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ITag[]>> {
    const cocktailTags = await this.cocktailTagRepository.listAll<ICocktailTag>(0, 1000, { cocktailId: cocktailIds })
    const tagIds = [...new Set(cocktailTags.result.map(cocktailTag => cocktailTag.tagId))]
    const cocktailsTagIds: Record<string, string[]> = {}
    cocktailTags.result.forEach(cocktailTag => {
      if (cocktailsTagIds[cocktailTag.cocktailId]) {
        cocktailsTagIds[cocktailTag.cocktailId].push(cocktailTag.tagId)
      } else {
        cocktailsTagIds[cocktailTag.cocktailId] = [cocktailTag.tagId]
      }
    })
    const tags = await this.tagRepository.listAll<ITag>(0, 1000, { tagId: tagIds })
    const tagsByTagId: Record<string, ITag> = {}
    tags.result.forEach(tag => tagsByTagId[tag.tagId] = tag)
    const result: Record<string, ITag[]> = {}
    cocktailIds.forEach(cocktailId => {
      const cocktailTagIds = cocktailsTagIds[cocktailId] || []
      result[cocktailId] = cocktailTagIds.map(tagId => tagsByTagId[tagId])
    })
    return result
  }

  private async listReviewsByCocktailIds(cocktailIds: string[]): Promise<Record<string, IReview[]>> {
    console.log(cocktailIds)
    const result: Record<string, IReview[]> = {}
    // TODO perform SQL query
    return result
  }

  private async listIngredientsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ICocktailIngredient[]>> {
    console.log(cocktailIds)
    const result: Record<string, ICocktailIngredient[]> = {}
    // TODO perform SQL query
    return result
  }

  private async updateCocktailTags(cocktailId: string, tags: ITag[]) {
    await this.cocktailTagRepository.delete({ cocktailId, tagId: { [Op.notIn]: tags.map(tag => tag.tagId ) } })
    const exitingTags = await this.cocktailTagRepository.listAll<ICocktailTag>(0, 1000, { cocktailId } )
    const tagsToCreate = tags.filter(tag => !exitingTags.result.find(existingTag => existingTag.tagId === tag.tagId)).map(tag => ({
      ...tag,
      cocktailId,
    }))
    await this.cocktailTagRepository.bulkCreate(tagsToCreate)
  }
}

export { CocktailsRepository }
