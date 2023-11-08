import { CocktailsService } from './cocktails.service'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../ioc-types'
import { CocktailListAllRawFilters } from './cocktails.types'

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
    const { offset: rawOffset, limit: rawLimit, ...where } = req.query
    const offset = Number(rawOffset) || 0
    const limit = Number(rawLimit) || 100
    const result = await this.cocktailsService.listCocktails(offset, limit, where as CocktailListAllRawFilters)
    return {
      ...result,
      query: req.query,
    }
  }

  async get(req: Request) {
    const { cocktailStrId } = req.params
    return await this.cocktailsService.getCocktail(cocktailStrId)
  }

  async getBySlug(req: Request) {
    const { cocktailSlug } = req.params
    return await this.cocktailsService.getCocktailBySlug(cocktailSlug)
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
