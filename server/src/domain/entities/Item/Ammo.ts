import Item from "@/src/domain/entities/Item/Item";
import {ItemType} from "@/src/domain/entities/Item/types";

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
