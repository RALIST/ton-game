import {GameplayEvents} from "@/lib/utils/enums";

export default class StreamEvent {
  userId!: number
  event!: string
  payload!: any
  id!: number

  constructor(userId?: number, event?: string, payload?: any) {
    if(userId) this.userId = userId
    if(event) this.event = event
    if(payload) this.payload = payload
  }

  moveStarted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.MOVE_STARTED
    this.payload = payload
    return this
  }

  moveCompleted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.MOVE_COMPLETED
    this.payload = payload
    return this
  }

  lookStarted(userId: number,payload: any) {
    this.userId = userId
    this.event = GameplayEvents.LOOK_STARTED
    this.payload = payload
    return this
  }

  lookCompleted(userId: number,payload: any) {
    this.userId = userId

    this.event = GameplayEvents.LOOK_COMPLETED
    this.payload = payload
    return this
  }

  attackStarted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.ATTACK_STARTED
    this.payload = payload
    return this
  }

  attackCompleted(userId: number, payload: any) {
    this.userId = userId

    this.event = GameplayEvents.ATTACK_COMPLETED
    this.payload = payload
    return this
  }

  runStarted(userId: number, payload: any) {
    this.userId = userId

    this.event = GameplayEvents.RUN_STARTED
    this.payload = payload
    return this
  }

  characterMoved(userId: number, payload: any) {
    this.userId = userId

    this.userId = userId
    this.event = GameplayEvents.CHARACTER_MOVED
    this.payload = payload
    return this
  }

  gameInit(userId: number, payload: any) {
    this.userId = userId

    this.event = GameplayEvents.GAME_INIT
    this.payload = payload
    return this
  }

  gameQuited(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.GAME_QUITED
    this.payload = payload
    return this
  }

  characterAttributesChanged(userId: number, payload: any) {
    this.event = GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED
    this.userId = userId
    this.payload = payload

    return this
  }

  characterTired(userId: number, payload: any) {
    this.event = GameplayEvents.CHARACTER_TIRED
    this.userId = userId
    this.payload = payload
    return this
  }

  globalCharacterAttributesChanged(userId: number, payload: any) {
    this.event = GameplayEvents.GLOBAL_CHARACTER_ATTRIBUTES_CHANGED
    this.userId = userId
    this.payload = payload

    return this
  }

  characterMaxHealthReached(userId: number, payload: any) {
    this.event = GameplayEvents.CHARACTER_MAX_HEALTH_REACHED
    this.userId = userId
    this.payload = payload
    return this
  }

  characterDied(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.CHARACTER_DEAD
    this.payload = payload
    return this;
  }

  characterMaxEnduranceReached(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.CHARACTER_DEAD
    this.payload = payload
    return this;
  }

  itemsFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.ITEMS_FOUND
    this.payload = payload
    return this;
  }

  enemiesFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.ENEMIES_FOUND
    this.payload = payload
    return this;
  }

  randomEventFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.RANDOM_EVENT_FOUND
    this.payload = payload
    return this;
  }

  restCompleted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.REST_COMPLETED
    this.payload = payload
    return this;
  }
}
