import characterData from "./data/character.json"
import emitEvent from "@/lib/utils/events";
import {GameplayEvents} from "@/lib/utils/enums";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {applyOperation} from "@/lib/utils/helpers";

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

    return this
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case GameplayEvents.MOVE_STARTED: {
        if (this.endurance > 0) {
          const newPayload = { ...payload, endurance: { type: "subtract", value: 1 } }
          await emitEvent(GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED, newPayload, "gameplay")
          await emitEvent(GameplayEvents.CHARACTER_MOVED, payload, "gameplay")
        } else {
          await emitEvent(GameplayEvents.CHARACTER_TIRED, payload, "gameplay")
          await emitEvent(GameplayEvents.MOVE_COMPLETED, payload, "gameplay")
        }
        break;
      }
      case GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        await this.handleAttributesChange(payload)
        break;
      }
      default: { return }
    }
  }

  async handleAttributesChange({health ,endurance}: {
    health: {value: number, type: string },
    endurance: {value: number, type: string }
  }) {
    if (health) {
      const { type, value } = health
      const maxHealth = this.currentHealth == this.maxHealth && type === "add"
      if (!maxHealth) {
        const newValue = applyOperation(this.currentHealth, value, type)
        if (newValue >= this.maxHealth) {
          this.currentHealth = this.maxHealth
          await emitEvent(GameplayEvents.CHARACTER_MAX_HEALTH_REACHED, {userId: this.userId}, "gameplay")
        } else if (newValue < 0) {
          this.currentHealth = 0
          await emitEvent(GameplayEvents.CHARACTER_DEAD,{userId: this.userId}, "gameplay" )
        } else {
          this.currentHealth = newValue
        }
      }
    }
    if (endurance) {
      const { type, value } = endurance
      const maxEndurance = this.endurance === this.maxEndurance && type === "add"

      if (!maxEndurance) {
        const newValue = applyOperation(this.endurance, value, type)
        if (newValue >= this.maxEndurance) {
          this.endurance = this.maxEndurance
          await emitEvent(GameplayEvents.CHARACTER_MAX_ENDURANCE_REACHED, {userId: this.userId}, "gameplay")
        } else if (newValue < 0) {
          this.endurance = 0
        } else {
          this.endurance = newValue
        }
      }
    }

    await this.dump()
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }
}
