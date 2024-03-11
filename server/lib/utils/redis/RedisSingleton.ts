import {createCluster} from "redis";

export type RedisClusterType = ReturnType<typeof createCluster>;

export default class RedisSingleton {
  static instance: RedisSingleton;
  private static CacheClient: RedisClusterType;

  private RedisClient = createCluster({
    rootNodes: [
      {url: "redis://172.30.0.11:6379" },
      {url: "redis://172.30.0.12:6379" },
      {url: "redis://172.30.0.13:6379" },
      {url: "redis://172.30.0.14:6379" },
      {url: "redis://172.30.0.15:6379" },
      {url: "redis://172.30.0.16:6379" },
      {url: "redis://172.30.0.17:6379" },
      {url: "redis://172.30.0.18:6379" }
    ],
    useReplicas: true,
    minimizeConnections: true
  });

  private constructor() {
    console.log("🔺 New Redis Client Instance Created!!");
  }

  private async initialize() {
    try {
      RedisSingleton.CacheClient = this.RedisClient
      await this.RedisClient.connect();
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }
  }

  //Singleton Function Implement
  public static getInstance = async (): Promise<RedisSingleton> => {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new RedisSingleton();
      await RedisSingleton.instance.initialize();
    }

    return RedisSingleton.instance;
  };

  //Usable Function Component to get client
  public getClient = async (): Promise<RedisClusterType> => {
    return RedisSingleton.CacheClient;
  };
}
