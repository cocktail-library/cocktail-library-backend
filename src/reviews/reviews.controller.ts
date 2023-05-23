import { ReviewsService } from './reviews.service'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../ioc-types'

@injectable()
class ReviewsController {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.ReviewsService) private reviewsService: ReviewsService) {
    this.listAll = this.listAll.bind(this)
    this.get = this.get.bind(this)
    this.update = this.update.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  async listAll(req: Request) {
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 100

    return await this.reviewsService.listCocktails(offset, limit)
  }

  async get(req: Request) {
    const { reviewId } = req.params
    return await this.reviewsService.getCocktail(reviewId)
  }

  async update(req: Request) {
    const { reviewId } = req.params
    const payload = req.body
    return await this.reviewsService.updateCocktail(reviewId, payload)
  }

  async create(req: Request) {
    const payload = req.body
    return await this.reviewsService.createCocktail(payload)
  }

  async delete(req: Request) {
    const { reviewId } = req.params
    await this.reviewsService.deleteCocktail(reviewId)
  }
}

export { ReviewsController }
