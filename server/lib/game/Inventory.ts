import InventoryRepository from "@/lib/repositories/InventoryRepository";
import InventoryItems, {InventoryItemData} from "@/lib/game/InventoryItems";
import Weapon from "@/lib/game/items/Weapon";
import Armor from "@/lib/game/items/Armor";

export type InventoryData = {
  userId: number,
  items: InventoryItemData[]
}

export default class Inventory {
  userId: number
  items!: InventoryItemData[]
  repo: InventoryRepository

  public static async initialize(userId: number) {
    return await new Inventory(userId).load()
  }

  constructor(userId: number) {
    this.userId = userId
    this.repo = new InventoryRepository(userId)
  }

  async load() {
    const data = await this.repo.loadInventoryData()
    this.items = InventoryItems.initialize(data?.items)
    if (!data) await this.repo.dump(this)

    return this
  }

  async equip(id: number) {
    const item = this.items.find(item => item.item.id === id);
    if (item) {
      if ((item.item instanceof Weapon) || (item.item instanceof Armor)) {
        this.items
          .filter(invitem => invitem.item.itemType === item.item.itemType)
          .map(invitem => invitem.equipped = false)
      }

      item.equipped = true;
      await this.repo.update({items: this.items})
    }
  }

  async unequip(id: number) {
    const item = this.items.find(item => item.item.id === id);
    if (item) {
      item.equipped = false;
      await this.repo.update({items: this.items});
    }
  }

  async addItem(inventoryItem: InventoryItemData) {
    const item = this.items.find(item => item.item.id === inventoryItem.item.id)
    if (item && item.item.stackable) {
      item.count += inventoryItem.count;
      await this.repo.update({items: this.items})
    } else {
      await this.repo.append("items", {item: inventoryItem.item, count: inventoryItem.count});
    }
  }
}
