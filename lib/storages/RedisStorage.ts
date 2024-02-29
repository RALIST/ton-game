import RedisSingleton from "@/lib/storages/RedisSingleton";

export interface IStorage {
  model: string;
  load(): Object
  dump(data: any): void
}

const redis = await (await RedisSingleton.getInstance()).getClient()

export interface WithRedisStorage {
  storage: RedisStorage
}

export class RedisStorage implements IStorage {
  model: string

  constructor(model: string) {
    this.model = model
  }

  async dump(data: any)  {
    await redis.json.set(this.model, "$", data)
  }

  async load(): Promise<any> {
    return await redis.json.get(this.model)
  }

  async update(data: any) {
    await redis.json.merge(this.model, "$", data)
  }

  async append(arr: string, item: any) {
    await redis.json.arrAppend(this.model, `$.${arr}`, item)
  }
}
