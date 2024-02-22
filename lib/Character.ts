import characterData from "./data/character.json"

export class Character {
  userId: number;
  name!: string;
  health!: number[];
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  balance!: number;
  location!: string
  maxEndurance!: number
  enduranceRecoverySpeed!: number

  constructor(id: number) {
    this.userId = id
    this.maxEndurance = 100
    this.enduranceRecoverySpeed = 5 // minutes to recover 1 endurance
  }

  // find character in DB and return initiated class
  async load(): Promise<this> {
    this.name = characterData.name
    this.balance = characterData.balance
    this.health = characterData.health
    this.maxHealth = characterData.health[1]
    this.currentHealth = characterData.health[0]
    this.location = characterData.location
    this.endurance = characterData.endurance

    return this
  }

  recoverEndurance() {
    setInterval(() => {
      if (this.endurance < this.maxEndurance) {
        this.endurance = this.endurance + 1
      }
    }, 1000 * 5 * 60)
  }
}
