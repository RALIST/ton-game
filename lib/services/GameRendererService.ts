import GameRenderer from "@/lib/utils/GameRenderer";
import StreamEvent from "@/lib/streams/StreamEvent";
import {RendererEvents} from "@/lib/utils/GameEvents";
import {SceneCommands} from "@/lib/utils/GameCommands";

export default class GameRendererService {
  model: GameRenderer

  public static async consume(data: any) {
    const model = new GameRenderer(data.userId)
    const instance = new GameRendererService(model)
    await instance.handleEvent(data)
  }

  constructor(model: GameRenderer) {
    this.model = model
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-ignore
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }

  private eventHandlers = {
    [RendererEvents.GAME_INIT]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHANGE_SCREEN_STARTED]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHARACTER_ACTION_COMPLETED]: async (payload: any) => {
      await this.model.render(payload)
    }
  }
}
