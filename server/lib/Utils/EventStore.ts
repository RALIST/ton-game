import RedisStorage from "@/lib/Utils/redis/RedisStorage";
import {publishToStream} from "@/lib/Utils/streams/utils";
import Event from "@/lib/Utils/streams/Event";

export class EventStore {
  records!: Event[];
  userId: number;
  storage!: RedisStorage


  constructor(userId: number) {
    this.records = []
    this.userId = userId
    this.storage = new RedisStorage()
  }

  async load() {
    const data = await this.storage.load(`eventstore:${this.userId}`)
    this.records = data?.records ?? []

    return this
  }

  async dump() {
    await this.storage.dump(`eventstore:${this.userId}`, this)
  }

  getNextId(): number {
    return this.records.length + 1
  }

  async emitEvent(data: Event) {
    data.id =  this.getNextId();
    this.records.push(data)
    await publishToStream(data)
    // await this.dump()
  }
}
