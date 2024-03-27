import RedisStorage from "@/src/infrostructure/databases/redis/RedisStorage";

export default class ObjectRepository {
  private storage!: RedisStorage

  id: number
  key: string

  constructor(id: number, name: string) {
    this.storage = new RedisStorage();
    this.id = id
    this.key = `objects:${name}:${id}`
  }

  async load() {
    const data = await this.storage.load(this.key)
    return data || null;
  }

  async save(data: any) {
    await this.storage.dump(this.key, data)
  }

  async update(data: Partial<any>) {
    await this.storage.update(this.key, data)
  }
}
