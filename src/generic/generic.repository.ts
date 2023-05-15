import { Crud } from '../utils/crud'
import { Entity } from '../global'

class GenericRepository {
  readonly entity: Entity
  readonly idFieldName: string

  constructor(entity: Entity, idFieldName: string) {
    this.entity = entity
    this.idFieldName = idFieldName
  }

  listAll<T>(offset = 0, limit = 100, where = {}) {
    return Crud.listEntity<T>(this.entity, { offset, limit, where })
  }

  get(id: string | number) {
    return Crud.getEntity(this.entity, this.idFieldName, id)
  }

  async includes(id: string | number) {
    const count = await Crud.countEntity(this.entity, { where: { [this.idFieldName]: id }, limit: 1, offset: 0 })
    return !!count
  }

  create<T>(payload: Partial<T>) {
    return Crud.createEntity(this.entity, payload)
  }

  update<T>(id: string | number, payload: Partial<T>) {
    return Crud.updateEntity(this.entity, this.idFieldName, id, payload)
  }

  delete(where: Record<string, string | object>) {
    return Crud.deleteEntity(this.entity, where)
  }
}

export { GenericRepository }
