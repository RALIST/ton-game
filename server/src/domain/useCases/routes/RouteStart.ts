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

  call() {
    if (this.player.state === CharacterStates.ROUTE) return null

    this.player.setState(CharacterStates.ROUTE)
    return new RouteResult()
  }
}
