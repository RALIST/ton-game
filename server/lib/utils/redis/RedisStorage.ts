import RedisSingleton from "@/lib/utils/redis/RedisSingleton";

export interface IStorage {
  model: string;
  load(): unknown
  dump(data: any): void
  update(data: any): void
  append(arr: string, item: any): void
}

export class RedisStorage implements IStorage {
  model: string
  redis!: any

  constructor(model: string) {
    this.model = model
  }

  async dump(data: any)  {
    this.redis = await (await RedisSingleton.getInstance()).getClient()
    await this.redis.json.set(this.model, "$", data)
  }

  async load(): Promise<any> {
    this.redis = await (await RedisSingleton.getInstance()).getClient()
    return await this.redis.json.get(this.model)
  }

  async update(data: any) {
    this.redis = await (await RedisSingleton.getInstance()).getClient()
    await this.redis.json.merge(this.model, "$", data)
  }

  async append(arr: string, item: any) {
    this.redis = await (await RedisSingleton.getInstance()).getClient()
    await this.redis.json.arrAppend(this.model, `$.${arr}`, item)
  }
}
