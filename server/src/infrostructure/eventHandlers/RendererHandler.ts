import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";
import EventBus from "@/src/infrostructure/services/EventBus";
import ActionCompleted from "@/src/events/renderer/ActionCompleted";
import Renderer from "@/src/infrostructure/services/Renderer";

export default class RendererHandler extends BaseHandler {
  static init(eventBus: EventBus) {
    const handler = new RendererHandler(eventBus)
    handler.eventBus.on("ActionCompleted", handler.handleCompleted)
  }

  async handleCompleted(event: ActionCompleted) {
    if (!event.userId) throw "Incorrect userId for render!"

    const renderer = new Renderer(event.userId)
    await renderer.render(event.payload);
  }
}
