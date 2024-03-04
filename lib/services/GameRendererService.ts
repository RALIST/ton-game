import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {RendererEvents} from "@/lib/utils/GameEvents";
import GameRenderer from "@/lib/utils/GameRenderer";

export default class GameRendererService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, RendererEvents)) {
      const renderer = new GameRenderer(data.userId)
      await renderer.handleEvent(data.event, data.payload)
    }
  }
}
