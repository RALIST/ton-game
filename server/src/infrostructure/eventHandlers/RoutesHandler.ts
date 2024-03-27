import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";
import EventBus from "@/src/infrostructure/services/EventBus";
import RouteStartRequested from "@/src/events/routes/RouteStartRequested";
import Player from "@/src/domain/entities/Player/Player";
import {gRoutes} from "@/src/domain/entities/Route/Route";
import ActionCompleted from "@/src/events/renderer/ActionCompleted";
import StartRoute from "@/src/domain/useCases/routes/StartRoute";
import {EventStatus} from "@/src/events/GameEvent";

export default class RoutesHandler extends BaseHandler {
  static init(eventBus: EventBus) {
    const handler = new RoutesHandler(eventBus)
    handler.eventBus.on("RouteStartRequested", handler.handleRouteStart.bind(handler))
  }

  async handleRouteStart(event: RouteStartRequested) {
    if (!event.userId) throw "Incorrect userId"

    const player = await new Player(event.userId).load()
    const route = Object.values(gRoutes).find(_route => _route.id == event.payload.routeId)
    const result = new StartRoute(player, route).call()

    if (result) {
      const completed = new ActionCompleted(event.userId,  { routeResult: result }, EventStatus.OK)
      this.eventBus.dispatch(completed)
      await player.save()
    } else {
      this.eventBus.dispatchErrorEvent(event.userId, {details: "Can't start route!"})
    }
  }
}
