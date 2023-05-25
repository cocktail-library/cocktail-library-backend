import { Crud } from '../utils/crud'
import { Entity } from '../global'

class GenericRepository<T> {
  readonly entity: Entity
  readonly idFieldName: string | null

  constructor(entity: Entity, idFieldName: string | null) {
    this.entity = entity
    this.idFieldName = idFieldName
  }

  listAll(offset = 0, limit = 100, where = {}) {
    return Crud.listEntity<T>(this.entity, { offset, limit, where })
  }

  get(id: string | number) {
    if (!this.idFieldName) {
      throw new Error('no id field name')
    }
    return Crud.getEntity(this.entity, this.idFieldName, id)
  }

  async includes(id: string | number) {
    if (!this.idFieldName) {
      throw new Error('no id field name')
    }
    const count = await Crud.countEntity(this.entity, { where: { [this.idFieldName]: id }, limit: 1, offset: 0 })
    return !!count
  }

  create(payload: Partial<T>) {
    return Crud.createEntity(this.entity, payload)
  }

  bulkCreate(payload: Partial<T>[]) {
    return Crud.bulkCreateEntity(this.entity, payload)
  }

  update(id: string | number, payload: Partial<T>) {
    if (!this.idFieldName) {
      throw new Error('no id field name')
    }
    return Crud.updateEntity(this.entity, this.idFieldName, id, payload)
  }

  delete(where: Record<string, string | object>) {
    return Crud.deleteEntity(this.entity, where)
  }
}

export { GenericRepository }
