import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>;

export default class RedisSingleton {
  static instance: RedisSingleton;
  private static CacheClient: RedisClientType;

  private RedisClient = createClient();
  private constructor() {
    console.log("🔺 New Redis Client Instance Created!!");
  }

  private async initialize() {
    try {
      RedisSingleton.CacheClient = await this.RedisClient.connect();
      const clientId = await RedisSingleton.CacheClient.sendCommand([
        "CLIENT",
        "ID",
      ]);
      console.log(`✅ Connected to Redis with ID: ${clientId}`);
    } catch (err) {
      console.log("❌ Could not connect to Redis\n%o", err);
      throw err;
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
  public getClient = async (): Promise<RedisClientType> => {
    return RedisSingleton.CacheClient;
  };
}
