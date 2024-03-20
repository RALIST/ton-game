export type CharacterType = {
  currentHealth: number,
  maxHealth: number,
  endurance: number,
  maxEndurance: number,
  balance: number,
  name: string,
  currentLocationId: number,
  skills: CharacterSkill[],
  perks: Perk[],
  attributes: CharacterAttribute[]
}

export type CharacterAttribute = {
  name: string,
  description: string,
  value: number
}

export type CharacterSkill = {
  skill: Skill,
  level: number,
  exp: number
}
