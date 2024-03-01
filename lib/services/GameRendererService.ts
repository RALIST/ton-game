import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {RendererEvents} from "@/lib/utils/gameEvents";
import GameRenderer from "@/lib/GameRenderer";

export default class GameRendererService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, RendererEvents)) {
      const renderer = new GameRenderer(data.userId)
      await renderer.handleEvent(data.event, data.payload)
    }
  }
}
