export enum SkillType {
  RANGE_WEAPONS,
  UNARMED,
  MELEE_WEAPONS,
  FIRST_AID,
  DOCTOR,
  LOCKPICK,
  STEAL,
  SCIENCE,
  REPAIR,
  SPEECH,
  BARTER,
  GAMBLING,
  OUTDOORSMAN,
}

interface SkillList {
  [key: number]: Skill
}

export const gSkills: SkillList = {}

export default class Skill {
  id!: number
  name!: string
  defaultValue!: number
  statModifier!: number
  stat1!: number
  stat2!: number
  baseValueMult!: number
  experience!: number
  field28!: number

  public static async initialize() {
    console.log("Skills init")
    for(const skillId in Object.values(SkillType)) {
      if(!(SkillType[skillId] === undefined)) {
        gSkills[skillId] = new Skill()
      }
    }
  }

  constructor() {
    this.defaultValue = 5
  }
}
