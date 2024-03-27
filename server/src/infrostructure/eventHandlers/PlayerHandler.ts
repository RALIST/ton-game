import EventBus from "@/src/infrostructure/services/EventBus";
import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";

export default class PlayerHandler extends BaseHandler{
  static init(eventBus: EventBus) {
    const handler = new PlayerHandler(eventBus)
    handler.eventBus.on("MoveRequested", handler.handleMove)
  }

  async handleMove() {
    console.log("Move requested!")
  }
}
