import { Router } from 'express'
import { wrap } from '../utils/wrap'
import { iocContainer } from '../ioc-container'
import { TagsController } from './tags.controller'
import { TYPES } from '../ioc-types'

const tagRouter = Router()
const tagsController = iocContainer.get<TagsController>(TYPES.TagsController)

tagRouter.get('/', wrap(tagsController.listAll))
tagRouter.get('/:taskStrId', wrap(tagsController.get))
tagRouter.post('/', wrap(tagsController.create))
tagRouter.put('/:taskStrId', wrap(tagsController.update))
tagRouter.delete('/:taskStrId', wrap(tagsController.delete))

export { tagRouter }
