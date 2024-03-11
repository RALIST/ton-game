import {RendererEvents} from "@/lib/utils/GameEvents";
import RendererService from "@/lib/Renderer/RendererService";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";
import StreamEvent from "@/lib/utils/streams/StreamEvent";

export default class RendererConsumer {
  private static events = RendererEvents

  public static async start() {
    console.log("Renderer consumer started!")

    const events = RendererConsumer.events
    await listenToStream((message) => {
      const data: StreamEvent = JSON.parse(message.message);

      if (isValidEvent(data, events)) RendererService.consume(data);
    }, ["gameplay"])
  }
}
