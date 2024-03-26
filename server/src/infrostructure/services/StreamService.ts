import {IEventHandler, IService} from "@/src/infrostructure/services/types";
import RedisStream, {RedisClientType, RedisClusterType} from "@/lib/Utils/redis/RedisStream";

const STREAM: string = "gameplay"
const CONSUMER_GROUP_NAME: string = "gameplay_group";
const CONSUMER_NAME: string = "gameplay_consumer1";
const READ_MAX_COUNT: number = 100;
const DELAY: number = 100;

export default class StreamService implements IService {
  streamRedis!: typeof RedisStream
  redisInstance!: RedisClientType | RedisClusterType
  streamInterval!: NodeJS.Timeout
  eventHandler!: IEventHandler[]

  constructor() {
    this.streamRedis = RedisStream
  }

  async start() {
    console.log("Stream services is starting...")
    this.redisInstance = await this.getRedisInstance()
    await this.initGroup()

    this.streamInterval = setInterval(async () => {
      await this.handleMessages();
    }, DELAY);

    console.log("Stream service started!")
  }

  async stop() {
    clearInterval(this.streamInterval)
    console.log("Stream service stopped!")
  }

  private async  handleMessages() {
    const dataArr = await this.redisInstance.xReadGroup(
      CONSUMER_GROUP_NAME,
      CONSUMER_NAME,
      [{key: STREAM, id: ">"}],
      {COUNT: READ_MAX_COUNT}
    );

    if (dataArr) {
      for (const data of dataArr) {
        for (const messageItem of data.messages) {
          await this.handleEvent(messageItem.message)
          await this.redisInstance.xAck(STREAM, CONSUMER_GROUP_NAME, messageItem.id);
        }
      }
    }
  }

  private async handleEvent(message: any) {
    for (const handler of this.eventHandler) {
      await handler.handle(message);
    }
  }

  private async initGroup() {
    try {
      await this.redisInstance.xGroupCreate(STREAM, CONSUMER_GROUP_NAME, '0', { MKSTREAM: true })
    } catch (error) {
      // @ts-expect-error error with message
      if (!error.message.includes("BUSYGROUP")) throw error;
    }
  }

  private async getRedisInstance() {
    return (await this.streamRedis.getInstance()).getClient();
  }
}
