import {listenToStream, publishToStream} from "@/lib/streams/utils";
import {Character} from "@/lib/Character";
import {redis} from "@/lib/utils/redis";
import {CharacterEvents, GeneratorEvents, LoggerEvents, RendererEvents} from "@/lib/utils/enums";
import SceneRenderer from "@/lib/SceneRenderer";
import {GameLogger} from "@/lib/GameLogger";
import {EventGenerator} from "@/lib/EventGenerator";
import StreamEvent from "@/lib/streams/StreamEvent";

const listenStreams = ["gameplay"]

// check to avoid incorrect events
function isValid(data: StreamEvent, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}

async function characterConsumer(){
  await listenToStream(async (message) => {
    const data: StreamEvent = JSON.parse(message.message)

    if (isValid(data, CharacterEvents)) {
      const character = await new Character(data.userId).load()
      await character.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

async function loggerConsumer(){
  await listenToStream(async (message) => {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValid(data, LoggerEvents)) {
      const logger = await new GameLogger(data.userId).load()
      await logger.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

async function rendererConsumer() {
  await listenToStream(async (message) => {
    const data: StreamEvent = JSON.parse(message.message)
    if (isValid(data, RendererEvents)) {
      const renderer = new SceneRenderer(data.userId)
      await renderer.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

async function eventGeneratorConsumer() {
  await listenToStream(async (message) => {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValid(data, GeneratorEvents)) {
      const generator = new EventGenerator(data.userId)
      await generator.handleEvent(data.event, data.payload)
    }
  }, listenStreams)
}

// TODO: it's fucking bullshit, find a better way
function startCharactersRegen() {
  setInterval(async () => {
      const charKeys = await redis.scan(0, { MATCH: "character:*" })
      charKeys.keys.forEach((key) => {
        const userId = key.split(":")[1]
        const payload = {
          endurance: { type: "add", value: 1 },
          health: { type: "add", value: 1 }
        }
        const data = new StreamEvent().globalCharacterAttributesChanged(parseInt(userId), payload)
        publishToStream("gameplay", data)
      })
  }, 10000)
}

export async function startGameplayService() {
  await rendererConsumer();
  await characterConsumer();
  await loggerConsumer();
  await eventGeneratorConsumer();
  // startCharactersRegen();

  console.log("Gameplay service started!")
}

await startGameplayService();
