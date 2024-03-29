import { IngredientsService } from './ingredients.service'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../ioc-types'

@injectable()
class IngredientsController {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.IngredientsService) private ingredientsService: IngredientsService) {
    this.listAll = this.listAll.bind(this)
    this.get = this.get.bind(this)
    this.update = this.update.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  async listAll(req: Request) {
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 100

    return await this.ingredientsService.listIngredients(offset, limit)
  }

  async get(req: Request) {
    const { ingredientId } = req.params
    return await this.ingredientsService.getIngredient(ingredientId)
  }

  async update(req: Request) {
    const { ingredientId } = req.params
    const payload = req.body
    return await this.ingredientsService.updateIngredient(ingredientId, payload)
  }

  async create(req: Request) {
    const payload = req.body
    return await this.ingredientsService.createIngredient(payload)
  }

  async delete(req: Request) {
    const { ingredientId } = req.params
    await this.ingredientsService.deleteIngredient(ingredientId)
  }
}

export { IngredientsController }
