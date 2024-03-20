import Item from "@/lib/Item/Item";
import GameObject from "@/lib/GameObject/GameObject";
import {ObjectTypes} from "@/lib/GameObject/types";

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
