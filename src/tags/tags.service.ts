import { TagsRepository } from './tags.repository'
import { ITag } from './tags.entity'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc-types'

@injectable()
class TagsService {
  // eslint-disable-next-line no-unused-vars
  constructor(@inject(TYPES.TagsRepository) private tagsRepository: TagsRepository) {}

  listTags(offset = 0, limit = 100) {
    return this.tagsRepository.listAll(offset, limit)
  }

  getTag(tagId: string) {
    return this.tagsRepository.get(tagId)
  }

  updateTag(tagId: string, payload: Partial<ITag>) {
    return this.tagsRepository.update(tagId, payload)
  }

  createTag(payload: Partial<ITag>) {
    return this.tagsRepository.create(payload)
  }

  deleteTag(tagId: string) {
    return this.tagsRepository.delete(tagId)
  }
}

export { TagsService }
