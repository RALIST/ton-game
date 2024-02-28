import {publishToStream} from "@/lib/streams/utils";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import StreamEvent from "@/lib/streams/StreamEvent";

export class EventStore implements WithRedisStorage{
  records!: StreamEvent[];
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

  async emitEvent(data: StreamEvent, stream: string) {
    data.id =  this.getNextId();
    this.records.push(data)
    await publishToStream(stream, data)
    // await this.dump()
  }
}
