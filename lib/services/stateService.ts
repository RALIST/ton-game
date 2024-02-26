import {listenToStream} from "@/lib/streams/main";
import {GameplayState} from "@/lib/GameplayState";

export default async function stateService(){
  const listenStreams = ["gameplay"]

  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Game state service received event:", data)
      const userId = data.payload.userId
      const state = await new GameplayState(userId).load()
      await state.handleEvent(data.event, data.payload)
      await state.dump()
    }

  }, listenStreams)
}
