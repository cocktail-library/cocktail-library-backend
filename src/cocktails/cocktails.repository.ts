import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { Cocktail, ICocktail } from './cocktails.entity'
import { injectable } from 'inversify'
import { ITag, Tag } from '../tags/tags.entity'
import { IReview, Review } from '../reviews/reviews.entity'
import { Op } from 'sequelize'
import { CocktailTag, ICocktailTag } from '../cocktail-tags/cocktail-tags.entity'
import { Transformer } from '../utils/transformer'
import { Ingredient } from '../ingredients/ingredients.entity'
import { CocktailIngredient } from '../cocktail-ingredients/cocktail-ingredients.entity'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository
  private cocktailTagRepository: GenericRepository
  private tagRepository: GenericRepository
  private reviewRepository: GenericRepository
  private cocktailIngredientRepository: GenericRepository
  private ingredientRepository: GenericRepository

  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
    this.cocktailTagRepository = new GenericRepository(CocktailTag(sequelize), null)
    this.tagRepository = new GenericRepository(Tag(sequelize), 'tagId')
    this.reviewRepository = new GenericRepository(Review(sequelize), 'reviewId')
    this.cocktailIngredientRepository = new GenericRepository(CocktailIngredient(sequelize), null)
    this.ingredientRepository = new GenericRepository(Ingredient(sequelize), 'ingredientId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    const cocktailsData = await this.baseRepository.listAll<ICocktail>(offset, limit, where)
    const cocktailIds = Transformer.getObjectValues<ICocktail, string>(cocktailsData.result, 'cocktailId')
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
    if (payload.tags) {
      await this.updateCocktailTags(cocktail.cocktailId, payload.tags)
    }
    return await this.get(cocktail.cocktailId)
  }

  async delete(cocktailId: string) {
    await this.baseRepository.delete({ cocktailId })
    await this.cocktailTagRepository.delete({ cocktailId })
  }

  private async listTagsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ITag[]>> {
    const cocktailTags = await this.cocktailTagRepository.listAll<ICocktailTag>(0, 1000, { cocktailId: cocktailIds })
    const cocktailToCocktailTagMap = Transformer.groupBy(cocktailTags.result, 'cocktailId')

    const uniqueTagIds = Transformer.getUnique(Transformer.getObjectValues(cocktailTags.result, 'tagId'))
    const tags = await this.tagRepository.listAll<ITag>(0, 1000, { tagId: uniqueTagIds })
    const tagMap = Transformer.groupBy(tags.result, 'tagId')

    const result: Record<string, ITag[]> = {}
    for (const cocktailId of cocktailIds) {
      result[cocktailId] = (cocktailToCocktailTagMap[cocktailId] || []).map(cocktailTag => tagMap[cocktailTag.tagId][0])
    }
    return result
  }

  private async listReviewsByCocktailIds(cocktailIds: string[]): Promise<Record<string, IReview[]>> {
    const reviews = await this.reviewRepository.listAll<IReview>(0, 1000, { cocktailId: cocktailIds })
    return Transformer.groupBy(reviews.result, 'cocktailIds')
  }

  private async listIngredientsByCocktailIds(cocktailIds: string[]): Promise<Record<string, unknown[]>> {
    // todo
    throw new Error('not_implemented')
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
