// eslint-disable-next-line no-unused-vars
type UnknownFunction = (...inputs: unknown[]) => unknown;

class Transformer {
  static getArrayElementCounter(arr: string[]): Record<string, number> {
    const result: Record<string, number> = {}
    arr.forEach(elem => {
      result[elem] = (result[elem] || 0) + 1
    })
    return result
  }

  static getArrayDifference<T>(left: T[], right: T[]): T[] {
    const rightUniqueElements = new Set(right)
    return left.filter(elem => !rightUniqueElements.has(elem))
  }

  static getCommon(left: string[], right: string[]): string[] {
    const rightUniqueElements = this.getArrayElementCounter(right)
    const result: string[] = []
    left.forEach(el => {
      if (rightUniqueElements[el]) {
        rightUniqueElements[el]--
        result.push(el)
      }
    })
    return result
  }

  static getExtendedArrayDifference(left: string[], right: string[]) {
    return {
      left: this.getArrayDifference(left, right),
      common: this.getCommon(left, right),
      right: this.getArrayDifference(right, left)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getObjectValues<T extends Record<string, any>, K extends string | number | null>(array: T[], key: string): K[] {
    return [...new Set(array.map(el => el[key] as K))]
  }


  static getUnique<T extends string | number | null>(array: T[]): T[] {
    return [...new Set(array)]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static groupBy<T extends Record<string, any>>(array: T[], key: string): Record<string, T[]> {
    const result: Record<string, T[]> = {}
    array.forEach(elem => {
      const value = elem[key]
      if (result[value]) {
        result[value].push(elem)
      } else {
        result[value] = [elem]
      }
    })
    return result
  }

  static mapObjectArrayFields<T>(mapFunction: UnknownFunction, obj: Record<string, object[]>): Record<string, T[]> {
    const result: Record<string, T[]> = {}
    Object.keys(obj).forEach(key => result[key] = obj[key].map(mapFunction) as T[])
    return result
  }

  static forceExtractField<T, R>(obj: T, fieldName: string): R {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((obj as any)[fieldName]) as R
  }
}

export {
  Transformer
}
