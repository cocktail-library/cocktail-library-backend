import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { Cocktail, ICocktail } from './cocktails.entity'
import { injectable } from 'inversify'
import { ITag, Tag } from '../tags/tags.entity'
import { IReview, Review } from '../reviews/reviews.entity'
import { Transformer } from '../utils/transformer'
import { IExtendedCocktailIngredient, IIngredient, Ingredient } from '../ingredients/ingredients.entity'
import { CocktailIngredient, ICocktailIngredient } from '../cocktail-ingredients/cocktail-ingredients.entity'
import { CocktailListAllFilters } from './cocktails.types'
import { Op } from 'sequelize'

@injectable()
class CocktailsRepository {
  private baseRepository: GenericRepository<ICocktail>
  private tagRepository: GenericRepository<ITag>
  private reviewRepository: GenericRepository<IReview>
  private cocktailIngredientRepository: GenericRepository<ICocktailIngredient>
  private ingredientRepository: GenericRepository<IIngredient>

  constructor() {
    this.baseRepository = new GenericRepository(Cocktail(sequelize), 'cocktailId')
    this.tagRepository = new GenericRepository(Tag(sequelize), 'tagId')
    this.reviewRepository = new GenericRepository(Review(sequelize), 'reviewId')
    this.cocktailIngredientRepository = new GenericRepository(CocktailIngredient(sequelize), null)
    this.ingredientRepository = new GenericRepository(Ingredient(sequelize), 'ingredientId')
  }

  private getAbvFilter(abvMin: number | undefined, abvMax: number | undefined) {
    if (!abvMax && !abvMin) {
      return {}
    }
    if (abvMax && !abvMin) {
      return { abv: { [Op.lte]: abvMax } }
    }
    if (!abvMax && abvMin) {
      return { abv: { [Op.gte]: abvMin } }
    }
    return { abv: { [Op.between]: [abvMin, abvMax] } }
  }

  async listAll(offset = 0, limit = 100, where: CocktailListAllFilters) {
    const { isTasted, abvMin, abvMax, tagGroups = [] } = where
    const abvFilters = this.getAbvFilter(abvMin, abvMax)
    const { result: rawCocktailsList } = await this.baseRepository.listAll(0, 1000, { ...isTasted && { isTasted }, ...abvFilters })
    const filteredCocktailsList = rawCocktailsList.filter(cocktail => {
      if (tagGroups.length === 0) {
        return true
      }
      return tagGroups.every(tagGroup => Transformer.getExtendedArrayDifference(cocktail.tagIds || [], tagGroup).common.length > 0)
    })
    return {
      offset,
      limit,
      total: filteredCocktailsList.length,
      result: await this.getExtendedCocktails(filteredCocktailsList.slice(offset, offset + limit))
    }
  }

  async get(cocktailId: string): Promise<ICocktail> {
    const cocktailData = await this.baseRepository.get(cocktailId)
    const extendedCocktailData = await this.getExtendedCocktails([cocktailData])
    return extendedCocktailData[0]
  }

  async getBySlug(slug: string): Promise<ICocktail> {
    const cocktailsArr = await this.baseRepository.listAll(0, 1, { where: { slug } })
    const cocktailData = cocktailsArr.result[0]
    const extendedCocktailData = await this.getExtendedCocktails([cocktailData])
    return extendedCocktailData[0]
  }

  private async getExtendedCocktails(cocktails: ICocktail[]): Promise<ICocktail[]> {
    const cocktailIds = cocktails.map(cocktail => cocktail.cocktailId)
    const tagRecords = await this.listTagsByCocktails(cocktails)
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
    if (payload.ingredients) {
      await this.updateCocktailIngredients(cocktailId, payload.ingredients)
    }
    return await this.get(cocktailId)
  }

  async create(payload: Partial<ICocktail>) {
    const cocktail = await this.baseRepository.create(payload)
    const cocktailId = cocktail.cocktailId
    if (payload.ingredients) {
      await this.updateCocktailIngredients(cocktailId, payload.ingredients)
    }
    return await this.get(cocktail.cocktailId)
  }

  async delete(cocktailId: string) {
    await this.baseRepository.delete({ cocktailId })
  }

  private async listTagsByCocktails(cocktails: ICocktail[]): Promise<Record<string, ITag[]>> {
    const uniqueTags = Transformer.getUnique(cocktails.flatMap(cocktail => cocktail.tagIds || []))
    const tags = await this.tagRepository.listAll(0, uniqueTags.length, { tagId: uniqueTags })
    const tagsMap = Transformer.groupBy(tags.result, 'tagId')
    const result: Record<string, ITag[]> = {}
    cocktails.forEach(cocktail => result[cocktail.cocktailId] = (cocktail.tagIds || []).flatMap(tagId => tagsMap[tagId]).filter(Boolean))
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

  private async updateCocktailIngredients(cocktailId: string, ingredients: IExtendedCocktailIngredient[]) {
    await this.cocktailIngredientRepository.delete({ cocktailId })
    await this.cocktailIngredientRepository.bulkCreate(ingredients.map(({ ingredientId, unitCount }) => ({ cocktailId, ingredientId, unitCount })))
  }
}

export { CocktailsRepository }
