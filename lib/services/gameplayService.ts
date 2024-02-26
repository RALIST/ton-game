import characterService from "@/lib/services/characterService";
import stateService from "@/lib/services/stateService";
import {listenToStream} from "@/lib/streams/main";
import {Gameplay} from "@/lib/Gameplay";

export async function startGameplayService() {
  const listenStreams = ["gameplay"]

  listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Gameplay service received event:", data)
      const userId = data.payload.userId
      const gameplay = await new Gameplay().load(userId)
      await gameplay.handleEvent(data.event, data.payload)
      // await character.dump()
    }

  }, listenStreams)

  stateService()
  characterService()
}
