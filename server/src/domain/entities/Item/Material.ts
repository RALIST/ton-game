import {ItemType, MaterialType} from "@/src/domain/entities/Item/types";
import Item from "@/src/domain/entities/Item/Item";

export default class Material extends Item {
  extraType!: MaterialType

    constructor() {
      super();
      this.type = ItemType.MATERIAL
    }
}
