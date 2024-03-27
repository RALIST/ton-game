export enum CharacterFlags {
  BARTER = 0x02,
  NO_STEAL = 0x20,
  NO_DROP = 0x40,
  NO_LIMBS = 0x80,
  NO_AGE = 0x100,
  NO_HEAL = 0x200,
  INVULNERABLE = 0x400,
  FLAT = 0x800,
  SPECIAL_DEATH = 0x1000,
  LONG_LIMBS = 0x2000,
  NO_KNOCKBACK = 0x4000,
}

export enum CharacterStates {
  ROUTE,
  SETTLEMENT,
  REST
}
