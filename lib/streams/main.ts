// Below is some code for how you would use Redis to listen for the stream events:
import {redis} from "@/lib/utils/redis";
import {createClient} from "redis";

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
  }, 10)
}

export async function publishToStream(stream: string, data: any) {
  console.log("Event was published to redis stream:", stream)
  await redis.xAdd(stream, `*`, {message: JSON.stringify(data)})
}
