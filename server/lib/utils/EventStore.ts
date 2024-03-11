import {RedisStorage} from "@/lib/utils/redis/RedisStorage";
import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {publishToStream} from "@/lib/utils/streams/utils";

export class EventStore {
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
    this.records = data?.records ?? []

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
