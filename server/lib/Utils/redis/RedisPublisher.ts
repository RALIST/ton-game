import {createClient, createCluster} from "redis";

export type RedisClusterType = ReturnType<typeof createCluster>;
export type RedisClientType = ReturnType<typeof createClient>;

export default class RedisPublisher {
  static instance: RedisPublisher;
  private static CacheClient: RedisClusterType | RedisClientType;

  private RedisCluster = createCluster({
    rootNodes: [
      { url: "redis://172.30.0.11:6379" },
      { url: "redis://172.30.0.12:6379" },
      { url: "redis://172.30.0.13:6379" },
      { url: "redis://172.30.0.14:6379" },
      { url: "redis://172.30.0.15:6379" },
      { url: "redis://172.30.0.16:6379" },
      { url: "redis://172.30.0.17:6379" },
      { url: "redis://172.30.0.18:6379" }
    ]
  });

  private RedisClient = createClient()

  public static async close() {
    await this.CacheClient.quit()
    console.log("Redis publisher stopped!")
  }

  async initialize() {
    try {
      if (process.env.NODE_ENV === 'docker') {
        console.log("Redis started in cluster mode!")
        RedisPublisher.CacheClient = this.RedisCluster
      } else {
        console.log("Redis started in single mode!")
        RedisPublisher.CacheClient = this.RedisClient
      }

      await RedisPublisher.CacheClient.connect();
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }
  }

  //Singleton Function Implement
  public static getInstance = async (): Promise<RedisPublisher> => {
    if (!RedisPublisher.instance) {
      RedisPublisher.instance = new RedisPublisher();
      await RedisPublisher.instance.initialize();
    }

    return RedisPublisher.instance;
  };

  //Usable Function Component to get client
  public getClient = async (): Promise<RedisClusterType | RedisClientType> => {
    return RedisPublisher.CacheClient;
  };

  async getRedisInstance() {
    return (await RedisPublisher.getInstance()).getClient();
  }
}
