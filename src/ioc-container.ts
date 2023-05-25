import { Container } from 'inversify'
import 'reflect-metadata'

import { TYPES } from './ioc-types'

import { TagsRepository } from './tags/tags.repository'
import { TagsService } from './tags/tags.service'
import { TagsController } from './tags/tags.controller'

import { CocktailsRepository } from './cocktails/cocktails.repository'
import { CocktailsService } from './cocktails/cocktails.service'
import { CocktailsController } from './cocktails/cocktails.controller'

import { ReviewsRepository } from './reviews/reviews.repository'
import { ReviewsService } from './reviews/reviews.service'
import { ReviewsController } from './reviews/reviews.controller'

import { IngredientsRepository } from './ingredients/ingredients.repository'
import { IngredientsService } from './ingredients/ingredients.service'
import { IngredientsController } from './ingredients/ingredients.controller'

const iocContainer = new Container()

iocContainer.bind<TagsRepository>(TYPES.TagsRepository).to(TagsRepository)
iocContainer.bind<TagsService>(TYPES.TagsService).to(TagsService)
iocContainer.bind<TagsController>(TYPES.TagsController).to(TagsController)

iocContainer.bind<CocktailsRepository>(TYPES.CocktailsRepository).to(CocktailsRepository)
iocContainer.bind<CocktailsService>(TYPES.CocktailsService).to(CocktailsService)
iocContainer.bind<CocktailsController>(TYPES.CocktailsController).to(CocktailsController)

iocContainer.bind<ReviewsRepository>(TYPES.ReviewsRepository).to(ReviewsRepository)
iocContainer.bind<ReviewsService>(TYPES.ReviewsService).to(ReviewsService)
iocContainer.bind<ReviewsController>(TYPES.ReviewsController).to(ReviewsController)

iocContainer.bind<IngredientsRepository>(TYPES.IngredientsRepository).to(IngredientsRepository)
iocContainer.bind<IngredientsService>(TYPES.IngredientsService).to(IngredientsService)
iocContainer.bind<IngredientsController>(TYPES.IngredientsController).to(IngredientsController)

export { iocContainer }
