/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from './api-error'
import { Entity } from '../global'

class Crud {
  /**
     * @param entity
     * @param offset
     * @param limit
     * @param where
     * @returns {Promise<{result: Entity[] | Partial<Entity>[], total: number, offset: number, limit: number}>}
     */
  static async listEntity<T>(entity: Entity, { offset, limit, where }: {
        offset?: number;
        limit?: number;
        where?: Record<string, any>
    } = {}) {
    const result = await entity.findAll({
      where,
      offset,
      limit,
      raw: true,
    }) as T[]
    const total = await entity.count({
      where
    })
    return {
      result,
      offset,
      limit,
      total
    }
  }

  /**
     * @param entity
     * @param idFieldName
     * @param id
     * @param isRaw
     * @returns {Promise<Entity|null>}
     */
  static async getEntity(entity: Entity, idFieldName: string, id: string | number, isRaw = true) {
    const entityInstance = await entity.findOne({
      where: { [idFieldName]: id },
      raw: isRaw,
    })
    if (!entityInstance) {
      throw new ApiError(404, `${entity.name} not found`)
    }
    return entityInstance
  }

  /**
     * @param entity
     * @param payload
     * @returns {Promise<*>}
     */
  static async createEntity(entity: Entity, payload: Record<string, any>) {
    const entityInstance = await entity.create(payload)
    return entityInstance.get({ plain: true })
  }

  /**
   * @param entity
   * @param payload
   */
  static async bulkCreateEntity(entity: Entity, payload: Record<string, any>[]) {
    return await entity.bulkCreate(payload)
  }

  /**
     * @param entity
     * @param idFieldName
     * @param id
     * @param payload
     * @returns {Promise<*>}
     */
  static async updateEntity(entity: Entity, idFieldName: string, id: string | number, payload: Record<string, any>) {
    const entityInstance = await Crud.getEntity(entity, idFieldName, id, false)
    if (!entity) {
      return await Crud.createEntity(entity, payload)
    }
    for (const key of Object.keys(payload).filter(key => key !== idFieldName)) {
      entityInstance[key] = payload[key]
    }
    await entityInstance.save()
    return entityInstance.get({ plain: true })
  }

  /**
     * @param entity
     * @param where
     * @returns {Promise<void>}
     */
  static async deleteEntity(entity: Entity, where = {}) {
    await entity.destroy({ where })
  }

  static async countEntity(entity: Entity, { where, limit, offset }: {where: Record<string, any>; limit: number; offset: number}): Promise<number> {
    return entity.count({
      ...where && { where },
      ...limit && { limit },
      ...offset && { offset }
    })
  }
}


export { Crud }
