export class InvalidTokenProvidedError extends Error {
  constructor() {
    super('Invalid token provided')
  }
}
