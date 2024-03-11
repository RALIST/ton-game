import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {createCluster} from "redis";
import RedisSingleton from "../redis/RedisSingleton";

export function listenToStream (
  onMessage: (message: any, messageId: any) => void,
  streams: string[],
) {

  const streamRedis = createCluster({
    rootNodes: [
      {url: "redis://172.30.0.11:6379" },
      {url: "redis://172.30.0.12:6379" },
      {url: "redis://172.30.0.13:6379" },
      {url: "redis://172.30.0.14:6379" },
      {url: "redis://172.30.0.15:6379" },
      {url: "redis://172.30.0.16:6379" },
      {url: "redis://172.30.0.17:6379" },
      {url: "redis://172.30.0.18:6379" }
    ],
    useReplicas: true,
    minimizeConnections: true
  });

  const readMaxCount = 1;
  const streamNames: {key: string, id: string}[] = []

  for (const stream of streams) {
    streamNames.push({key: stream, id: '$'})
  }

  return setInterval(async () => {
    if (!streamRedis.isOpen) {
      await streamRedis.connect()
    }
    const dataArr = await streamRedis.xRead(
      streamNames,
      {COUNT: readMaxCount, BLOCK: 100},
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
  const publishRedis = await (await RedisSingleton.getInstance()).getClient()
  await publishRedis.xAdd(stream, `*`, {message: JSON.stringify(data)})
}

// check to avoid incorrect events
export function isValidEvent(data: StreamEvent, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}
