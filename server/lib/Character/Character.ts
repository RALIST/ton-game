import GameObject from "@/lib/GameObject/GameObject";
import {ObjectTypes} from "@/lib/GameObject/types";
import {gSkills} from "@/lib/Skill/Skill";
import characters from "./characters.json"
import {AttributeType} from "@/lib/Attribute/types";
import {StatType} from "@/lib/Stat/types";
import {gAttributes} from "@/lib/Attribute/Attribute";
import {gStats} from "@/lib/Stat/Stat";
import CharacterRepository from "@/lib/Character/CharacterRepository";

interface Characters {
  [key: number]: Character
}

export const gCharacters: Characters = {}
const SP_PER_LEVEL = 5
const BASE_HP_PER_LEVEL = 20

export default class Character extends GameObject {
  name!: string;
  attributes!: number[];
  stats!: number[];
  bonusStats!: number[] // some stats that can be changed by environment
  skills!: number[];
  traits!: number[]
  perks!: number[]
  isPlayer!: boolean
  aiCombatPreset!: number
  experience!: number // exp for killing character
  repo!: CharacterRepository

  public static async initialize() {
    console.log("Characters loading...")
    gCharacters[0] = await new Character().load()
  }

  constructor() {
    super();
    this.pid = ObjectTypes.OBJ_TYPE_CHARACTER
    this.id = characters.length + 1
    this.repo = new CharacterRepository(this.id, false)
  }

  async load() {
    const data = await this.repo.load()
    if (data) {
      this.name = data.name
      this.attributes = data.attributes
      this.stats = data.stats
      this.bonusStats = data.bonusStats
      this.isPlayer = data.isPlayer
      this.traits = data.traits
      this.perks = data.perks
      this.skills = data.skills
      this.id = data.id
      this.aiCombatPreset = data.aiCombatPreset
      this.experience = data.experience
      this.updateDerivedStats()
    } else {
      this.reset()
    }

    return this
  }

  async save() {
    await this.repo.save(this)
  }

  reset() {
    this.attributes = Object.values(gAttributes).map(attr => attr.defaultValue)
    this.stats = Object.values(gStats).map(stat => stat.defaultValue)
    this.bonusStats = Object.values(gStats).map(() => 0)
    this.skills = Object.values(gSkills).map(skill => skill.defaultValue)
    this.traits = []
    this.perks = []
    this.updateDerivedStats()
  }

  getExpForKill() {
    return this.experience * this.getStat(StatType.LEVEL)
  }

  getAttribute(attr: AttributeType) {
    let value = this.attributes[attr]
    value += this.getPerkAttrModifier(attr)
    value += this.getTraitAttrModifier(attr)

    if (value >= gAttributes[attr].maxValue) return gAttributes[attr].maxValue

    return value
  }

  setAttribute(attr: AttributeType, value: number) {
    this.attributes[attr] = value
    this.updateDerivedStats()
    this.save().then(_ => {console.log("Attribute saved!")})
  }

  incAttribute(attr: AttributeType) {
    this.setAttribute(attr, this.getAttribute(attr) + 1)
  }

  decAttribute(attr: AttributeType) {
    this.setAttribute(attr, this.getAttribute(attr) - 1)
  }

  getStat(stat: StatType) {
    let value = 0

    value += this.getStatWithModifier(stat)
    value += this.getBonusStat(stat)

    if (value >= gStats[stat].maxValue) return gStats[stat].maxValue

    return value
  }

  setStat(stat: StatType, value: number) {
    this.stats[stat] = value

    switch(stat) {
      case StatType.EXPERIENCE: {
        this.setExp(value);
        break;
      }
      default: {
        return
      }
    }

    this.save().then(r => {console.log(`Stat ${StatType[stat]} updated by ${value}!`)})
  }

  // get base stat with some modifiers, eg perks or some effects
  getStatWithModifier(stat: StatType) {
    let value = this.stats[stat]
    value += this.getTraitStatModifier(stat)
    value += this.getPerkStatModifier(stat)

    return value
  }

  getTraitStatModifier(stat: StatType) {
    return 0
  }

  getPerkStatModifier(stat: StatType) {
    return 0
  }

  getTraitAttrModifier(attr: AttributeType) {
    return 0
  }

  getPerkAttrModifier(attr: AttributeType) {
    return 0
  }

  setBonusStat(stat: StatType, value: number) {
    this.bonusStats[stat] = value
  }

  getBonusStat(stat: StatType) {
    return this.bonusStats[stat];
  }

