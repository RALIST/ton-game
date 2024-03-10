import {RedisStorage} from "@/lib/repositories/RedisStorage";
import {InventoryData} from "@/lib/game/Inventory";

export default class InventoryRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`inventory:${userId}`);
  }

  async loadInventoryData() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(inventoryData: InventoryData) {
    await this.storage.dump(inventoryData)
  }

  async update(data: Partial<InventoryData>) {
    await this.storage.update(data)
  }

  async append(arr: string, item: any) {
    await this.storage.append(arr, item);
  }
}
