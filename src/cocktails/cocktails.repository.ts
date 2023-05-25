import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { Cocktail, ICocktail } from './cocktails.entity'
import { injectable } from 'inversify'
import { ITag, Tag } from '../tags/tags.entity'
import { IReview, Review } from '../reviews/reviews.entity'
import { CocktailTag, ICocktailTag } from '../cocktail-tags/cocktail-tags.entity'
import { Transformer } from '../utils/transformer'
import { IExtendedCocktailIngredient, IIngredient, Ingredient } from '../ingredients/ingredients.entity'
import { CocktailIngredient, ICocktailIngredient } from '../cocktail-ingredients/cocktail-ingredients.entity'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository<ICocktail>
  private cocktailTagRepository: GenericRepository<ICocktailTag>
  private tagRepository: GenericRepository<ITag>
  private reviewRepository: GenericRepository<IReview>
  private cocktailIngredientRepository: GenericRepository<ICocktailIngredient>
  private ingredientRepository: GenericRepository<IIngredient>

  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
    this.cocktailTagRepository = new GenericRepository(CocktailTag(sequelize), null)
    this.tagRepository = new GenericRepository(Tag(sequelize), 'tagId')
    this.reviewRepository = new GenericRepository(Review(sequelize), 'reviewId')
    this.cocktailIngredientRepository = new GenericRepository(CocktailIngredient(sequelize), null)
    this.ingredientRepository = new GenericRepository(Ingredient(sequelize), 'ingredientId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    const cocktails = await this.baseRepository.listAll(offset, limit, where)
    const extendedCocktailsData = await this.getExtendedCocktails(cocktails.result)

    return {
      ...cocktails,
      result: extendedCocktailsData
    }
  }

  async get(cocktailId: string): Promise<ICocktail> {
    const cocktailData = await this.baseRepository.get(cocktailId)
    const extendedCocktailData = await this.getExtendedCocktails([cocktailData])
    return extendedCocktailData[0]
  }

  private async getExtendedCocktails(cocktails: ICocktail[]): Promise<ICocktail[]> {
    const cocktailIds = cocktails.map(cocktail => cocktail.cocktailId)
    const tagRecords = await this.listTagsByCocktailIds(cocktailIds)
    const reviewRecords = await this.listReviewsByCocktailIds(cocktailIds)
    const ingredientRecords = await this.listIngredientsByCocktailIds(cocktailIds)
    return cocktails.map(cocktail => ({
      ...cocktail,
      tags: tagRecords[cocktail.cocktailId] || [],
      reviews: reviewRecords[cocktail.cocktailId] || [],
      ingredients: ingredientRecords[cocktail.cocktailId] || [],
    }))
  }

  async update(cocktailId: string, payload: Partial<ICocktail>) {
    await this.baseRepository.update(cocktailId, payload)
    await this.updateCocktailTagsAndIngredients(cocktailId, payload)
    return await this.get(cocktailId)
  }

  async create(payload: Partial<ICocktail>) {
    const cocktail = await this.baseRepository.create(payload)
    const cocktailId = cocktail.cocktailId
    await this.updateCocktailTagsAndIngredients(cocktailId, payload)
    return await this.get(cocktail.cocktailId)
  }

  async delete(cocktailId: string) {
    await this.baseRepository.delete({ cocktailId })
    await this.cocktailTagRepository.delete({ cocktailId })
  }

  private async listTagsByCocktailIds(cocktailIds: string[]): Promise<Record<string, ITag[]>> {
    const cocktailTags = await this.cocktailTagRepository.listAll(0, 1000, { cocktailId: cocktailIds })
    const cocktailToCocktailTagMap = Transformer.groupBy(cocktailTags.result, 'cocktailId')

    const uniqueTagIds = Transformer.getUnique(Transformer.getObjectValues(cocktailTags.result, 'tagId'))
    const tags = await this.tagRepository.listAll(0, 1000, { tagId: uniqueTagIds })
    const tagMap = Transformer.groupBy(tags.result, 'tagId')

    const result: Record<string, ITag[]> = {}
    for (const cocktailId of cocktailIds) {
      result[cocktailId] = (cocktailToCocktailTagMap[cocktailId] || []).map(cocktailTag => tagMap[cocktailTag.tagId][0])
    }
    return result
  }

  private async listReviewsByCocktailIds(cocktailIds: string[]): Promise<Record<string, IReview[]>> {
    const reviews = await this.reviewRepository.listAll(0, 1000, { cocktailId: cocktailIds })
    return Transformer.groupBy(reviews.result, 'cocktailId')
  }

  // todo
  //   looks too similar to listTagsByCocktailIds, we need to handle many-to-many relations in other way
  private async listIngredientsByCocktailIds(cocktailIds: string[]): Promise<Record<string, IExtendedCocktailIngredient[]>> {
    const cocktailIngredients = await this.cocktailIngredientRepository.listAll(0, 1000, { cocktailId: cocktailIds })
    const cocktailToCocktailIngredientMap = Transformer.groupBy(cocktailIngredients.result, 'cocktailId')

    const uniqueIngredientIds = Transformer.getUnique(Transformer.getObjectValues(cocktailIngredients.result, 'ingredientId'))
    const ingredients = await this.ingredientRepository.listAll(0, 1000, { ingredientId: uniqueIngredientIds })
    const ingredientMap = Transformer.groupBy(ingredients.result, 'ingredientId')

    const result: Record<string, IExtendedCocktailIngredient[]> = {}
    for (const cocktailId of cocktailIds) {
      result[cocktailId] = (cocktailToCocktailIngredientMap[cocktailId] || []).map(cocktailIngredient => ({
        unitCount: cocktailIngredient.unitCount,
        ...ingredientMap[cocktailIngredient.ingredientId][0],
      }))
    }
    return result
  }

  private async updateCocktailTagsAndIngredients(cocktailId: string, payload: Partial<ICocktail>) {
    if (payload.tags) {
      await this.updateCocktailTags(cocktailId, payload.tags)
    }
    if (payload.ingredients) {
      await this.updateCocktailIngredients(cocktailId, payload.ingredients)
    }
  }

  private async updateCocktailTags(cocktailId: string, tags: ITag[]) {
    await this.updateCocktailLinkedEntities(cocktailId, tags, this.cocktailTagRepository, 'tagId')
  }

  private async updateCocktailIngredients(cocktailId: string, ingredients: IExtendedCocktailIngredient[]) {
    await this.updateCocktailLinkedEntities(cocktailId, ingredients, this.cocktailIngredientRepository, 'ingredientId')
  }

  // todo
  //   14 строк как-то много, хочется сократить
  private async updateCocktailLinkedEntities<T extends Partial<unknown>, R>(cocktailId: string, newEntities: T[], repository: GenericRepository<R>, additionalKeyName: string) {
    const existingLinkedEntities = await repository.listAll(0, 1000, { cocktailId })
    const existingAdditionalIds: string[] = existingLinkedEntities.result.map(entity => Transformer.forceExtractField(entity, additionalKeyName))
    const newAdditionalIds: string[] = newEntities.map(entity => Transformer.forceExtractField(entity, additionalKeyName))
    const { left: idsToDelete, right: idsToAdd } = Transformer.getExtendedArrayDifference(existingAdditionalIds, newAdditionalIds)
    await repository.delete({ cocktailId, [additionalKeyName]: idsToDelete })
    const entitiesToCreate: T[] = []
    newEntities.forEach((entity) => {
      const entityAdditionalId = Transformer.forceExtractField<T, string>(entity, additionalKeyName)
      if (!idsToAdd.includes(entityAdditionalId)) {
        return
      }
      entitiesToCreate.push({ ...entity, cocktailId })
    })
    await repository.bulkCreate(entitiesToCreate)
  }
}

export { CocktailsRepository }
