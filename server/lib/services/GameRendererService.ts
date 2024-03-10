import GameRenderer from "@/lib/utils/GameRenderer";
import {RendererEvents} from "@/lib/utils/GameEvents";
import BaseService from "@/lib/services/BaseService";

export default class GameRendererService extends BaseService {
  public static async consume(data: any) {
    const model = new GameRenderer(data.userId)
    const instance = new GameRendererService(model)
    await instance.handleEvent(data)
  }

  constructor(model: GameRenderer) {super(model)}

  private eventHandlers = {
    [RendererEvents.GAME_INIT]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHANGE_SCREEN_STARTED]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHARACTER_ACTION_COMPLETED]: async (payload: any) => {
      await this.model.render(payload)
    }
  }
}
