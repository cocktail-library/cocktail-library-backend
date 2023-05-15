import { Container } from 'inversify'
import 'reflect-metadata'

import { TYPES } from './ioc-types'
import { TagsRepository } from './tags/tags.repository'
import { TagsService } from './tags/tags.service'
import { TagsController } from './tags/tags.controller'
import { CocktailsRepository } from './cocktails/cocktails.repository'
import { CocktailsService } from './cocktails/cocktails.service'
import { CocktailsController } from './cocktails/cocktails.controller'

const iocContainer = new Container()

iocContainer.bind<TagsRepository>(TYPES.TagsRepository).to(TagsRepository)
iocContainer.bind<TagsService>(TYPES.TagsService).to(TagsService)
iocContainer.bind<TagsController>(TYPES.TagsController).to(TagsController)

iocContainer.bind<CocktailsRepository>(TYPES.CocktailsRepository).to(CocktailsRepository)
iocContainer.bind<CocktailsService>(TYPES.CocktailsService).to(CocktailsService)
iocContainer.bind<CocktailsController>(TYPES.CocktailsController).to(CocktailsController)

export { iocContainer }
