import {createClient, createCluster} from "redis";

export type RedisClusterType = ReturnType<typeof createCluster>;
export type RedisClientType = ReturnType<typeof createClient>;

export default class RedisStream {
  static instance: RedisStream;
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
        RedisStream.CacheClient = this.RedisCluster
      } else {
        RedisStream.CacheClient = this.RedisClient
      }

      await RedisStream.CacheClient.connect();
      console.log("Started", this.constructor.name)
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }
  }

  public static async close() {
    await this.CacheClient.quit()
    console.log("Redis consumer stopped!")
  }

  //Singleton Function Implement
  public static getInstance = async (): Promise<RedisStream> => {
    if (!RedisStream.instance) {
      RedisStream.instance = new RedisStream();
      await RedisStream.instance.initialize();
    }

    return RedisStream.instance;
  };

  //Usable Function Component to get client
  public getClient = async (): Promise<RedisClusterType | RedisClientType> => {
    return RedisStream.CacheClient;
  };

  static async getRedisInstance() {
    return (await RedisStream.getInstance()).getClient();
  }
}
