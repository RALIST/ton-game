import Item from "@/lib/game/Item";
import {fromType} from "@/lib/game/items/helpers";

export type InventoryItemData = {
  item: Item,
  count: number,
  equipped?: boolean
}

export default class InventoryItems {
  public static initialize(initData?: InventoryItemData[]) {
    if (initData) {
      return initData.map(invItem => {
        return {
          item: fromType(invItem.item),
          count: invItem.count,
          equipped: invItem.equipped
        }
      })
    }

    return []
  }
}
