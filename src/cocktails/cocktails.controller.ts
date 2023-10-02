import { CocktailsService } from './cocktails.service'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../ioc-types'

@injectable()
class CocktailsController {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.CocktailsService) private cocktailsService: CocktailsService) {
    this.listAll = this.listAll.bind(this)
    this.get = this.get.bind(this)
    this.update = this.update.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  async listAll(req: Request) {
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 100
    const where = req.query
    if (req.query.tagIds) {
      where.tagIds = req.query.tagIds.toString().split(',')
    }
    if (req.query.ingredientIds) {
      where.tagIds = req.query.ingredientIds.toString().split(',')
    }

    const result = await this.cocktailsService.listCocktails(offset, limit, where)
    return {
      ...result,
      query: req.query,
    }
  }

  async get(req: Request) {
    const { cocktailStrId } = req.params
    return await this.cocktailsService.getCocktail(cocktailStrId)
  }

  async update(req: Request) {
    const { cocktailStrId } = req.params
    const payload = req.body
    return await this.cocktailsService.updateCocktail(cocktailStrId, payload)
  }

  async create(req: Request) {
    const payload = req.body
    return await this.cocktailsService.createCocktail(payload)
  }

  async delete(req: Request) {
    const { cocktailStrId } = req.params
    await this.cocktailsService.deleteCocktail(cocktailStrId)
  }
}

export { CocktailsController }
