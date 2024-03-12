import Renderer from "@/lib/Renderer/Renderer";
import {RendererEvents} from "@/lib/utils/GameEvents";
import BaseService from "@/lib/utils/services/BaseService";

export default class RendererService extends BaseService {
  public static async consume(data: any) {
    const model = new Renderer(data.userId)
    const instance = new RendererService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Renderer) {super(model)}

  private eventHandlers = {
    [RendererEvents.GAME_INIT]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHANGE_SCREEN_STARTED]: async (payload: any) => { await this.model.render(payload) },
    [RendererEvents.CHARACTER_ACTION_COMPLETED]: async (payload: any) => {
      await this.model.render(payload)
    }
  }
}
