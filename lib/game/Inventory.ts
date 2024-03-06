import InventoryRepository from "@/lib/repositories/InventoryRepository";
import InventoryItems, {InventoryItemData} from "@/lib/game/InventoryItems";

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
}
