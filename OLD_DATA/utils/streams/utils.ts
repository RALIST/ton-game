import StreamEvent from "@/lib/utils/streams/StreamEvent";
import RedisStream from "../redis/RedisStream";
import RedisPublisher from "@/lib/utils/redis/RedisPublisher";
import {CharacterEvents, GameplayEvents, InventoryEvents, LoggerEvents, RendererEvents} from "@/lib/Game/GameEvents";
import CharacterService from "@/lib/Game/CharacterService";
import GameplayService from "@/lib/Gameplay/GameplayService";
import LoggerService from "@/lib/Logger/LoggerService";
import InventoryService from "@/lib/Inventory/InventoryService";
import RendererService from "@/lib/Renderer/RendererService";

const STREAM: string = "gameplay"
const CONSUMER_GROUP_NAME: string = "gameplay_group";
const CONSUMER_NAME: string = "gameplay_consumer1";
const READ_MAX_COUNT: number = 100;
const DELAY: number = 100;

export async function listenToStream(
  onMessage: (message: any, messageId: any) => Promise<void>
) {
  const streamRedis = await getRedisInstance(RedisStream);
  try {
    await streamRedis.xGroupCreate(STREAM, CONSUMER_GROUP_NAME, '0', {MKSTREAM: true})
  } catch (error: unknown) {
    // @ts-expect-error error
    if (!error.message.includes("BUSYGROUP")) throw error;
  }
  setInterval(async () => {
    await readAndHandleStreamData(onMessage);
  }, DELAY);
}

async function readAndHandleStreamData(
  onMessage: (message: any, messageId: any) => Promise<void>,
) {
  const streamRedis = await getRedisInstance(RedisStream);
  const dataArr = await streamRedis.xReadGroup(
    CONSUMER_GROUP_NAME,
    CONSUMER_NAME,
    [{key: STREAM, id: ">"}],
    {COUNT: READ_MAX_COUNT}
  );
  if (dataArr) {
    for (const data of dataArr) {
      for (const messageItem of data.messages) {
        await onMessage(messageItem.message, messageItem.id)
        await streamRedis.xAck(STREAM, CONSUMER_GROUP_NAME, messageItem.id);
      }
    }
  }
}

async function getRedisInstance(container: typeof RedisStream | typeof RedisPublisher) {
  return (await container.getInstance()).getClient();
}

export async function publishToStream(data: StreamEvent) {
  const publishRedis = await getRedisInstance(RedisPublisher);
  await publishRedis.xAdd(STREAM, "*", {message: JSON.stringify(data)})
}

export function isValidEvent(data: StreamEvent, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}

const services = [
  { events: CharacterEvents, service: CharacterService },
  { events: GameplayEvents, service: GameplayService },
  { events: LoggerEvents, service: LoggerService },
  { events: InventoryEvents, service: InventoryService },
  { events: RendererEvents, service: RendererService }
];

async function consumeEvent(message: any) {
  const data = JSON.parse(message.message);
  for (const { events, service } of services) {
    if (isValidEvent(data, events)) await service.consume(data);
  }
}

export async function initStreams() {
  await listenToStream(consumeEvent)
}
