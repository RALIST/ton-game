// Below is some code for how you would use Redis to listen for the stream events:
import {createClient} from "redis";
import StreamEvent from "@/lib/streams/StreamEvent";
import RedisSingleton from "@/lib/storages/RedisSingleton";

export async function listenToStream (
  onMessage: (message: any, messageId: any) => void,
  streams: string[],
) {
  const streamRedis = createClient();
  await streamRedis.connect()

  const clientId=  await streamRedis.sendCommand([
      "CLIENT",
      "ID",
    ])

  console.log(`✅ Consumer connected to Redis with ID: ${clientId}`);

  const readMaxCount = 1;
  let streamNames: {key: string, id: string}[] = []

  for (let stream of streams) {
    streamNames.push({key: stream, id: '$'})
  }

  // setup a loop to listen for stream events
  return setInterval(async () => {
    const dataArr = await streamRedis.xRead(
      streamNames,
      {COUNT: readMaxCount, BLOCK: 1000},
    )
    if(!dataArr) return

    for (let data of dataArr) {
      for (let messageItem of data.messages) {
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
