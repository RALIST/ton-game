import characterData from "./data/character.json"
import {CharacterEvents} from "@/lib/utils/gameEvents";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {applyOperation} from "@/lib/utils/helpers";
import {GameMap} from "@/lib/GameMap";
import {GameLocation} from "@/lib/GameLocation";
import StreamEvent from "@/lib/streams/StreamEvent";

export class Character implements WithRedisStorage{
  userId: number;
  name!: string;
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  balance!: number;
  maxEndurance!: number
  enduranceRecoverySpeed!: number
  healthRecoverySpeed!: number;
  currentLocationId!: number
  status!: "idle" | "inBattle" | "inAction" | "tired" | "looked" | "dead"
  storage!: RedisStorage

  constructor(id: number) {
    this.userId = id
    this.enduranceRecoverySpeed = 0.01// minutes to recover 1 endurance
    this.healthRecoverySpeed = 0.01 // minutes to recovery health
    this.storage = new RedisStorage(`character:${this.userId}`)
    this.maxEndurance = 100
  }

  // find character in DB and return initiated class
  async load(): Promise<this> {
    const data = await this.storage.load()
    this.currentHealth = data?.currentHealth ?? characterData.health[0]
    this.endurance = data?.endurance ?? characterData.endurance
    this.maxHealth = data?.maxHealth ?? characterData.health[1]
    this.balance = data?.balance ?? characterData.balance
    this.name = data?.name ?? characterData.name
    this.currentLocationId = data?.currentLocationId ?? 1
    this.status = data?.status ?? "idle"

    return this
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async update(data: any) {
    await this.storage.update(data)
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case CharacterEvents.MOVE_STARTED: {
        await this.handleMoveStarted(payload)
        break;
      }
      case CharacterEvents.ATTACK_STARTED: {
        await this.handleAttackStarted(payload)
        break;
      }
      case CharacterEvents.ENEMIES_FOUND: {
        await this.handleEnemiesFound(payload)
        break;
      }
      case CharacterEvents.RANDOM_EVENT_FOUND: {
        await new StreamEvent().actionCompleted(this.userId, {status: "idle"}).send()
        break;
      }
      case CharacterEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        await this.handleAttributesChange(payload)
        break;
      }
      case CharacterEvents.REST_STARTED: {
        await this.update({currentHealth: this.maxHealth, endurance: this.maxEndurance})
        await new StreamEvent().restCompleted(this.userId, payload).send()
        await new StreamEvent().actionCompleted(this.userId, payload).send()
        break;
      }
      case CharacterEvents.ACTION_COMPLETED: {
        await this.handleActionCompleted(payload)
        break;
      }
      default: { return }
    }
  }

  async handleMoveStarted(payload: any) {
    const streamEvent = new StreamEvent()
    if (this.endurance > 0) {
      const newPayload = { ...payload, endurance: { type: "subtract", value: 1 } }
      await streamEvent.characterAttributesChanged(this.userId, newPayload).send()
      await this.changeLocation()
      await streamEvent.characterMoved(this.userId, payload).send()
    } else {
      await streamEvent.characterTired(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "tired"}).send()
    }
  }

  getAvailableAction(): string[] {
    switch(this.status) {
      case "idle": {
        return ["move", "look"]
      }
      case "inBattle": {
        return ["attack", "run"]
      }
      case "tired": {
        return ["rest"]
      }
      case "dead": {
        return ["rest"]
      }
      case "looked": {
        return ["move"]
      }
      default: {
        return []
      }
    }
  }

  async changeLocation() {
    const map = await new GameMap().load()

    let nextLocationId = (this.currentLocationId + 1) % (map.locations.length + 1)
    if (nextLocationId == 0) nextLocationId = 1
    await this.update({currentLocationId: nextLocationId})
  }

  async currentLocation(): Promise<GameLocation> {
    const map = await new GameMap().load()
    const location =  map.locations.find((location) => location.id === this.currentLocationId)
    return location || map.locations[0]
  }

  private async handleAttributesChange(payload: {
    health: {value: number, type: string } ,
    endurance: {value: number, type: string }
  }) {
    const streamEvent = new StreamEvent()
    const {health, endurance} = payload
    if (health) {
      const { type, value } = health
      const maxHealth = this.currentHealth === this.maxHealth && type === "add"

      if (!maxHealth) {
        const newValue = applyOperation(this.currentHealth, value, type)
        if (newValue >= this.maxHealth) {
          this.currentHealth = this.maxHealth
          await streamEvent.characterMaxHealthReached(this.userId, payload).send()
        } else if (newValue < 0) {
          this.currentHealth = 0
          await streamEvent.characterDied(this.userId, payload).send()
          await streamEvent.actionCompleted(this.userId, {status: "dead"}).send()
        } else {
          this.currentHealth = newValue
        }
      }

      await this.update({currentHealth: this.currentHealth})
    }

    if (endurance) {
      const { type, value } = endurance
      const maxEndurance = this.endurance === this.maxEndurance && type === "add"

      if (!maxEndurance) {
        const newValue = applyOperation(this.endurance, value, type)
        if (newValue >= this.maxEndurance) {
          this.endurance = this.maxEndurance
          await streamEvent.characterMaxEnduranceReached(this.userId, payload).send()
        } else if (newValue < 0) {
          this.endurance = 0
        } else {
          this.endurance = newValue
        }
      }

      await this.update({endurance: this.endurance})
    }
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }

  private async handleEnemiesFound(_payload: any) {
    await new StreamEvent().actionCompleted(this.userId, {status: "inBattle"}).send()
  }

  private async handleAttackStarted(payload: any) {
    const streamEvent = new StreamEvent()
    const newPayload = { ...payload, health: { type: "subtract", value: 1 } };
    await streamEvent.characterAttributesChanged(this.userId, newPayload).send()
    await streamEvent.attackCompleted(this.userId, payload).send()
    await streamEvent.actionCompleted(this.userId, {status: "idle"}).send()
  }

  private async handleActionCompleted(payload: any) {
    this.status = payload?.status ?? "idle"
    await this.update({status: this.status})
  }
}
