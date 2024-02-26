import {listenToStream} from "@/lib/streams/main";
import {Character} from "@/lib/Character";

export default async function characterService(){
  const listenStreams = ["gameplay"]

  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Character service received event:", data)
      const userId = data.payload.userId
      const character = await new Character(userId).load()
      await character.handleEvent(data.event, data.payload)
      await character.dump()
    }

  }, listenStreams)
}
