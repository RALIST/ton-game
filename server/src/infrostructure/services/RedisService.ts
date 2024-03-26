import RedisStream from "@/lib/Utils/redis/RedisStream";
import RedisPublisher from "@/lib/Utils/redis/RedisPublisher";
import RedisStorage from "@/lib/Utils/redis/RedisStorage";
import {IService} from "@/src/infrostructure/services/types";

export default class RedisService implements IService {
  async start() {
    console.log("Redis is starting...")

    await Promise.all([
      RedisStream.getInstance(),
      RedisPublisher.getInstance(),
      RedisStorage.getInstance(),
    ])

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
