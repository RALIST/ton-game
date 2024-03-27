import RedisStream from "@/src/infrostructure/streams/RedisStream";
import RedisPublisher from "@/src/infrostructure/streams/RedisPublisher";
import RedisStorage from "@/src/infrostructure/databases/redis/RedisStorage";
import {IService} from "@/src/infrostructure/services/types";

export default class RedisService implements IService {
  async start() {
    console.log("Redis is starting...")

    await Promise.all([
      RedisStream.getInstance(),
      RedisPublisher.getInstance(),
      RedisStorage.getInstance(),
    ]).catch(async (error) => { await this.stop(); throw error })

    console.log("Redis started!")
  }

  async stop() {
    await Promise.all([
      RedisStream.close(),
      RedisPublisher.close(),
      RedisStorage.close()
    ])
  }
}
