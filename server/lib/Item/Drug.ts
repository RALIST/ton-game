import {ItemType} from "@/lib/Item/types";
import Item from "@/lib/Item/Item";

export default class Drug extends Item {
  stat!: number[]
  amount!: number[]
  duration!: number

  constructor() {
    super();
    this.type = ItemType.DRUG
  }
}
