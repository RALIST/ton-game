import {StatType} from "@/lib/Stat/types";

interface IStats {
  [key: number] : Stat
}

export const gStats: IStats = {}

export default class Stat {
  id!: StatType
  name!: string
  description!: string
  maxValue!: number
  minValue!: number
  defaultValue!: number

  static async initialize() {
    console.log("Stats loading...")
    for(let i = 0; i < StatType.STAT_LENGTH; i++) {
      const type = StatType[i]
      if(type === undefined) return

      gStats[i] = new Stat(i, type)
    }
  }

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.reset();
  }

  reset() {
    this.defaultValue = 0
    this.minValue = 1
    this.maxValue = Number.MAX_SAFE_INTEGER

    switch(this.id) {
      case StatType.CURRENT_HIT_POINTS: {
        this.defaultValue = 10
        break;
      }
      case StatType.LEVEL: {
        this.defaultValue = 1;
        break;
      }
      case StatType.AGE: {
        this.defaultValue = 20;
        break;
      }
      default: {
        return
      }
    }
  }
}
