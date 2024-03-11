import {createCluster} from "redis";
import * as console from "console";

export type RedisClusterType = ReturnType<typeof createCluster>;

export default class RedisPublisher {
  static instance: RedisPublisher;
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
      RedisPublisher.CacheClient = this.RedisClient
      await this.RedisClient.connect();
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
    }

    this.RedisClient.on('ready', () => {
      console.log('Redis client connected');
    });

    this.RedisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    this.RedisClient.on('end', () => {
      console.log('Redis client disconnected');
    });
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
  public getClient = async (): Promise<RedisClusterType> => {
    return RedisPublisher.CacheClient;
  };
}
