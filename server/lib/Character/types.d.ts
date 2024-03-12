export type Character = {
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

export type Perk = {
  id: number
  name: string
  description: string
}

export type Skill = {
  id: number
  name: string
  description: string
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
