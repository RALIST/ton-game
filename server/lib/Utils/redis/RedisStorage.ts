import {createClient, createCluster} from "redis";
import * as process from "process";

export type RedisClusterType = ReturnType<typeof createCluster>;
export type RedisClientType = ReturnType<typeof createClient>;

export default class RedisStorage {
  static instance: RedisStorage;
  private static CacheClient: RedisClusterType | RedisClientType;

  private RedisCluster = createCluster({
    rootNodes: [
      {url: "redis://172.30.0.11:6379" },
      {url: "redis://172.30.0.12:6379" },
      {url: "redis://172.30.0.13:6379" },
      {url: "redis://172.30.0.14:6379" },
      {url: "redis://172.30.0.15:6379" },
      {url: "redis://172.30.0.16:6379" },
      {url: "redis://172.30.0.17:6379" },
      {url: "redis://172.30.0.18:6379" }
    ]
  });

  private RedisClient = createClient()

  async initialize() {
    try {
      if (process.env.NODE_ENV === 'docker') {
        console.log("Redis started in cluster mode!")
        RedisStorage.CacheClient = this.RedisCluster
      } else {
        console.log("Redis started in single mode!")
        RedisStorage.CacheClient = this.RedisClient
      }

      await RedisStorage.CacheClient.connect();
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }
  }

  public static async close() {

    await this.CacheClient.quit()
    console.log("Redis storage stopped!")
  }

  //Singleton Function Implement
  public static getInstance = async (): Promise<RedisStorage> => {
    if (!RedisStorage.instance) {
      RedisStorage.instance = new RedisStorage();
      await RedisStorage.instance.initialize();
    }

    return RedisStorage.instance;
  };

  //Usable Function Component to get client
  public getClient = async (): Promise<RedisClusterType | RedisClientType> => {
    return RedisStorage.CacheClient;
  };

  async getRedisInstance() {
    return (await RedisStorage.getInstance()).getClient();
  }

  async dump(model: string, data: any)  {
    const redis = await this.getRedisInstance()
    await redis.json.set(model, "$", data)
  }

  async load(model: string): Promise<any> {
    const redis = await this.getRedisInstance()
    return await redis.json.get(model)
  }

  async update(model: string, data: any) {
    const redis = await this.getRedisInstance()
    await redis.json.merge(model, "$", data)
  }

  async append(model: string, arr: string, item: any) {
    const redis = await this.getRedisInstance()
    await redis.json.arrAppend(model, `$.${arr}`, item)
  }
}
