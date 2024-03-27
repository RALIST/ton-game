export enum EventStatus {
  OK,
  ERROR
}

export default class GameEvent {
  userId!: number | undefined
  payload!: any | undefined
  status!: EventStatus

  constructor(userId?: number, payload?: any, status?: EventStatus ) {
    this.userId = userId
    this.payload = payload
    this.status = status || EventStatus.OK
  }

  isValid() {
    return true
  }
}
