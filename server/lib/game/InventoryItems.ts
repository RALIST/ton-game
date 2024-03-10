import {itemFromType} from "@/lib/game/items/helpers";
import type {InventoryItem} from "@/types/gameplay";

export default class InventoryItems {
  public static initialize(initData?: InventoryItem[]) {
    if (initData) {
      return initData.map(invItem => {
        return {
          item: itemFromType(invItem.item),
          count: invItem.count,
          equipped: invItem.equipped
        }
      })
    }
    return []
  }
}
