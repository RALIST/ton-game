import RedisStream from "@/lib/Utils/redis/RedisStream";
import RedisPublisher from "@/lib/Utils/redis/RedisPublisher";
import RedisStorage from "@/lib/Utils/redis/RedisStorage";

export async function startRedis() {
  await Promise.all([
    RedisStream.getInstance(),
    RedisPublisher.getInstance(),
    RedisStorage.getInstance(),
  ])
}

export async function stopRedis() {
  await Promise.all([
    RedisStream.close(),
    RedisPublisher.close(),
    RedisStorage.close()
  ])
}
