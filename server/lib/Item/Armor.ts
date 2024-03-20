import Item from "@/lib/Item/Item";
import {ItemType} from "@/lib/Item/types";

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
