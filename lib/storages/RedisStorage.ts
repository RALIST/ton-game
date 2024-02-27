import {redis} from "@/lib/utils/redis";
import {createClient, RedisClientType} from "redis";

export interface IStorage {
  model: string;
  load(): Object
  dump(data: any): void
}

export interface WithRedisStorage {
  storage: RedisStorage
}

export class RedisStorage implements IStorage {
  model: string
  redis!: RedisClientType

  constructor(model: string) {
    this.model = model
    this.redis = createClient()
  }

  async dump(data: any)  {
    if (!this.redis.isOpen) await this.redis.connect()
    await redis.set(this.model, JSON.stringify(data))
  }

  async load(): Promise<any> {
    if (!this.redis.isOpen) await this.redis.connect()

    const data = await redis.get(this.model)
    return JSON.parse(data || "{}")
  }
}
