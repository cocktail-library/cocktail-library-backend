import { ReviewsRepository } from './reviews.repository'
import { IReview } from './reviews.entity'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc-types'

@injectable()
class ReviewsService {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.ReviewsRepository) private reviewsRepository: ReviewsRepository) {}

  listCocktails(offset = 0, limit = 100) {
    return this.reviewsRepository.listAll(offset, limit)
  }

  getCocktail(cocktailId: string) {
    return this.reviewsRepository.get(cocktailId)
  }

  updateCocktail(cocktailId: string, payload: Partial<IReview>) {
    return this.reviewsRepository.update(cocktailId, payload)
  }

  createCocktail(payload: Partial<IReview>) {
    return this.reviewsRepository.create(payload)
  }

  deleteCocktail(cocktailId: string) {
    return this.reviewsRepository.delete(cocktailId)
  }
}

export { ReviewsService }
