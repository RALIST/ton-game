import {RedisStorage} from "@/lib/utils/redis/RedisStorage";
import {Inventory} from "@/lib/Inventory/types";

export default class InventoryRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`inventory:${userId}`);
  }

  async loadInventoryData() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(inventoryData: Inventory) {
    await this.storage.dump(inventoryData)
  }

  async update(data: Partial<Inventory>) {
    await this.storage.update(data)
  }

  async append(arr: string, item: any) {
    await this.storage.append(arr, item);
  }
}
