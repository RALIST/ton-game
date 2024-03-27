import GameEvent from "@/src/events/GameEvent";

export default class RouteStartRequested extends GameEvent {
  constructor() {
    super();
  }

  isValid(): boolean {
    return !(!this.userId && !this.payload && !this.payload?.routeId);
  }
}
