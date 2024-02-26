import {redis} from "@/lib/utils/redis";
import {publishToStream} from "@/lib/streams/main";

export type GameEvent = {
  id: number,
  event: string,
  payload: any
}

export class EventStore {
  records!: GameEvent[];
  userId: number;


  constructor(userId: number) {
    this.records = []
    this.userId = userId
  }

  async load() {
    await redis.get(`eventStore:${this.userId}`)

    return this
  }

  async dump() {
    await redis.set(`eventStore:${this.userId}`, JSON.stringify(this))
  }

  getNextId(): number {
    return this.records.length + 1
  }

  async emitEvent(event: string, payload: any, stream: string) {
    console.log("EventStore received event:", event)
    const id = this.getNextId();
    this.records.push({id: id, event: event, payload: payload})
    await publishToStream(stream, { event: event, payload: payload})

    await this.dump()
  }
}
