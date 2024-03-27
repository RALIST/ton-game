import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";
import EventBus from "@/src/infrostructure/services/EventBus";
import RouteStartRequested from "@/src/events/routes/RouteStartRequested";
import Player from "@/src/domain/entities/Player/Player";
import {gRoutes} from "@/src/domain/entities/Route/Route";
import ActionCompleted from "@/src/events/renderer/ActionCompleted";
import RouteStart from "@/src/domain/useCases/routes/RouteStart";
import {EventStatus} from "@/src/events/GameEvent";
import MoveRequested from "@/src/events/player/MoveRequested";
import {CharacterStates} from "@/src/domain/entities/Character/types";
import RouteResult from "@/src/domain/entities/Route/RouteResult";
import RouteMove from "@/src/domain/useCases/routes/RouteMove";

export default class RoutesHandler extends BaseHandler {
  static init(eventBus: EventBus) {
    const handler = new RoutesHandler(eventBus)
    handler.eventBus.on("RouteStartRequested", handler.handleRouteStart.bind(handler))
    handler.eventBus.on("MoveRequested", handler.handleMove.bind(handler))
  }

  async handleRouteStart(event: RouteStartRequested) {
    if (!event.userId) throw "Incorrect userId"

    const player = await new Player(event.userId).load()
    const route = Object.values(gRoutes).find(_route => _route.id == event.payload.routeId)
    const result = new RouteStart(player, route).call()

    if (result) {
      const completed = new ActionCompleted(event.userId,  { routeResult: result }, EventStatus.OK)
      this.eventBus.dispatch(completed)
      await player.save()
    } else {
      this.eventBus.dispatchErrorEvent(event.userId, { details: "Can't start route!" })
    }
  }

  async handleMove(event: MoveRequested) {
    if (!event.userId) throw "Incorrect userId"

    const player = await new Player(event.userId).load()
    if (player.state !== CharacterStates.ROUTE) {
      this.eventBus.dispatchErrorEvent(event.userId, { details: "Player not at route" })
      return
    }

    const result = new RouteMove(player, new RouteResult()).call()
    if (result) {
      const completed = new ActionCompleted(event.userId,  { routeResult: result }, EventStatus.OK)
      this.eventBus.dispatch(completed)
    } else {
      this.eventBus.dispatchErrorEvent(event.userId, { details: "Can't move!" })
    }
  }
}
