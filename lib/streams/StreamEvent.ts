import {GameplayEvents} from "@/lib/utils/gameEvents";
import {EventStore} from "@/lib/EventStore";

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

  async send() {
    if (!this.userId && !this.event) throw "Provide userId and event to send!"

    const eventStore = new EventStore(this.userId)
    await eventStore.emitEvent(this, "gameplay")
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

  nothingFound(userId: number, payload: any) {
    this.userId = userId
    this.event = GameplayEvents.NOTHING_FOUND
    this.payload = payload
    return this
  }

  actionCompleted(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameplayEvents.ACTION_COMPLETED
    return this
  }

  runCompleted(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameplayEvents.RUN_COMPLETED
    return this
  }

  dangerEventFound(userId: number, payload: any) {
    this.userId = userId
    this.payload = payload
    this.event = GameplayEvents.DANGER_EVENT_FOUND
    return this
  }

  itemAdded(userId: number, payload: { item: number }) {
    this.userId = userId
    this.payload = payload
    this.event = GameplayEvents.ITEM_ADDED
    return this
  }
}
