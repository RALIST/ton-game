import {InventoryItem} from "@/lib/Inventory/types";
import {itemFromType} from "@/lib/Inventory/helpers";

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
