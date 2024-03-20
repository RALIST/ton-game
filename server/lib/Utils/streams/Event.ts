import {GameEvents} from "@/lib/Game/GameEvents";
import {EventStore} from "@/lib/Utils/EventStore";

export default class Event {
  userId!: number
  event!: string
  payload!: any
  id!: number

  constructor(userId?: number, event?: string, payload?: any) {
    if(userId) this.userId = userId
    if(event) this.event = event
    if(payload) this.payload = payload
  }

  async send() {
    if (!this.userId && !this.event) throw "Provide userId and event to send!"

    const eventStore = new EventStore(this.userId)
    await eventStore.emitEvent(this)
  }

  moveStarted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.CHARACTER_MOVE_STARTED
    this.payload = payload
    return this
  }

  moveCompleted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.CHARACTER_MOVE_COMPLETED
    this.payload = payload
    return this
  }

  lookStarted(userId: number,payload: any) {
    this.userId = userId
    this.event = GameEvents.LOOK_STARTED
    this.payload = payload
    return this
  }

  lookCompleted(userId: number,payload: any) {
    this.userId = userId

    this.event = GameEvents.LOOK_COMPLETED
    this.payload = payload
    return this
  }

  attackStarted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.CHARACTER_ATTACK_STARTED
    this.payload = payload
    return this
  }

  attackCompleted(userId: number, payload: any) {
    this.userId = userId

    this.event = GameEvents.CHARACTER_ATTACK_COMPLETED
    this.payload = payload
    return this
  }

  runStarted(userId: number, payload: any) {
    this.userId = userId

    this.event = GameEvents.CHARACTER_RUN_STARTED
    this.payload = payload
    return this
  }

  characterMoved(userId: number, payload: any) {
    this.userId = userId

    this.userId = userId
    this.event = GameEvents.CHARACTER_MOVED
    this.payload = payload
    return this
  }

  gameInit(userId: number, payload: any) {
    this.userId = userId

    this.event = GameEvents.GAME_INIT
    this.payload = payload
    return this
  }

  gameQuited(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.GAME_QUITED
    this.payload = payload
    return this
  }

  characterAttributesChanged(userId: number, payload: any) {
    this.event = GameEvents.CHARACTER_ATTRIBUTES_CHANGED
    this.userId = userId
    this.payload = payload

    return this
  }

  characterTired(userId: number, payload: any) {
    this.event = GameEvents.CHARACTER_TIRED
    this.userId = userId
    this.payload = payload
    return this
  }

  globalCharacterAttributesChanged(userId: number, payload: any) {
    this.event = GameEvents.GLOBAL_CHARACTER_ATTRIBUTES_CHANGED
    this.userId = userId
    this.payload = payload

    return this
  }

  characterMaxHealthReached(userId: number, payload: any) {
    this.event = GameEvents.CHARACTER_MAX_HEALTH_REACHED
    this.userId = userId
    this.payload = payload
    return this
  }

  characterDied(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.CHARACTER_DEAD
    this.payload = payload
    return this;
  }

  characterMaxEnduranceReached(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.CHARACTER_DEAD
    this.payload = payload
    return this;
  }

  itemsFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.ITEMS_FOUND
    this.payload = payload
    return this;
  }

  enemiesFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.ENEMIES_FOUND
    this.payload = payload
    return this;
  }

  randomEventFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.RANDOM_EVENT_FOUND
    this.payload = payload
    return this;
  }

  restCompleted(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.REST_COMPLETED
    this.payload = payload
    return this;
  }

  nothingFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameEvents.NOTHING_FOUND
    this.payload = payload
    return this
  }

  actionCompleted(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameEvents.CHARACTER_ACTION_COMPLETED
    return this
  }

  runCompleted(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameEvents.CHARACTER_RUN_COMPLETED
    return this
  }

  dangerEventFound(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameEvents.DANGER_EVENT_FOUND
    return this
  }

  itemAdded(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameEvents.ITEM_ADDED
    return this
  }

  dungeonStopped(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameEvents.DUNGEON_STOPPED
    return this
  }
}
