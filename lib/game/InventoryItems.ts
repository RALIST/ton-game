import Item from "@/lib/game/Item";

export type InventoryItemData = {
  item: Item,
  count: number,
}

export default class InventoryItems {
  public static initialize(initData?: InventoryItemData[]) {
    if (initData) return initData

    return []
  }
}
