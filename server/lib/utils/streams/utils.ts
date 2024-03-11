import StreamEvent from "@/lib/utils/streams/StreamEvent";
import RedisStream from "../redis/RedisStream";
import RedisPublisher from "@/lib/utils/redis/RedisPublisher";

export function listenToStream (
  onMessage: (message: any, messageId: any) => void,
  streams: string[],
) {
  const readMaxCount = 1;
  const streamNames: {key: string, id: string}[] = []

  for (const stream of streams) {
    streamNames.push({key: stream, id: '$'})
  }

  return setInterval(async () => {
    const streamRedis = await (await RedisStream.getInstance()).getClient()
    const dataArr = await streamRedis.xRead(
      streamNames,
      {COUNT: readMaxCount, BLOCK: 0},
    )

    if(!dataArr) return

    for (const data of dataArr) {
      for (const messageItem of data.messages) {
        onMessage(messageItem.message, messageItem.id)
      }
    }
  }, 10)
}

export async function publishToStream(stream: string, data: StreamEvent) {
  const publishRedis = await (await RedisPublisher.getInstance()).getClient()
  await publishRedis.xAdd(stream, `*`, {message: JSON.stringify(data)})
}

// check to avoid incorrect events
export function isValidEvent(data: StreamEvent, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}
