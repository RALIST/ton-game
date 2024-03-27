import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";
import EventBus from "@/src/infrostructure/services/EventBus";
import RouteStartRequested from "@/src/events/routes/RouteStartRequested";

export default class RoutesHandler extends BaseHandler {
  static init(eventBus: EventBus) {
    const handler = new RoutesHandler(eventBus)
    handler.eventBus.on("RouteStartRequested", handler.handleRouteStart)
  }

  async handleRouteStart(event: RouteStartRequested) {

  }
}
