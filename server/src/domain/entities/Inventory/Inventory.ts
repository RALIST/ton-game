import Item from "@/src/domain/entities/Item/Item";
import GameObject from "@/src/domain/entities/GameObject/GameObject";
import {ObjectTypes} from "@/src/domain/entities/GameObject/types";

interface InventoryItem {
  item: Item,
  quantity: number
}

export default class Inventory extends GameObject {
  items!: InventoryItem[]

  constructor() {
    super();
    this.pid = ObjectTypes.OBJ_TYPE_INVENTORY
  }
}
