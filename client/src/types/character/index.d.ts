export type CharacterData = {
  currentHealth: number,
  maxHealth: number,
  endurance: number,
  maxEndurance: number,
  balance: number,
  name: string,
  currentLocationId: number,
  status: "inVillage" | "inDungeon",
  peacezone_status: "idle",
  dungeon_status: "idle" | "inBattle" | "tired" | "dead" | "returning" | "looked",
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
