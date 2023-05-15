import { sequelize } from '../db-connection'
import { GenericRepository } from '../generic/generic.repository'
import { ITag, Tag } from './tags.entity'
import { injectable } from 'inversify'

@injectable()
class TagsRepository {
  private baseRepository: GenericRepository
  constructor() {
    this.baseRepository = new GenericRepository(Tag(sequelize), 'tagId')
  }

  async listAll(offset = 0, limit = 100, where = {}) {
    return this.baseRepository.listAll(offset, limit, where)
  }

  async get(tagId: string) {
    return await this.baseRepository.get(tagId)
  }

  async update(tagId: string, payload: Partial<ITag>) {
    await this.baseRepository.update(tagId, payload)
    return await this.get(tagId)
  }

  async create(payload: Partial<ITag>) {
    const tag = await this.baseRepository.create(payload)
    return await this.get(tag.tagId)
  }

  async delete(tagId: string) {
    await this.baseRepository.delete({ tagId })
  }
}

export { TagsRepository }
