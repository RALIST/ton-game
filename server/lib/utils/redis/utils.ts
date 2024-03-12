import RedisStream from "@/lib/utils/redis/RedisStream";
import RedisPublisher from "@/lib/utils/redis/RedisPublisher";
import RedisStorage from "@/lib/utils/redis/RedisStorage";

export async function initRedis() {
  await Promise.all([
    RedisStream.getInstance(),
    RedisPublisher.getInstance(),
    RedisStorage.getInstance(),
  ])
}
