import RedisSingleton from "@/lib/utils/redis/RedisSingleton";

export interface IStorage {
  model: string;
  load(): Object
  dump(data: any): void
  update(data: any): void
  append(arr: string, item: any): void
}

export interface WithRedisStorage {
  storage: RedisStorage
}

export class RedisStorage implements IStorage {
  model: string
  redis!: any

  constructor(model: string) {
    this.model = model
  }

  async dump(data: any)  {
    await this.redis.json.set(this.model, "$", data)
  }

  async load(): Promise<any> {
    this.redis = await (await RedisSingleton.getInstance()).getClient()
    return await this.redis.json.get(this.model)
  }

  async update(data: any) {
    await this.redis.json.merge(this.model, "$", data)
  }

  async append(arr: string, item: any) {
    await this.redis.json.arrAppend(this.model, `$.${arr}`, item)
  }
}
