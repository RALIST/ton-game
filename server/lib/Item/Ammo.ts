import Item from "@/lib/Item/Item";
import {ItemType} from "@/lib/Item/types";

export default class Ammo extends Item {
  quantity!: number
  armorClassModifier!: number
  damageResistanceModifier!: number
  damageMultiplier!: number

  constructor() {
    super();
    this.type = ItemType.AMMO
  }
}
