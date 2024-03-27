import EventBus from "@/src/infrostructure/services/EventBus";
import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";

export default class InventoryHandler extends BaseHandler {
  static init(eventBus: EventBus) {
    const handler = new InventoryHandler(eventBus)
  }
}
