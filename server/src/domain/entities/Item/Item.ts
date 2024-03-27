import {ItemFlags, ItemType} from "@/src/domain/entities/Item/types";
import GameObject from "@/src/domain/entities/GameObject/GameObject";
import {ObjectTypes} from "@/src/domain/entities/GameObject/types";

interface Items {
  [key: number]: Item
}

export const gItems: Items = {}

export default class Item extends GameObject {
  type!: ItemType
  cost!: number
  weight!: number
  size!: number

  constructor() {
    super();
    this.pid = ObjectTypes.OBJ_TYPE_ITEM
  }

  public static async initialize() {
    console.log("Items init")
    gItems[0] = new Item()
  }

  get equipped() {
    if (this.type !== (ItemType.ARMOR || ItemType.WEAPON)) return false
    return (this.flags & ItemFlags.OBJECT_EQUIPPED) === ItemFlags.OBJECT_EQUIPPED
  }
}
