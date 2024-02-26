import characterData from "./data/character.json"
import {redis} from "@/lib/utils/redis";
import emitEvent from "@/lib/utils/events";
import {CharacterEvents, GameplayEvent} from "@/lib/utils/enums";

export class Character {
  userId: number;
  name!: string;
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  balance!: number;
  maxEndurance!: number
  enduranceRecoverySpeed!: number
  healthRecoverySpeed!: number;

  constructor(id: number) {
    this.userId = id
    this.enduranceRecoverySpeed = 0.01// minutes to recover 1 endurance
    this.healthRecoverySpeed = 0.01 // minutes to recovery health
  }

  // find character in DB and return initiated class
  async load(): Promise<this> {
    const data = JSON.parse(await redis.get(`character:${this.userId}`) || "{}")

    this.currentHealth = data.currentHealth || characterData.health[0]
    this.endurance = data.endurance || characterData.endurance
    this.maxHealth = data.maxHealth || characterData.health[1]
    this.balance = data.balance || characterData.balance
    this.name = data.name || characterData.name

    return this
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

  async dump() {
    await redis.set(`character:${this.userId}`, JSON.stringify(this))
  }

  recoverEndurance() {
    setInterval(() => {
      if (this.endurance < this.maxEndurance) {
        this.endurance = this.endurance + 1
      }
    }, 1000 * this.enduranceRecoverySpeed * 60)
  }

  recoverHealth() {
    setInterval(() => {
      if (this.currentHealth < this.maxHealth) {
        this.currentHealth = this.currentHealth + 10
      }
    }, 1000 * this.healthRecoverySpeed * 60)
  }
}
