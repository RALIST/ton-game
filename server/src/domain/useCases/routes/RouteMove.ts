import Player from "@/src/domain/entities/Player/Player";
import RouteResult from "@/src/domain/entities/Route/RouteResult";

export default class RouteMove {
  player: Player
  routeResult: RouteResult

  constructor(player: Player, routeResult: RouteResult) {
    this.player = player
    this.routeResult = routeResult
  }

  call() {
    const completedLocations = this.routeResult.locations.filter(location => location.completed)
    if (completedLocations.length === this.routeResult.maxLocationsCount) return null

    this.routeResult.currentLocationId++
    return this.routeResult
  }
}
