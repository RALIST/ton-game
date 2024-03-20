import RedisStorage from "@/lib/utils/redis/RedisStorage";
import {Inventory} from "@/lib/Inventory/types";

export default class InventoryRepository {
  private storage!: RedisStorage
  userId: number

  constructor(userId: number) {
    this.storage = new RedisStorage();
    this.userId = userId
  }

  async loadInventoryData() {
    const data = await this.storage.load(`inventory:${this.userId}`)
    return data || null;
  }

  async dump(inventoryData: Inventory) {
    await this.storage.dump(`inventory:${this.userId}`, inventoryData)
  }

  async update(data: Partial<Inventory>) {
    await this.storage.update(`inventory:${this.userId}`, data)
  }

  async append(arr: string, item: any) {
    await this.storage.append(`inventory:${this.userId}`, arr, item);
  }
}
