import Event from "@/lib/Utils/streams/Event";

export default abstract class BaseService {
  model: any
  streamEvent: Event

  protected constructor(model: any) {
    this.model = model
    this.streamEvent = new Event()
  }

  async handleEvent(data: Event)
  {
    const { event, payload } = data
    // @ts-expect-error idk
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }
}
