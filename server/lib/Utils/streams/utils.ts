import RedisPublisher from "@/lib/Utils/redis/RedisPublisher";
import Event from "@/lib/Utils/streams/Event";

const STREAM: string = "gameplay"

async function getRedisInstance(container: typeof RedisPublisher) {
  return (await container.getInstance()).getClient();
}

export async function publishToStream(data: Event) {
  const publishRedis = await getRedisInstance(RedisPublisher);
  await publishRedis.xAdd(STREAM, "*", {message: JSON.stringify(data)})
}
