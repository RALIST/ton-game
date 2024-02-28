import {listenToStream, publishToStream} from "@/lib/streams/main";
import {Gameplay} from "@/lib/Gameplay";
import {Character} from "@/lib/Character";
import {GameplayState} from "@/lib/GameplayState";
import {redis} from "@/lib/utils/redis";
import {GameplayEvents} from "@/lib/utils/enums";

const listenStreams = ["gameplay"]

async function stateConsumer(){
  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Game state service received event:", data)
      const userId = data.payload.userId
      if (!userId) return

      const state = await new GameplayState(userId).load()
      await state.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

async function characterConsumer(){
  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Character service received event:", data)
      const userId = data.payload.userId
      if (!userId) return
      const character = await new Character(userId).load()
      await character.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

async function gameplayConsumer() {
  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Gameplay service received event:", data)
      const userId = data.payload.userId
      if (!userId) return

      const gameplay = new Gameplay(userId)
      await gameplay.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

// TODO: it's fucking bullshit, find a better way
function startCharactersRegen() {
  setInterval(async () => {
      const charKeys = await redis.scan(0, { MATCH: "character:*" })
      charKeys.keys.forEach((key) => {
        const userId = key.split(":")[1]
        const data = {
          event: GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED,
          payload: {
            userId: userId,
            endurance: { type: "add", value: 1 },
            health: { type: "add", value: 1 }
          }
        }

        publishToStream("gameplay", data)
      })
  }, 5000)
}

export async function startGameplayService() {
  await gameplayConsumer();
  await stateConsumer();
  await characterConsumer();
  startCharactersRegen();
}

await startGameplayService();
