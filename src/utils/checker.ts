type Nullable<T> = T | null | undefined

class Checker {
  static isTruly<T>(value: Nullable<T>): value is T {
    return Boolean(value)
  }
}

export {
  Checker
}