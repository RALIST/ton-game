import StreamEvent from "@/lib/utils/streams/StreamEvent";

export default abstract class BaseService {
  model: any
  streamEvent: StreamEvent

  protected constructor(model: any) {
    this.model = model
    this.streamEvent = new StreamEvent()
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-expect-error idk
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }
}
