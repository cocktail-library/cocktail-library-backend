class ApiError extends Error {
  readonly name: string
  readonly statusCode: number
  readonly message: string

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.message = message
  }
}

export { ApiError }