  setExp(value: number) {
    const oldLevel = this.getStat(StatType.LEVEL)
    let level = oldLevel + 1

    while (value >= this.getExpForLevel(level)) {
      level += 1
      this.setStat(StatType.LEVEL, level - 1)
      this.levelUp()

    }
  }

  levelUp() {
    const endurance = this.getAttribute(AttributeType.ENDURANCE)
    const strength = this.getAttribute(AttributeType.STRENGTH)

    const hpBefore = this.getStat(StatType.MAXIMUM_HIT_POINTS)
    const hpPerLevel = Math.floor((endurance + strength) / 2 + BASE_HP_PER_LEVEL)
    const currentLevel = this.getStat(StatType.LEVEL)
    this.setBonusStat(StatType.MAXIMUM_HIT_POINTS, hpPerLevel * currentLevel)

    // get skill points
    this.setStat(StatType.UNSPENT_SKILL_POINTS, this.getStat(StatType.UNSPENT_SKILL_POINTS) + SP_PER_LEVEL);

    // adjust new hp
    const hpAfter = this.getStat(StatType.MAXIMUM_HIT_POINTS)
    this.adjustHitPoints(hpAfter - hpBefore)
  }

  getTotalMaximumHitPoints() {
    return this.getStat(StatType.MAXIMUM_HIT_POINTS) + this.getBonusStat(StatType.MAXIMUM_HIT_POINTS)
  }

  private updateDerivedStats() {
    const strength = this.getAttribute(AttributeType.STRENGTH)
    const endurance = this.getAttribute(AttributeType.ENDURANCE);
    const agility = this.getAttribute(AttributeType.AGILITY);
    const luck = this.getAttribute(AttributeType.LUCK);
    const perception = this.getAttribute(AttributeType.PERCEPTION);

    this.setStat(StatType.MAXIMUM_HIT_POINTS, strength + endurance * 2 + 15)
    this.setStat(StatType.MAXIMUM_ACTION_POINTS, Math.floor(agility / 2 + 5))
    this.setStat(StatType.ARMOR_CLASS, agility)
    this.setStat(StatType.CARRY_WEIGHT, 25 * strength + 25)
    this.setStat(StatType.MELEE_DAMAGE, Math.max(strength - 5, 1))
    this.setStat(StatType.HEALING_RATE, Math.floor(Math.max(endurance / 3, 1)))
    this.setStat(StatType.SEQUENCE, 2 * perception )
    this.setStat(StatType.CRITICAL_CHANCE, luck)
    this.setStat(StatType.RADIATION_RESISTANCE, 2 * endurance)
    this.setStat(StatType.POISON_RESISTANCE, 5 * endurance)
  }

  adjustHitPoints(hp: number) {
    const maxHp = this.getTotalMaximumHitPoints()
    const currentHp = this.getStat(StatType.CURRENT_HIT_POINTS)
    const newHp = currentHp + hp

    if (newHp > maxHp) {
      this.setStat(StatType.CURRENT_HIT_POINTS, maxHp)
    } else if (newHp < 0) {
      this.setStat(StatType.CURRENT_HIT_POINTS, 0)
      this.kill()
    } else {
      this.setStat(StatType.CURRENT_HIT_POINTS, newHp)
    }
  }

  getExpForLevel(level: number) {
    const mod = level / 2
    return Math.floor(1000 * mod * (level - 1))
  }

  addExp(exp: number) {
    const oldExp = this.getStat(StatType.EXPERIENCE)
    const newExp = oldExp + exp
    this.setStat(StatType.EXPERIENCE, newExp);
  }

  healOverTime() {
    if (this.getStat(StatType.CURRENT_HIT_POINTS) < this.getStat(StatType.MAXIMUM_HIT_POINTS)) {
      this.adjustHitPoints(this.getStat(StatType.HEALING_RATE))
    }
  }

  kill() {
    if (this.isPlayer) {
      console.log("Game Over");
    } else {
      this.reset();
      console.log("Character killed");
    }
  }

  printStats() {
    console.log("---------------------------")
    console.log("Character:", this.name)

    this.attributes.map((attr, index) => {
      console.log(`${AttributeType[index]}: ${this.getAttribute(index)}`)
    })

    this.stats.map((stat, index) => {
      console.log(`${StatType[index]}: ${this.getStat(index)}`)
    })

    this.bonusStats.map((stat, index) => {
      console.log(`BONUS STAT: ${StatType[index]}: ${this.getBonusStat(index)}`)
    })
    console.log("---------------------------")
  }
}
