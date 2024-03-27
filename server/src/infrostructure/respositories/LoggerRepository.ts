import RedisStorage from "@/src/infrostructure/databases/redis/RedisStorage";

export default class LoggerRepository {
  private storage!: RedisStorage
  userId: number

  constructor(userId: number) {
    this.storage = new RedisStorage();
    this.userId = userId
  }

  async loadLoggerData() {
    const data = await this.storage.load(`logger:${this.userId}`)
    return data || null;
  }

  async dump(data: any) {
    await this.storage.dump(`logger:${this.userId}`, data)
  }

  async update(data: any) {
    await this.storage.update(`logger:${this.userId}`, data)
  }
  async append(arr: string, item: any) {
    await this.storage.append(`logger:${this.userId}`, arr, item);
  }
}
