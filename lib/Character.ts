import characterData from "./data/character.json"
import emitEvent from "@/lib/utils/events";
import {GameplayEvents} from "@/lib/utils/enums";
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
  status!: "idle" | "inBattle" | "inAction" | "tired"
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

    this.currentHealth = data.currentHealth ?? characterData.health[0]
    this.endurance = data.endurance ?? characterData.endurance
    this.maxHealth = data.maxHealth ?? characterData.health[1]
    this.balance = data.balance ?? characterData.balance
    this.name = data.name ?? characterData.name
    this.currentLocationId = data.currentLocationId ?? 1
    this.status = data.status ?? "idle"

    return this
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case GameplayEvents.MOVE_STARTED: {
        await this.handleMoveStarted(payload)
        break;
      }
      case GameplayEvents.ENEMIES_FOUND: {
        await this.handleEnemiesFound(payload)
        break;
      }
      case GameplayEvents.ATTACK_STARTED: {
        await this.handleAttackStarted(payload)
        break;
      }
      case GameplayEvents.GLOBAL_CHARACTER_ATTRIBUTES_CHANGED:
      case GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        await this.handleAttributesChange(payload)
        break;
      }
      case GameplayEvents.REST_COMPLETED:
      case GameplayEvents.MOVE_COMPLETED: {
        await this.handleMoveCompleted(payload)
        break;
      }
      case GameplayEvents.REST_STARTED: {
        this.endurance = this.maxEndurance
        this.status = "idle"
        await emitEvent(new StreamEvent().restCompleted(this.userId, payload), "gameplay")
        break
      }
      default: { return }
    }

    await this.dump()
  }

  async handleMoveStarted(payload: any) {
    const streamEvent = new StreamEvent()
    if (this.endurance > 0) {
      const newPayload = { ...payload, endurance: { type: "subtract", value: 1 } }
      await emitEvent(streamEvent.characterAttributesChanged(this.userId, newPayload), "gameplay")
      await this.changeLocation()
      await emitEvent(streamEvent.characterMoved(this.userId, payload), "gameplay")
    } else {
      this.status = "tired"
      await emitEvent(streamEvent.characterTired(this.userId, payload), "gameplay")
      await emitEvent(streamEvent.moveCompleted(this.userId, payload), "gameplay")
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
      default: {
        return []
      }
    }
  }

  async changeLocation() {
    const map = await new GameMap().load()

    let nextLocationId = (this.currentLocationId + 1) % (map.locations.length + 1)
    if (nextLocationId == 0) nextLocationId = 1
    this.currentLocationId = nextLocationId
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
          await emitEvent(streamEvent.characterMaxHealthReached(this.userId, payload),  "gameplay")
        } else if (newValue < 0) {
          this.currentHealth = 0
          await emitEvent(streamEvent.characterDied(this.userId, payload), "gameplay" )
        } else {
          this.currentHealth = newValue
        }
      }
      await this.dump();
    }

    if (endurance) {
      const { type, value } = endurance
      const maxEndurance = this.endurance === this.maxEndurance && type === "add"

      if (!maxEndurance) {
        const newValue = applyOperation(this.endurance, value, type)
        if (newValue >= this.maxEndurance) {
          this.endurance = this.maxEndurance
          await emitEvent(streamEvent.characterMaxEnduranceReached(this.userId, payload), "gameplay")
        } else if (newValue < 0) {
          this.endurance = 0
        } else {
          this.endurance = newValue
        }
      }

      await this.dump();
    }
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }

  private async handleEnemiesFound(payload: any) {
    this.status = "inBattle";
    await emitEvent(new StreamEvent().moveCompleted(this.userId, payload), "gameplay");
  }

  private async handleAttackStarted(payload: any) {
    const streamEvent = new StreamEvent()
    const newPayload = { ...payload, health: { type: "subtract", value: 1 } };
    await emitEvent(streamEvent.characterAttributesChanged(this.userId, newPayload), "gameplay");
    this.status = "idle"
    await emitEvent(streamEvent.attackCompleted(this.userId, payload), "gameplay")
  }

  private async handleMoveCompleted(_payload: any) {
    if(this.status === "inAction") this.status = "idle"
    await this.dump()
  }
}
