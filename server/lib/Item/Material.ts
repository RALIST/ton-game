import Item from "@/lib/Item/Item";
import {ItemType, MaterialType} from "@/lib/Item/types";

export default class Material extends Item {
  extraType!: MaterialType

    constructor() {
      super();
      this.type = ItemType.MATERIAL
    }
}
