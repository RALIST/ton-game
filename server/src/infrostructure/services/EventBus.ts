import {IService} from "@/src/infrostructure/services/types";
import RedisStream, {RedisClientType, RedisClusterType} from "@/src/infrostructure/streams/RedisStream";
import RedisPublisher from "@/src/infrostructure/streams/RedisPublisher";
import ErrorRaised from "@/src/events/renderer/ErrorRaised";
import GameEvent from "@/src/events/GameEvent";

const STREAM: string = "gameplay"
const CONSUMER_GROUP_NAME: string = "gameplay_group";
const CONSUMER_NAME: string = "gameplay_consumer1";
const READ_MAX_COUNT: number = 100;
const DELAY: number = 100;

type EventHandler = (event: any) => Promise<void>

export default class EventBus implements IService {
  publisher!: RedisClientType | RedisClusterType
  subscriber!: RedisClientType | RedisClusterType
  streamInterval!: NodeJS.Timeout
  handlers: { [eventName: string]: EventHandler[] } = {}

  async start() {
    console.log("Stream services is starting...")

    this.subscriber = await RedisStream.getRedisInstance()
    this.publisher = await RedisPublisher.getRedisInstance()

    await this.initGroup()

    this.streamInterval = setInterval(async () => {
      await this.handleMessages();
    }, DELAY);

    (global as any).eventBus = this

    console.log("Stream service started!")
  }

  async stop() {
    clearInterval(this.streamInterval)
    console.log("Stream service stopped!")
  }

  on(eventName: string, callback: EventHandler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    this.handlers[eventName].push(callback)
  }

  dispatch(event: GameEvent) {
    if (event.isValid()) {
      const eventName = event.constructor.name;
      this.publisher.xAdd(STREAM, "*", { type: eventName, event: JSON.stringify(event) });
    } else {
      this.dispatchErrorEvent(event.userId, {details: "Incorrect params for event"})
    }
  }

  private async  handleMessages() {
    const dataArr = await this.subscriber.xReadGroup(
      CONSUMER_GROUP_NAME,
      CONSUMER_NAME,
      [{ key: STREAM, id: ">" }],
      { COUNT: READ_MAX_COUNT }
    );

    if (dataArr) {
      for (const data of dataArr) {
        for (const messageItem of data.messages) {
          console.log("Received:", messageItem.message)
          await this.handleEvent(messageItem.message)
          await this.subscriber.xAck(STREAM, CONSUMER_GROUP_NAME, messageItem.id);
        }
      }
    }
  }

  private async handleEvent(message: { [x: string]: string; }) {
    if (!this.handlers[message.type]) return

    const event = JSON.parse(message.event)

    for (const handler of this.handlers[message.type]) {
      try {
        await handler(event)
      } catch (error) {
        this.dispatchErrorEvent(event.userId, { details: error })
      }
    }
  }

  dispatchErrorEvent(userId?: number, payload?: any) {
    const event = new ErrorRaised(userId, payload)
    this.dispatch(event)
  }

  private async initGroup() {
    try {
      await this.publisher.xGroupCreate(STREAM, CONSUMER_GROUP_NAME, '0', { MKSTREAM: true })
    } catch (error) {
      // @ts-expect-error error with message
      if (!error.message.includes("BUSYGROUP")) throw error;
    }
  }
}
