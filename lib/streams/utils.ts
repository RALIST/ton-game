// Below is some code for how you would use Redis to listen for the stream events:
import {redis} from "@/lib/utils/redis";
import {createClient} from "redis";
import StreamEvent from "@/lib/streams/StreamEvent";

export async function listenToStream (
  onMessage: (message: any, messageId: any) => Promise<void>,
  streams: string[],
) {
  const redis = createClient();
  const readMaxCount = 1;
  let streamNames: {key: string, id: string}[] = []

  await redis.connect()
  for (let stream of streams) {
    streamNames.push({key: stream, id: '$'})
  }

  // setup a loop to listen for stream events
  setInterval(() => {
    redis.xRead(
      streamNames,
      {COUNT: readMaxCount, BLOCK: 1000},
    ).then(dataArr => {
      if(!dataArr) return

      for (let data of dataArr) {
        for (let messageItem of data.messages) {
          onMessage(messageItem.message, messageItem.id)
        }
      }
    })
  }, 100)
}

export async function publishToStream(stream: string, data: StreamEvent) {
  await redis.xAdd(stream, `*`, {message: JSON.stringify(data)})
}
