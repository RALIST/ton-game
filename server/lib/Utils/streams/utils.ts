import RedisStream from "@/lib/Utils/redis/RedisStream";
import {CharacterEvents, InventoryEvents, LoggerEvents, RendererEvents} from "@/lib/Game/GameEvents";
import PlayerService from "@/lib/Game/PlayerService";
import InventoryService from "@/lib/Game/InventoryService";
import RendererService from "@/lib/Game/RendererService";
import RedisPublisher from "@/lib/Utils/redis/RedisPublisher";
import Event from "@/lib/Utils/streams/Event";
import LoggerService from "@/lib/Game/LoggerService";
import {gIntervals} from "@/lib/Game/Game";

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

  const streamInterval = setInterval(async () => {
    await readAndHandleStreamData(onMessage);
  }, DELAY);

  gIntervals.add(streamInterval)
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

export async function publishToStream(data: Event) {
  const publishRedis = await getRedisInstance(RedisPublisher);
  await publishRedis.xAdd(STREAM, "*", {message: JSON.stringify(data)})
}

export function isValidEvent(data: Event, includedIn: any): boolean {
  if (!data || !data.userId || !data.event) return false
  const values = Object.values(includedIn) as string[];
  return values.includes(data.event)
}

const services = [
  { events: CharacterEvents, service: PlayerService },
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
