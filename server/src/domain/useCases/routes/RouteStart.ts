import RouteResult from "@/src/domain/entities/Route/RouteResult";
import Route from "@/src/domain/entities/Route/Route";
import Player from "@/src/domain/entities/Player/Player";
import {CharacterStates} from "@/src/domain/entities/Character/types";

export default class RouteStart {
  player: Player
  protoRoute: Route

  constructor(player: Player, protoRoute: Route) {
    this.player = player
    this.protoRoute = protoRoute
  }

  async call() {
    if (this.player.state === CharacterStates.ROUTE) return null
    if( this.player.activeRouteId !== null) return null

    const result = new RouteResult()
    this.player.setState(CharacterStates.ROUTE)
    this.player.activeRouteId = result.id

    await result.save()
    await this.player.save()

    return result
  }
}
