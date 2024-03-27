import EventBus from "@/src/infrostructure/services/EventBus";
import BaseHandler from "@/src/infrostructure/eventHandlers/BaseHandler";
import LookRequested from "@/src/events/player/LookRequested";
import AttackRequested from "@/src/events/player/AttackRequested";
import GameEvent from "@/src/events/GameEvent";
import * as console from "console";

export default class PlayerHandler extends BaseHandler{
  static init(eventBus: EventBus) {
    const handler = new PlayerHandler(eventBus)
    handler.events.forEach((value, key) => {
      handler.eventBus.on(key.name, value)
    })
  }

  async handleLook() {
    console.log("Look requested")
  }

  async handleAttack() {
    console.log("Attack requested!")
  }

  get events() {
    const events: Map<typeof GameEvent, (event: GameEvent) => Promise<void>> = new Map()
    events.set(LookRequested, this.handleLook)
    events.set(AttackRequested, this.handleAttack)

    return events
  }
}
