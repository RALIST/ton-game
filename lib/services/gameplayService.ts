import {listenToStream} from "@/lib/streams/main";
import {Gameplay} from "@/lib/Gameplay";
import {Character} from "@/lib/Character";
import {GameplayState} from "@/lib/GameplayState";

const listenStreams = ["gameplay"]

async function stateConsumer(){
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

async function characterConsumer(){
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

async function gameplayConsumer() {
  await listenToStream(async (message) => {
    const data = JSON.parse(message.message)
    if (data) {
      console.log("Gameplay service received event:", data)
      const userId = data.payload.userId
      const gameplay = new Gameplay(userId)
      await gameplay.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

export async function startGameplayService() {
  await gameplayConsumer();
  await stateConsumer()
  await characterConsumer()
}

await startGameplayService();
