import Item from "@/src/domain/entities/Item/Item";
import {ItemType} from "@/src/domain/entities/Item/types";

export default class Armor extends Item {
  armorClass!: number
  damageResistance!: number[]
  damageThreshold!: number[]
  perk!: number

  constructor() {
    super();
    this.type = ItemType.ARMOR
  }
}
