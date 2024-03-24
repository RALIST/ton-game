import Stat from "@/lib/Stat/Stat";
import {AttributeType, MAIN_STAT_DEFAULT_VALUE, MAIN_STAT_MAX_VALUE, MAIN_STAT_MIN_VALUE} from "@/lib/Attribute/types";

interface Attributes {
  [key: number]: Attribute
}

export const gAttributes: Attributes = {}

export default class Attribute extends Stat {
  constructor(id: number, name: string) {
    super(id, name);
    this.minValue = MAIN_STAT_MIN_VALUE
    this.maxValue = MAIN_STAT_MAX_VALUE
    this.defaultValue = MAIN_STAT_DEFAULT_VALUE
  }

  static async initialize() {
    console.log("Attributes loading...")

    for(const statId in Object.values(AttributeType)) {
      if (!(AttributeType[statId] === undefined)) {
        const _attr = new Attribute(Number(statId), AttributeType[statId])
        _attr.minValue = 1
        _attr.maxValue = Number.MAX_SAFE_INTEGER
        _attr.defaultValue = 5

        gAttributes[statId] = _attr
      }
    }
  }
}
