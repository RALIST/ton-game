import {RedisStorage} from "@/lib/utils/redis/RedisStorage";

export default class LoggerRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`logger:${userId}`);
  }

  async loadLoggerData() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(data: any) {
    await this.storage.dump(data)
  }

  async update(data: any) {
    await this.storage.update(data)
  }
  async append(arr: string, item: any) {
    await this.storage.append(arr, item);
  }
}
