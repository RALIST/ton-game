import {createCluster} from "redis";
import * as console from "console";

export type RedisClusterType = ReturnType<typeof createCluster>;

export default class RedisStream {
  static instance: RedisStream;
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
    ]
  });

  async initialize() {
    try {
      RedisStream.CacheClient = this.RedisClient
      await this.RedisClient.connect();
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }
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
  public getClient = async (): Promise<RedisClusterType> => {
    return RedisStream.CacheClient;
  };
}
