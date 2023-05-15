import { TagsService } from './tags.service'
import { Request } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../ioc-types'

@injectable()
class TagsController {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.TagsService) private tagsService: TagsService) {
    this.listAll = this.listAll.bind(this)
    this.get = this.get.bind(this)
    this.update = this.update.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
  }

  async listAll(req: Request) {
    const offset = Number(req.query.offset) || 0
    const limit = Number(req.query.limit) || 100

    return await this.tagsService.listTags(offset, limit)
  }

  async get(req: Request) {
    const { taskStrId } = req.params
    return await this.tagsService.getTag(taskStrId)
  }

  async update(req: Request) {
    const { taskStrId } = req.params
    const payload = req.body
    return await this.tagsService.updateTag(taskStrId, payload)
  }

  async create(req: Request) {
    const payload = req.body
    return await this.tagsService.createTag(payload)
  }

  async delete(req: Request) {
    const { taskStrId } = req.params
    await this.tagsService.deleteTag(taskStrId)
  }
}

export { TagsController }
