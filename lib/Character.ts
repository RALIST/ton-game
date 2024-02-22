

import characterData from "./data/character.json"

export class Character {
  userId: number;
  name!: string;
  health!: number[];
  endurance!: number;
  balance!: number;
  location!: string

  constructor(id: number) {
    this.userId = id
  }

  async init(): Promise<this> {
    // find character in DB and return initiated class
    // prisma.character.findUniq({where: userId: this.userId})

    this.name = characterData.name
    this.balance = characterData.balance
    this.health = characterData.health
    this.location = characterData.location
    this.endurance = characterData.endurance

    return this
  }
}
