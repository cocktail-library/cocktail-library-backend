import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { IReview, Review } from './reviews.entity'
import { injectable } from 'inversify'

@injectable()
class ReviewsRepository {
  private baseRepository: GenericRepository
  constructor() {
    this.baseRepository = new GenericRepository(Review(sequelize), 'reviewId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    return this.baseRepository.listAll(offset, limit, where)
  }

  async get(reviewId: string) {
    return await this.baseRepository.get(reviewId)
  }

  async update(reviewId: string, payload: Partial<IReview>) {
    await this.baseRepository.update(reviewId, payload)
    return await this.get(reviewId)
  }

  async create(payload: Partial<IReview>) {
    const review = await this.baseRepository.create(payload)
    return await this.get(review.reviewId)
  }

  async delete(reviewId: string) {
    await this.baseRepository.delete({ reviewId })
  }
}

export { ReviewsRepository }
