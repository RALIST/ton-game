import {publishToStream} from "@/lib/streams/main";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";

export type GameEvent = {
  id: number,
  event: string,
  payload: any
}

export class EventStore implements WithRedisStorage{
  records!: GameEvent[];
  userId: number;
  storage!: RedisStorage


  constructor(userId: number) {
    this.records = []
    this.userId = userId
    this.storage = new RedisStorage(`eventstore:${this.userId}`)
  }

  async load() {
    const data = await this.storage.load()
    this.records = data.records ?? []

    return this
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  toJson(){
    const {
      storage:_,
      ...props} = this

    return props
  }

  getNextId(): number {
    return this.records.length + 1
  }

  async emitEvent(event: string, payload: any, stream: string) {
    console.log("EventStore received event:", event)
    const id = this.getNextId();
    this.records.push({id: id, event: event, payload: payload})
    await publishToStream(stream, { event: event, payload: payload})

    // await this.dump()
  }
}
