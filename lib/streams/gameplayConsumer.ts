import {listenToStream} from "@/lib/streams/utils";
import {Character} from "@/lib/Character";
import {CharacterEvents, GeneratorEvents, LoggerEvents, RendererEvents} from "@/lib/utils/gameEvents";
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

export async function startGameplayService() {
  await characterConsumer();
  await eventGeneratorConsumer();
  await loggerConsumer();
  await rendererConsumer();

  console.log("Gameplay service started!")
}

await startGameplayService();
