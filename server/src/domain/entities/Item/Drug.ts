import {ItemType} from "@/src/domain/entities/Item/types";
import Item from "@/src/domain/entities/Item/Item";

export default class Drug extends Item {
  stat!: number[]
  amount!: number[]
  duration!: number

  constructor() {
    super();
    this.type = ItemType.DRUG
  }
}
