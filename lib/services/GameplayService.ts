import Gameplay from "@/lib/game/Gameplay";
import StreamEvent from "@/lib/streams/StreamEvent";

export default class GameplayService {
  model: Gameplay

  public static async consume(data: any) {
    const model = new Gameplay(data.userId)
    const instance = new GameplayService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Gameplay) {
    this.model = model
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-ignore
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }

  private eventHandlers = {}
}
