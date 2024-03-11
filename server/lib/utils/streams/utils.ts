import StreamEvent from "@/lib/utils/streams/StreamEvent";
import RedisStream from "../redis/RedisStream";
import RedisPublisher from "@/lib/utils/redis/RedisPublisher";

export function listenToStream(
  onMessage: (message: any, messageId: any) => void,
  streams: string[],
) {
  const readMaxCount = 100;
  let id = '$';
  const streamNames: { key: string, id: string }[] = streams.map(stream => ({key: stream, id: id}));

  return setInterval(async () => {
    id = await readAndHandleStreamData(streamNames, onMessage, readMaxCount, id);
  }, 300)
}

async function readAndHandleStreamData(
  streamNames: { key: string, id: string }[],
  onMessage: (message: any, messageId: any) => void,
  readMaxCount: number,
  lastId: string
) {
  const streamRedis = await (await RedisStream.getInstance()).getClient()
  // Update id of all streams
  streamNames.forEach(s => s.id = lastId);
  const dataArr = await streamRedis.xRead(
    streamNames,
    {COUNT: readMaxCount, BLOCK: 10000},
  )
  let nextId = lastId;
  if (dataArr) {
    for (const data of dataArr) {
      for (const messageItem of data.messages) {
        nextId = messageItem.id
        onMessage(messageItem.message, messageItem.id)
      }
    }
  }

  return nextId;
}

export async function publishToStream(stream: string, data: StreamEvent) {
  const publishRedis = await (await RedisPublisher.getInstance()).getClient()
  await publishRedis.xAdd(stream, `*`, {message: JSON.stringify(data)})
}

export function isValidEvent(data: StreamEvent, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}
