import characterData from "./data/character.json"
import emitEvent from "@/lib/utils/events";
import {CharacterEvents, GameplayEvent} from "@/lib/utils/enums";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";

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
    if (event === GameplayEvent.MOVE_STARTED) {
      if (this.endurance > 0) {
        this.endurance = this.endurance - 1
        await emitEvent(CharacterEvents.ENDURANCE_CHANGED, payload, "gameplay")
      } else {
        await emitEvent(CharacterEvents.TIRED, payload, "gameplay")
      }
    }
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }

  recoverEndurance() {
    setInterval(() => {
      if (this.endurance < this.maxEndurance) {
        this.endurance = this.endurance + 1
        this.dump()
      }
    }, 1000 * this.enduranceRecoverySpeed * 60)
  }

  recoverHealth() {
    setInterval(() => {
      if (this.currentHealth < this.maxHealth) {
        this.currentHealth = this.currentHealth + 10
        this.dump()
      }
    }, 1000 * this.healthRecoverySpeed * 60)
  }
}
