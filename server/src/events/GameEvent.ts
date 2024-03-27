export default class GameEvent {
  userId!: number | undefined
  payload!: any | undefined

  constructor(userId?: number, payload?: any) {
    this.userId = userId
    this.payload = payload
  }

  isValid() {
    return true
  }
}
