import Item from "@/src/domain/entities/Item/Item";
import {CaliberType, DamageType, ItemType} from "@/src/domain/entities/Item/types";

export default class Weapon extends Item {
  minDamage!: number
  maxDamage!: number
  damageType!: DamageType
  minStr!: number
  actionPointCost!: number
  perk!: number
  ammoType!: number
  caliber!: CaliberType

  constructor() {
    super();
    this.type = ItemType.WEAPON
  }
}
