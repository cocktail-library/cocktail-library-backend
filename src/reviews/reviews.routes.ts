import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { iocContainer } from '../ioc-container'
import { ReviewsController } from './reviews.controller'
import { TYPES } from '../ioc-types'

const reviewRouter = Router()
const reviewsController = iocContainer.get<ReviewsController>(TYPES.ReviewsController)

reviewRouter.get('/', wrap(reviewsController.listAll))
reviewRouter.get('/:reviewId', wrap(reviewsController.get))
reviewRouter.post('/', wrap(reviewsController.create))
reviewRouter.put('/:reviewId', wrap(reviewsController.update))
reviewRouter.delete('/:reviewId', wrap(reviewsController.delete))

export { reviewRouter }
